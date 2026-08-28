# Harness Workbench Skill 管理设计

日期：2026-08-28

状态：书面规格待确认

目标基线：DeepSeek Harness `0.1.1-rc.2`

## 1. 背景与核心问题

DSH 已经具备 Skill 的运行时发现、优先级合并和按会话工作目录加载能力，但 Workbench 没有独立的 Skill 管理入口。用户目前只能手工操作目录，无法在产品内完成导入、冲突处理、停用、启用、删除和异常诊断。

本功能不重新实现 Skill 运行时。Workbench 只补齐文件系统控制面：管理 DSH 已经识别的规范目录，并让 DSH 原生运行时继续负责会话内发现和调用。

已确认的作用域语义：

- 全局 Skill 对所有项目会话、知识库会话和独立会话生效。
- 项目 Skill 只对该项目 Workspace 内的会话生效。
- 项目 Skill 与全局 Skill 同名时允许共存，项目版本在该项目内覆盖全局版本。
- 项目 Skill 属于本地 Workspace 目录，不属于 Workbench 数据库中的 Project 行。

## 2. 核心决策

采用“Workbench 文件系统控制面 + DSH 原生 Skill 运行时”方案：

```text
本地目录或 ZIP
  → Workbench Client 统一生成 ZIP 上传体
  → Workbench Host 暂存、解压和校验
  → 写入全局或项目规范目录
  → DSH 文件系统 Skill Provider 发现变化
  → 相应作用域的会话获得最新 Skill
```

文件系统是唯一事实源。Workbench 不新增 Skill 数据表，不保存启停状态、安装状态或内容副本。启停状态由目录位置表达，运行时有效性仍由 DSH 的 Skill 发现规则决定。

这一模式参考成熟编辑器的扩展管理约定：本地安装包、已安装列表、全局与 Workspace 范围、启用、停用和卸载是彼此独立的操作。Workbench 只采用与当前 Skill 需求相关的最小子集，不建设市场、在线更新或版本仓库。

## 3. 存储结构

规范目录固定为：

```text
<DSH_HOME>/skills/
├── <skill-name>/
│   └── SKILL.md
├── .disabled/
│   └── <skill-name>/
│       └── SKILL.md
├── .staging/
└── .transactions/

<project-directory>/.dsh/skills/
├── <skill-name>/
│   └── SKILL.md
├── .disabled/
│   └── <skill-name>/
│       └── SKILL.md
├── .staging/
└── .transactions/
```

规则：

- 全局根目录使用 Workbench Host 启动时已经解析的 `DSH_HOME`，不从客户端接收。
- 项目根目录从 `projectId` 对应的 Workbench Project 行读取本地路径，再追加 `.dsh/skills`；客户端不能提交任意目标路径。
- 项目创建时不预建 `.dsh/skills`。首次成功导入时才创建需要的目录。
- 启用状态使用根目录下的 `<skill-name>/`；停用状态使用 `.disabled/<skill-name>/`。
- `.staging` 和 `.transactions` 是实现原子安装和故障恢复的内部目录，不显示为 Skill。
- 不导入或迁移 DSH 支持的其他来源，例如 `.agents/skills`、自定义 Provider 或扁平 `<name>.md` 文件；管理页把无法安全管理的条目标为外部或不受支持来源，不修改它们。

## 4. Skill 身份与包格式

一个导入来源只允许包含一个 Skill。

目录导入要求所选目录根部存在 `SKILL.md`。浏览器目录选择器提供的相对文件集合会在客户端压成 ZIP，保留根内相对路径，不上传用户本机的绝对来源路径。

ZIP 导入只接受以下两种结构：

```text
SKILL.md
scripts/...
```

或：

```text
one-wrapper-directory/
├── SKILL.md
└── scripts/...
```

拒绝以下输入：

- 找不到 `SKILL.md`。
- 包内出现多个 `SKILL.md`。
- 需要递归搜索才能猜测 Skill 根目录。
- 一个 ZIP 中包含多个 Skill。
- ZIP 条目包含绝对路径、`..` 路径穿越、NUL 字符或符号链接。
- 文件数量、压缩体积或解压体积超过限制。

Skill 的规范身份只来自 `SKILL.md` YAML frontmatter 中的 `name`。`name` 和 `description` 都是必填字段；`name` 必须符合 DSH 的 kebab-case Skill 名称语法。ZIP 文件名、所选目录名都不能作为缺失 `name` 时的回退。

成功安装后的目录名始终归一化为 frontmatter `name`。如果手工放入的现有目录名与 frontmatter `name` 不一致，管理页将其标为无效条目，不擅自重命名。

## 5. 产品入口与页面结构

### 5.1 全局入口

左侧边栏固定底部新增“Skills”，位置在“设置”上方，不新增顶部导航。点击后打开独立 Skill 管理页面，默认选中“全局”页签。

独立管理页包含：

- “全局”和“项目”两个作用域页签。
- 项目页签中的项目选择器。
- 当前作用域的安装根路径与复制路径操作。
- 已启用、已停用、无效和被覆盖状态。
- Skill 名称、描述、文件数量和安装目录。
- 导入目录、导入 ZIP、启用、停用、删除和在文件管理器中显示。

浏览器不能可靠读取用户选择来源的绝对路径，因此页面显示的是规范安装路径。ZIP 文件名或所选目录名只在本次导入预览和冲突确认中显示，不写入数据库。

### 5.2 项目快捷入口

项目会话右侧工具栏新增“Skills”页签，只在 `scope.kind === "project"` 时出现。它直接打开当前项目的 Skill 列表，不提供项目切换，也不管理全局 Skill。

桌面端沿用现有右侧 Context Rail；较窄布局沿用现有 Drawer。两个入口共用同一个项目 Skill 列表组件和 API，不复制业务逻辑。

### 5.3 非目标界面

- 不提供 Workbench 内的 `SKILL.md` 或资源文件编辑器。
- 不提供创建 Skill 向导。
- 不提供 GitHub URL、市场、远程下载或自动更新。
- 不提供批量导入、批量启停或批量删除。
- 不提供版本历史、回滚版本或来源追踪数据库。

## 6. 管理服务边界

新增独立的 Skill 管理服务，职责限定为：

1. 根据全局或项目作用域解析受信任的 Skill 根目录。
2. 扫描规范目录并生成管理视图。
3. 校验上传包结构和 frontmatter。
4. 完成安装、替换、启用、停用和删除。
5. 暴露安装路径并调用受控的本机文件管理器显示动作。
6. 恢复中断的替换事务。

它不负责：

- 决定模型是否调用 Skill。
- 修改 DSH Skill Provider 优先级。
- 向会话注入 Skill 内容。
- 保存 Workbench 业务数据库记录。
- 管理不属于两个规范根目录的 Skill 来源。

管理列表必须直接扫描文件系统，而不能只调用 DSH Skill Registry。原因是 Registry 只返回当前胜出的有效 Skill，无法完整呈现停用、无效、同名覆盖和目录冲突状态。

依赖选择保持最小：客户端打包和 Host 解压共同使用仓库已经用于测试资产的 `fflate`，并把它声明为正式运行时依赖；frontmatter 使用成熟的 `js-yaml` 完整解析，并将目前仅由 DSH 包间接带入的版本声明为本包直接依赖。不得用只识别两行标量的自制解析器替代 YAML 解析，也不新增通用归档框架。

## 7. 导入与替换流程

### 7.1 普通导入

1. 用户选择一个目录或 ZIP。
2. 目录输入在客户端转换为 ZIP；ZIP 输入保持原始字节。
3. 客户端检查明显的空输入、文件数量和总字节数，但服务端仍执行全部权威校验。
4. Host 将请求体写入目标 Skill 根目录内的随机 `.staging` 事务目录。
5. Host 安全解压并识别唯一 Skill 根。
6. Host 解析 `SKILL.md`，校验身份、描述和目录结构。
7. 如果目标作用域不存在同名 Skill，Host 使用同文件系统 `rename` 将已校验目录移动到最终位置。
8. Host 返回新的管理条目；客户端刷新列表并显示成功反馈。

### 7.2 同名冲突

同名判断发生在用户已经选定的目标作用域内，同时检查：

```text
<skillsRoot>/<name>/
<skillsRoot>/.disabled/<name>/
```

任一位置存在同名 Skill 时，首次导入返回 `409 SKILL_CONFLICT`，不修改现有目录。响应包含：

- 现有 Skill 的名称、描述、启停状态、文件清单摘要和安装路径。
- 待导入 Skill 的名称、描述、文件清单摘要和本次来源显示名。

客户端弹出“取消”或“替换”确认。用户确认后使用仍保留在页面内存中的 File/Blob 重新上传，并携带 `replace=true`。服务端重新执行完整校验，不能信任第一次请求的结果。

列表页不提供常驻“替换”按钮。更新 Skill 的唯一方式是重新导入同名包并确认替换。

### 7.3 跨作用域同名

全局与项目同名不是导入冲突，不触发替换确认。项目页在当前项目确实存在同名全局 Skill 时显示“覆盖全局版本”；全局页不遍历全部项目计算反向覆盖关系。实际运行时仍由 DSH 原生优先级决定，Workbench 不复制覆盖算法。

### 7.4 替换状态保持

如果现有 Skill 已启用，替换后的新内容保持启用；如果现有 Skill 位于 `.disabled`，替换后仍保持停用。替换内容与改变启停状态是两个不同的用户意图，不能在一次导入中隐式合并。

## 8. 原子操作与故障恢复

首次安装是一个同文件系统目录 `rename`，对观察者表现为一次完整出现。

替换需要两次目录移动。为避免异常留下半安装状态，Host 使用轻量文件事务：

```text
.transactions/<transaction-id>.json
.staging/<transaction-id>/incoming/
.staging/<transaction-id>/previous/
```

流程：

1. 写入并 `fsync` 事务描述，记录作用域、Skill 名称、原状态和精确相对路径。
2. 将现有目录移动到 `previous`。
3. 将已校验的 `incoming` 移动到最终位置。
4. 确认最终目录可重新扫描后删除 `previous` 和事务描述。

普通错误会立即回滚：如果新目录未成功进入最终位置，则把 `previous` 移回原路径。

进程崩溃后的下一次 Skill 列表或变更请求先执行恢复：

- 最终目录不存在且 `previous` 存在：恢复旧目录。
- 最终目录存在且 `previous` 存在：以最终目录为已提交结果，删除旧备份。
- 状态无法唯一判断：停止自动处理，返回 `SKILL_TRANSACTION_RECOVERY_REQUIRED` 并保留现场。

同一进程内按“作用域根目录 + Skill 名称”串行化变更，避免两个导入或启停操作同时修改同一目标。设计不引入跨进程锁；同一 `DSH_HOME` 同时运行多个 Workbench Host 不属于首版支持场景，但磁盘状态冲突必须失败关闭，不能覆盖未知变化。

## 9. 启用、停用与删除

启用和停用分别在规范根目录与 `.disabled` 之间执行同文件系统 `rename`。操作前重新扫描目标：

- Skill 已处于目标状态时返回当前条目，保持幂等。
- 源状态不存在时返回 `404 SKILL_NOT_FOUND`。
- 启用和停用位置同时存在同名目录时返回 `409 SKILL_STATE_CONFLICT`，不猜测哪个目录获胜。
- 无效目录、符号链接和不受支持的外部来源不能通过正常 Skill 操作修改，只提供诊断以及复制或显示其所在的受信任 Skill 根目录。

删除弹窗必须显示作用域、Skill 名称、当前状态和准确安装路径。用户确认后，Host 再按同一事实重新解析目标并删除唯一目录。接口不接受通配符、递归根路径或客户端绝对路径。

删除不提供回收站或版本恢复。因为这是不可恢复操作，UI 使用独立确认弹窗；但不要求用户手工输入名称，避免把低频包管理做成重型维护流程。

## 10. API 契约

接口位于现有 `/api/cpwb` 前缀下：

```text
GET    /skills?scope=global
GET    /skills?scope=project&projectId=<id>
POST   /skills/import
PATCH  /skills/:name
DELETE /skills/:name
POST   /skills/:name/reveal
```

导入使用原始 ZIP 请求体，作用域、项目 ID、来源显示名和 `replace` 放在受校验的请求头中。目录导入与 ZIP 导入对 Host 使用同一种格式。

`PATCH /skills/:name` 只接受 `enable` 或 `disable` 操作。删除和显示目录通过作用域参数解析目标。所有 `:name` 都必须先通过 kebab-case 校验再参与路径拼接。

列表响应返回：

```json
{
  "scope": { "kind": "project", "projectId": 12 },
  "rootPath": "/absolute/project/.dsh/skills",
  "items": [
    {
      "name": "example-skill",
      "description": "Example routing description",
      "state": "enabled",
      "health": "valid",
      "path": "/absolute/project/.dsh/skills/example-skill",
      "fileCount": 4,
      "shadowsGlobal": true
    }
  ],
  "diagnostics": []
}
```

稳定错误码至少包括：

- `INVALID_SKILL_SCOPE`
- `PROJECT_NOT_FOUND`
- `PROJECT_PATH_UNAVAILABLE`
- `SKILL_ARCHIVE_TOO_LARGE`
- `SKILL_ARCHIVE_UNSAFE`
- `SKILL_PACKAGE_INVALID`
- `SKILL_NAME_INVALID`
- `SKILL_CONFLICT`
- `SKILL_STATE_CONFLICT`
- `SKILL_NOT_FOUND`
- `SKILL_PERMISSION_DENIED`
- `SKILL_TRANSACTION_RECOVERY_REQUIRED`
- `FILE_MANAGER_UNAVAILABLE`

用户可修复的错误返回中文展示消息和结构化 details；服务器日志保留底层错误原因，但响应不泄露 Workbench 根目录之外的路径。

## 11. 安全与资源限制

首版默认限制：

- 上传 ZIP 最大 50 MiB。
- ZIP 条目最多 1,000 个。
- 解压后总大小最大 100 MiB。
- 单个文件最大 50 MiB。
- 目录选择器在压缩前执行相同的文件数量和总大小预检。

Host 必须在写入最终目录前验证全部限制。ZIP 解压不得直接信任库返回的文件名；每个条目都经过 POSIX 与 Windows 路径归一化检查。拒绝符号链接、设备文件、绝对路径、盘符路径、UNC 路径、空路径段和 `..`。

扫描和变更使用 `lstat`，不跟随 Skill 根目录内的符号链接。普通资源文件允许嵌套目录，但所有最终路径必须保持在暂存根内。文件权限使用普通用户可读写权限，不保留 ZIP 中的可执行位或特殊权限。

项目路径不存在、不是目录或不可写时失败关闭，不自动把 Project 改绑到其他目录。全局目录不可写时同样返回明确错误，不尝试修改系统权限。

## 12. DSH 运行时一致性

Workbench 写入的是 DSH 已经约定的规范目录，因此不向会话数据库写 Skill 快照，也不重启 DSH。DSH 文件系统 Provider 的变更监听负责使后续 Skill 列表和调用看到新状态。

管理操作成功只表示文件系统事务完成。UI 可以立即刷新管理列表，但不把这等同于“当前正在执行的模型调用已经重新加载”。如果 DSH Registry 在当前宿主中可用，Host 可以在短时间内只读校验新 Skill 是否可发现；该校验失败显示“已安装，运行时尚未确认”，不能回滚已经成功的文件系统事务。

项目 Skill 的运行时上下文使用项目 Workspace 的真实工作目录。知识库会话和独立会话使用各自隔离目录，因此不会意外继承任一项目的 `.dsh/skills`。

## 13. 文件管理器动作

“在文件管理器中显示”只接受服务端扫描结果中的精确目录。Host 根据平台调用：

- macOS：Finder 显示目标。
- Windows：Explorer 选择目标。
- Linux：使用可用的桌面打开命令打开父目录。

命令通过参数数组启动，不拼接 shell 字符串。平台不支持或 Host 不在图形桌面环境时返回 `FILE_MANAGER_UNAVAILABLE`；页面仍允许复制安装路径。远程浏览器触发的是 Host 所在机器的文件管理器，界面文案必须明确这一点。

## 14. 前端状态与反馈

全局管理页和项目右侧面板共用以下状态模型：

- 初始加载和刷新。
- 空态，分别提示全局或当前项目尚未安装 Skill。
- 导入压缩和上传进度。
- 校验失败。
- 同名冲突确认。
- 替换、启停和删除进行中。
- 操作成功反馈。
- 根目录不可用或事务恢复阻塞。

变更操作期间只禁用受影响条目和对应按钮，不冻结整个页面。项目切换或组件卸载时中止只读请求；已进入 Host 文件事务的写请求不依赖浏览器连接继续完成，重连后通过列表读取真实状态。

基本可访问性要求：

- 页签和右侧工具使用正确的选中状态与键盘焦点。
- 所有图标按钮有可读标签。
- 确认弹窗将焦点限制在弹窗内并把焦点返回触发按钮。
- 状态不只依赖颜色，文字同时表达启用、停用、无效和覆盖。

## 15. 测试与验收

### 15.1 纯逻辑与文件系统测试

- 解析合法和非法 frontmatter。
- 根目录 ZIP、单层包装 ZIP 和目录打包 ZIP。
- 多 Skill、递归猜测、路径穿越、符号链接、条目数和体积限制。
- 全局和项目根路径解析，客户端路径注入无效。
- 首次导入、同作用域冲突、跨作用域同名和停用状态替换。
- 替换中每个文件操作失败点的回滚。
- 中断事务恢复。
- 启用、停用幂等和双目录冲突。
- 精确删除不会影响同级其他 Skill。
- 无效、外部和不受支持条目只读展示。

### 15.2 API 测试

使用临时 `DSH_HOME` 和临时项目目录执行真实请求，覆盖列表、导入、二次替换、启停、删除和错误码。断言 API 不接受任意目标路径，并验证冲突响应同时包含现有包和待导入包的安全摘要。

### 15.3 客户端测试

- 导航 Store 支持 `skills` 页面。
- 左侧 Skills 入口位于设置上方，默认打开全局页签。
- 项目页签要求选择有效项目。
- 项目会话右侧显示 Skills，知识库和独立会话不显示。
- 目录和 ZIP 选择走统一上传接口。
- `409 SKILL_CONFLICT` 只在导入流程显示替换确认。
- 列表不出现常驻替换操作。
- 加载、空态、错误、成功、禁用和确认弹窗可正确渲染。

### 15.4 集成与视觉验证

- 运行 `npm run check`，覆盖构建、Node 测试和仓库验证脚本。
- 在真实 Workbench 开发服务导入测试 Skill，验证规范目录实际生成。
- 创建全局和项目同名 Skill，验证项目会话看到项目版本，独立会话看到全局版本。
- 停用、启用和替换后重新读取 DSH Skill 列表。
- 在桌面、窄屏和移动布局实际渲染两个入口、管理页、项目右侧面板和所有弹窗。
- 检查浏览器控制台错误、键盘操作、溢出和真实长描述。

## 16. 发布、迁移与回滚

本功能不修改数据库 Schema，不需要数据迁移。现有规范目录中的有效 Skill 会自动出现在管理页；`.agents/skills`、自定义 Provider 和扁平文件保持原状，不迁移、不删除。

发布前只需要构建并安装新的 Workbench 包。代码回滚不会删除用户已经导入的 Skill；旧版本 Workbench 不显示管理入口，但 DSH 仍按规范目录继续加载它们。

内部 `.staging` 和 `.transactions` 中的未完成事务由新版本恢复。若代码回滚到不认识这些目录的旧版本，它们是隐藏目录，不会被 DSH 当作 Skill；用户数据仍保留，后续重新升级可继续恢复。

## 17. 完成标准

只有同时满足以下条件才能声明端到端完成：

1. 两个 UI 入口按确认位置出现并可用。
2. 本地目录和 ZIP 都能导入全局与项目作用域。
3. 同作用域同名只在导入时提示替换，取消不产生修改。
4. 替换保持原启停状态，并能在故障注入后回滚或恢复。
5. 启用、停用、删除和显示目录只影响准确目标。
6. 全局与项目同名共存，运行时作用域结果符合预期。
7. 无效输入和危险 ZIP 失败关闭。
8. `npm run check` 通过。
9. 桌面、窄屏和移动端完成真实渲染与关键交互验证。
10. 主 checkout 保持干净，全部改动位于已注册的非 `main` worktree。
