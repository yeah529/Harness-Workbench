# Harness Workbench 统一会话与上下文架构设计

日期：2026-08-23
状态：已完成交互设计确认，等待规格复审
目标基线：DeepSeek Harness `0.1.1-rc.2`

## 1. 背景

当前 Workbench 已能创建项目、知识库和独立范围的 DSH Session，但产品层仍存在三类问题：

1. 项目卡片主要围绕“最近一次会话”工作，项目内缺少清晰的多会话层级。
2. 知识库同时使用 `knowledge_chats` 与 `workbench_sessions` 表示聊天身份，产生重复状态和分支逻辑。
3. 待办、定时任务、知识库、每日总结与会话入口混在同一层，导致资源归属和右侧工具栏职责不清。

本次重构不再把项目会话、知识库会话和独立会话视为三套聊天协议。三者统一使用 DSH Session，只通过主归属和上下文来源区分。

## 2. 目标

- 项目支持多个会话，并可关联多个知识库。
- 知识库支持多个会话，并可被多个项目关联。
- 独立会话区支持多个无容器归属的会话。
- 每条会话只有一个主归属，可在项目、知识库和独立范围之间移动。
- 会话可索引知识库、Workspace 文件、上传文件和其他会话。
- 左侧导航采用“当前容器优先”，底部设置与生产版 Harness Workbench Logo 永久可见。
- 中间会话区保留 RC.2 原生对话能力，只做 Workbench 视觉融合。
- 右侧工具栏按当前会话范围动态显示功能。
- 首条有效消息发送前不创建 DSH Session，避免空会话污染历史。
- 删除项目或知识库时由用户明确决定保留还是删除所属会话。

## 3. 非目标

- 不复制 DSH ConversationRoot、消息存储、模型选择、推理强度、工具调用或 Subagent 内核。
- 不支持一个会话同时属于多个项目或知识库。
- 不支持无项目归属的定时任务。
- 不递归展开被引用会话自己的引用关系。
- 不保留 `knowledge_chats` 的长期兼容层。
- 不在删除项目时删除用户磁盘上的 Workspace 文件夹。
- 不在删除知识库时卸载本地 Embedding 模型或删除原始外部文件。

## 4. 统一资源模型

```text
Harness Workbench
├── 项目
│   ├── 多个项目会话
│   ├── 多个关联知识库
│   ├── Workspace 文件
│   └── 项目工具：待办、定时任务、每日总结
├── 知识库
│   ├── 多个知识库会话
│   ├── 文档与向量索引
│   └── 关联到零个或多个项目
└── 独立会话区
    └── 多个无容器归属的会话
```

“独立会话区”是全局列表投影，不是新的容器实体。每条会话统一表示为：

```text
Session
├── DSH session_id
├── scope_kind: project | knowledge_base | independent
├── scope_id: project/knowledge base id，独立会话为空
├── title projection
├── lifecycle status
└── effective context sources
```

DSH Session 是消息、模型、推理、工具和实时状态的唯一真实来源。Workbench 只保存归属、导航投影、业务关联和上下文元数据。

## 5. 项目与知识库关系

项目和知识库是多对多关系：

- 一个项目可关联多个知识库。
- 一个知识库可被多个项目关联。
- 项目会话默认继承项目 Workspace 和全部关联知识库。
- 知识库会话默认继承当前知识库文档。
- 独立会话默认没有继承来源。

继承关系动态计算。项目新增或移除知识库后，已有项目会话立即使用新的项目默认来源；知识库文档新增、更新或删除后，相关会话使用最新索引。

会话可为某个继承来源保存停用覆盖。项目后来重新关联同一知识库时，该会话仍保持停用。用户手动固定的来源不随容器关联解除而消失，只要来源本身仍存在。

## 6. 会话归属和移动

每条会话只有一个主归属：项目、知识库或独立。知识库、文件和其他会话只是上下文来源，不会造成多重归属。

移动会话时执行智能重建：

1. 变更 `scope_kind` 和 `scope_id`。
2. 停止使用旧容器的动态继承来源。
3. 使用新容器的动态继承来源。
4. 保留仍然有效的手动固定来源。
5. 保留适用于同一来源的手动停用覆盖。
6. 不修改 DSH 消息、模型状态或原始会话历史。

## 7. 左侧导航和三联会话页

会话页统一使用三联结构：

```text
左侧全局导航 | 中间 DSH 会话 | 右侧上下文工具
```

### 7.1 左侧固定区

- 新建会话。
- 首页。
- 全部会话。
- 知识库。

不提供顶部“项目／知识库／独立”范围切换器，也不在左侧设置“全局定时”入口。

### 7.2 当前容器区

- 项目会话显示当前项目及最近 3 个项目会话。
- 知识库会话显示当前知识库及最近 3 个知识库会话。
- 独立会话只显示当前会话，不创建虚假的独立容器。
- 区域底部显示“查看全部 N 个会话”。

### 7.3 最近会话区

- 展示其他容器的最近会话。
- 排除已经出现在当前容器区的会话。
- 每条显示范围、容器名称和更新时间。
- 点击后直接切换 DSH Session，不显示切换 Toast。

### 7.4 底部固定区

- DSH 设置按钮。
- `SidebarBrand` 使用的生产版 Harness Workbench SVG。
- Footer 不参与会话列表滚动，在所有支持视口始终可见。

### 7.5 中间会话区

中间区域继续由 DSH 原生 ConversationRoot 承载：

- 对话与轨迹。
- 模型和推理强度。
- Files API、附件和图片上传。
- `@` 上下文。
- 工具调用、审批、队列和实时流。
- Subagent 活动和详情。

Workbench 可以重写 CSS 和外层组合，但不得声明第二个 `conversation.session`、过滤 `conversation.view`，也不得手工复制 DSH 消息渲染器。

### 7.6 右侧工具区

- 项目会话：待办、定时任务、关联知识库、每日总结。
- 知识库会话：文档、索引、关联项目、全局定时。
- 独立会话：上下文、文件、Subagent、全局定时。

全局定时列表中的每条任务必须显示所属项目，并支持项目、状态和触发时间筛选。

## 8. 进入容器的行为

- 点击项目卡片恢复该项目最近一次会话。
- 项目没有会话时进入项目空态，引导创建第一条项目会话。
- 项目卡片保留独立的“新建会话”快捷按钮。
- 点击知识库主体进入知识库管理。
- 点击知识库的“新建会话”创建知识库草稿会话。
- “全部会话”统一搜索和筛选三种范围，不建立新的聊天协议。

## 9. 统一新建会话流程

左侧“新建会话”是唯一全局入口，并按当前位置预选归属：

- 项目中预选当前项目。
- 知识库中预选当前知识库。
- 首页、全部会话或独立会话中预选独立会话。

弹窗只包含：

1. 项目／知识库／独立归属选择。
2. 具体项目或知识库选择。
3. 默认继承上下文预览。
4. “进入新会话”按钮。

弹窗不提供标题输入。进入后先显示客户端本地草稿页，不创建 DSH Session。会话名称暂时显示“新会话”。

### 9.1 首条消息激活

发送第一条有效消息时：

1. 校验归属和上下文来源。
2. 创建 DSH Session。
3. 写入 Workbench 归属投影。
4. 安装 Context Resolver。
5. 将原始消息提交给 DSH。
6. 首次响应成功后把会话标记为 `active`。
7. 使用第一句有效用户正文生成标题并加入最近会话。

用户在发送前退出草稿页时直接丢弃本地草稿，不弹出删除确认，也不产生空会话。

如果 DSH Session 已创建但首次提交或响应失败，Workbench 保存 `draft_failed` 状态和重试入口，不把它加入普通最近会话。重试成功后转为 `active`。用户输入必须保留。

## 10. 上下文来源

支持四种来源：

```text
knowledge_base | workspace_file | uploaded_file | session
```

产品状态包括：

- `inherited`：从项目或知识库动态计算，不物化保存。
- `pinned`：用户固定到会话，持续参与后续检索。
- `one_shot`：只服务当前消息。
- `disabled`：对动态继承来源的会话级停用覆盖。

Workbench 持久化固定来源和停用覆盖；继承来源由 Context Resolver 根据当前容器实时计算；单次来源按 DSH 消息 ID 保存紧凑引用元数据。

### 10.1 文件

- DSH Files API 负责目录浏览、文件读取、图片和附件上传。
- 项目 Workspace 不会把全部文件正文直接拼进每条消息。
- `@文件` 生成单次来源，用户可升级为固定来源。
- 大文件按类型解析和分块检索，避免上下文溢出。

### 10.2 会话

- `@会话` 支持单次引用和固定引用。
- 单次引用可一键升级为固定引用。
- 禁止引用当前会话自身。
- 不递归展开被引用会话自己的知识库、文件或会话引用。
- 直接或间接引用不会形成递归检索链。

会话索引只包含完整的用户正文与 Assistant 最终正文问答对，明确排除：

- Thinking 和 Reasoning。
- Tool call 与工具原始输出。
- 中间流式片段。
- 错误、重试和网络日志。

会话向量复用 Workbench 已有 Chunk／Vector 基础设施，通过来源类型区分，不建设第二套向量服务。

## 11. 项目工具和自动化

### 11.1 待办

- 待办严格属于项目。
- 只在项目会话右栏和项目工作台显示。
- 支持新增、编辑、删除、完成、恢复和查询已完成。
- 手动创建必须选择预计完成日期和时间。
- 自动创建默认截止到次日 18:00，允许修改。
- 按今天、未来、已过期和已完成组织。

### 11.2 定时任务

- 每条定时任务必须属于一个项目。
- 项目会话只显示当前项目任务。
- 知识库和独立会话通过右栏查看全局聚合任务。
- 支持单次、Daily、Weekly 和 Monthly。
- 创建与编辑统一使用日期加时间弹窗。
- 所有触发与界面显示使用 Workbench 全局时区。

### 11.3 每日总结

- 每日总结严格属于项目，默认每天 21:00，可按项目关闭。
- 读取当前时区当天的全部项目会话。
- 不读取知识库会话或独立会话。
- 可加入当天关联知识库文档的新增、更新和删除摘要。
- 输入只包含用户正文和 Assistant 最终正文。
- 生成失败时保存失败状态和可读原因，不创建伪总结正文。
- 支持立即生成、删除和下载 Markdown。

### 11.4 次日待办

- 根据当天项目会话、已完成和未完成待办及项目总结生成。
- 使用 Workbench 设置中的可编辑提示词。
- 对规范化标题和目标日期去重。
- 模型错误、工具输出和 Thinking 不得落为待办内容。

## 12. 会话管理

每条会话提供：

- 重命名。
- 移动到项目。
- 移动到知识库。
- 转为独立会话。
- 管理固定上下文。
- 永久删除。

首条消息自动生成标题。用户手动重命名后设置标题锁，后续消息不得覆盖；重命名同时更新 DSH 耐久标题和 Workbench 列表投影。

## 13. 删除项目或知识库

删除容器必须二次确认并展示容器名称、会话数量、关联数量和清理范围。用户必须选择：

1. **保留会话并解除关联**：默认推荐。全部所属会话转为独立会话，移除容器继承来源，保留仍然存在的固定来源。
2. **永久删除会话**：同时删除所属 DSH Session、Workbench 会话投影、上下文绑定和消息引用元数据。该选项使用危险色，并要求输入容器名称确认。

额外边界：

- 删除项目只解除 Workbench 项目注册，不删除磁盘 Workspace。
- 删除知识库会删除知识库记录、Workbench 文档副本、解析内容、Chunks 和向量索引。
- 不删除原始外部文件，不卸载 Embedding 模型。
- 其他会话引用了被删除会话时，显示“引用来源已删除”，忽略该来源，不阻塞剩余会话。

## 14. 数据模型

### 14.1 复用 `workbench_sessions`

```text
session_id            TEXT PRIMARY KEY
scope_kind            project | knowledge_base | independent
scope_id              INTEGER NULL
provider              TEXT NULL
model                 TEXT NULL
reasoning_effort      TEXT NULL
title                 TEXT NULL
title_locked          INTEGER NOT NULL DEFAULT 0
lifecycle_status      draft_failed | active
created_at            TEXT
updated_at            TEXT
```

`chat_id` 随 `knowledge_chats` 路径删除。模型字段只是列表投影；原生 DSH Header／selection 仍是模型路由真相源。

### 14.2 新增关联表

```text
project_knowledge_bases(project_id, knowledge_base_id, created_at)
```

主键为 `(project_id, knowledge_base_id)`，删除项目或知识库时按明确容器策略清理关系。

### 14.3 上下文覆盖

```text
session_context_sources(
  session_id,
  source_kind,
  source_id,
  mode,              -- pinned | disabled
  created_at,
  updated_at
)
```

唯一约束为 `(session_id, source_kind, source_id)`，同一来源不能同时为 `pinned` 和 `disabled`；用户切换状态时更新现有行。`disabled` 只对当前容器实际继承的来源生效，动态继承本身不写入该表。

### 14.4 消息级引用

```text
message_context_refs(
  session_id,
  message_id,
  source_kind,
  source_id,
  created_at
)
```

只保存引用身份，不复制引用正文。

## 15. 服务组件

- `SessionRepository`：统一列表、归属、生命周期、标题投影。
- `ContextResolver`：计算容器动态默认值、固定来源和停用覆盖。
- `SessionIndexAdapter`：抽取最终问答对并复用向量基础设施。
- `ContainerService`：项目／知识库关联、移动和删除策略。
- `WorkbenchSessionAdapter`：激活草稿、连接 Context Resolver 与 DSH Session。
- `AutomationService`：按项目、全局时区和自定义提示词运行总结与待办。

UI 不得直接操作数据库或 DSH 内部对象。服务通过稳定 ID、结构化输入和稳定错误码交互。

## 16. API 边界

现有 `/api/cpwb/chat/sessions` 继续作为统一会话入口，但契约改为统一 scope：

- `GET /chat/sessions`：按 `scopeKind`、`scopeId`、搜索、时间和分页查询。
- `POST /chat/sessions`：首条消息发送时接收 `{ scope: { kind, id? }, pinnedSources }`，创建 DSH Session 并保存 scope；独立会话的 `id` 必须为空。
- `PATCH /chat/sessions/:id`：接收 `{ title }`、`{ scope }` 或 `{ retryDraft: true }` 中的一种操作，用于重命名、移动归属或恢复失败草稿。
- `DELETE /chat/sessions/:id`：永久删除单条会话。
- `GET/PUT/DELETE /chat/sessions/:id/context`：管理固定来源和停用覆盖。
- `POST /chat/sessions/:id/context/promote`：把消息级单次引用提升为固定来源。
- `GET/POST/DELETE /projects/:id/knowledge-bases`：维护项目知识库关系。

具体 Prompt 正文仍走 DSH 原生会话路径，不复制进 Workbench API。WorkbenchSessionAdapter 在首次提交前创建 Session，随后把用户原始输入交给原生 Prompt；失败时返回稳定的 `DRAFT_ACTIVATION_FAILED`、`CONTEXT_SOURCE_UNAVAILABLE` 或 DSH 原生错误。

## 17. 错误处理

- 上下文来源不存在或无权访问时阻止发送，并明确列出失败来源。
- 知识库索引未就绪时返回可重试状态，不把空检索伪装为成功。
- Session 引用删除后标记为不可用，不导致整个会话崩溃。
- 容器移动使用数据库事务更新 scope 和覆盖关系。
- DSH Session 创建成功但首次提交失败时保留 `draft_failed`，不自动删除可重试状态。
- 每日总结和次日待办只有 Assistant 最终正文通过校验后才能落库。
- 所有用户可见错误使用稳定错误码和中文可读说明，不展示认证令牌、代理凭据、绝对个人路径或工具原始日志。

## 18. 迁移策略

这是预发布阶段重构，不保留废弃双会话路径：

- 提升数据库 Schema 版本。
- 删除 `knowledge_chats` 表、Repository、API 分支和 `chatId` 客户端状态。
- 删除三类 scope 的分支式创建／恢复路径，统一通过 WorkbenchSessionAdapter。
- 保留满足 scope 约束且能解析 DSH Session 的 `workbench_sessions` 投影。
- 同一 `dsh_session_id` 同时存在于 `knowledge_chats` 和 `workbench_sessions` 时只保留统一投影；旧知识库行随旧表删除。
- 只存在于 `knowledge_chats` 的旧行不转换为第二种兼容对象；删除旧投影不删除对应 DSH Session。
- 不静默删除全部 DSH 历史。
- 无法确认归属的 DSH Session 保留，并提供一次性“清理旧 Workbench 会话”入口；入口必须先展示精确 Session ID 清单，只允许删除数据库映射能够证明由旧 Workbench 创建的对象。
- 本地开发和测试使用隔离 `DSH_HOME`、临时数据库和模拟项目。

不新增长期兼容适配器。迁移完成后，生产代码和测试均不得再引用 `knowledge_chats`、`chatId` 或旧知识库会话恢复路径。

## 19. 测试与验收

### 19.1 自动化测试

- 三种 scope 下的多会话创建、筛选、移动和删除。
- 项目关联多个知识库和动态继承。
- 固定来源、停用覆盖和容器移动保留规则。
- `@文件／知识库／会话` 的单次和固定引用。
- 会话索引排除 Thinking、Tools、错误和流式片段。
- 首条消息失败、重试和空草稿退出。
- 容器删除时“保留转独立”和“永久删除”两条路径。
- 每日总结只读取当前时区当天项目会话的最终正文。
- 全局定时列表显示项目标签并按全局时区计算。

### 19.2 RC.2 真实集成

在隔离环境真实验证：

- 原生对话与轨迹。
- 模型和推理强度切换。
- Files API、图片和附件上传。
- `@` 文件、知识库和会话引用。
- Tool call、审批、队列和实时流。
- Subagent 活动、筛选、会话内容和详情。
- 网络错误、模型错误和重试。
- 原生模型、插件、General Settings 与 Workbench Settings 共存。

### 19.3 浏览器验收

至少验证 `1280×720`、`768×900`、`390×844`：

- 左下角生产 SVG Logo 永久可见。
- 左栏、中间 ConversationRoot 和右栏无重叠或横向溢出。
- 项目、知识库和独立会话显示正确工具入口。
- 新建会话弹窗可通过键盘操作，关闭后恢复焦点。
- 草稿、失败、空态、索引未就绪和来源删除状态清楚。
- 页面自身 Console error／warning 为零。

## 20. 实施顺序

1. 统一会话 Schema、Repository 和 API。
2. 移除 `knowledge_chats` 双身份路径。
3. 实现本地草稿和首条消息激活生命周期。
4. 重构左侧当前容器导航和三联会话壳。
5. 实现项目知识库多对多关系和 Context Resolver。
6. 实现文件、知识库和会话来源检索及消息引用提升。
7. 联动项目工具、全局定时、每日总结和次日待办。
8. 完成 RC.2 原生能力、响应式、安全和开源发布验收。

## 21. 验收结论

本设计完成后，用户应感知到的是一套统一聊天产品：项目和知识库提供长期工作上下文，独立会话提供无容器聊天，三者共享 DSH 原生能力；左侧负责定位会话，右侧负责当前上下文工具，Workbench 不再维护相互竞争的聊天实现。
