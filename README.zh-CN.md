# Harness Workbench

<p align="center">
  <img src="./docs/images/readme/harness-workbench-logo-dark.svg" alt="Harness Workbench" width="560">
</p>

<p align="center">
  <strong>YOUR PROJECT. YOUR SYSTEM. YOUR INTELLIGENCE.</strong><br>
  把项目、会话、知识芯片和自动化集中到一个本地优先的个人智能工作台。
</p>

<p align="center">
  <a href="./README.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  DeepSeek Harness 0.1.1-rc.2 · Node.js 22.5+ · Local-first RAG · MIT License
</p>

> [!IMPORTANT]
> 当前版本锁定 **DeepSeek Harness 0.1.1-rc.2** 的公开 Session、Files、Subagent 与 Slot 接口。DSH 仍处于候选版本阶段，升级 DSH 前请先验证兼容性。

Harness Workbench 不是另一套聊天内核。它保留 DSH 原生会话作为唯一真相源，在外层增加项目管理、知识芯片、本地 RAG、待办、定时 Agent、每日总结和 Codex 接入，最终把零散的 AI 对话整理成一个可以持续使用的个人工作系统。

```bash
npm install -g dsh-cyberpunk-workbench
dsh-workbench
```

## 界面预览

### 项目化工作台

![Harness Workbench 项目首页](./docs/images/readme/workbench-home.png)

### 原生会话，项目控制面

![项目会话工作台](./docs/images/readme/project-workbench.png)

### 知识芯片背板

![知识芯片背板](./docs/images/readme/knowledge-chips.png)

### 待办与自动化

<img src="./docs/images/readme/project-automation.png" alt="项目待办与自动化控制面" width="420">

### Workbench 设置与 Codex

![Workbench Codex 接入设置](./docs/images/readme/workbench-settings.png)

## 为什么做 Harness Workbench

原生 AI 会话擅长解决眼前的问题，但真实工作往往跨越几天、多个会话、许多文件和不同知识来源。Harness Workbench 解决的是这些会话之外的问题：

- 一个项目为什么开了很多会话，它们分别做过什么？
- 项目依赖哪些文档和知识，它们是否已经完成向量化？
- 今天完成了什么，明天还有哪些事项需要推进？
- 一个定时任务能否真正唤起 Agent，并把执行过程保留成可追溯会话？
- 如何继续使用 DSH 的模型、工具、轨迹、Files API 和子智能体，而不是再复制一套残缺的聊天界面？

Workbench 的答案是：**容器负责组织上下文，DSH Session 负责真正执行。**

## 一套会话，三种工作范围

项目会话、知识芯片会话和独立会话，本质上都是完整的 DSH Session。差别只在于它们继承的工作范围和可用工具。

| 会话范围 | 适合什么 | 自动继承的上下文 | 专属能力 |
| --- | --- | --- | --- |
| **项目会话** | 围绕一个 Workspace 持续工作 | 项目目录、关联知识芯片、显式 `@` 引用 | 待办、定时任务、每日总结、项目会话历史 |
| **知识芯片会话** | 围绕一组文档研究和问答 | 当前知识芯片的文档与向量检索结果 | 文档来源、引用脚注、原始文件打开与下载 |
| **独立会话** | 临时问题、自由探索、跨项目讨论 | 用户显式选择的会话、知识芯片或文件 | 完整 DSH 会话能力，不强制创建项目 |

每个项目和知识芯片都支持多个会话。全局最近会话按日期混合展示三类来源，并使用不同图标标识；更多历史记录可进入全部会话页搜索、筛选、归档和恢复。

新建会话采用延迟创建：打开空白会话页时不会立即生成 Session ID，只有第一条消息真正发送后才创建 DSH Session 并加入最近会话。这使新建、取消和切换会话更接近成熟编码 Agent 的使用方式。

## 项目不是文件夹书签，而是持续工作的控制面

项目绑定一个真实 DSH Workspace，但不会接管或复制你的项目文件。项目卡片用于进入最近会话、创建新会话、查看该项目的全部会话，以及重命名或安全删除项目。

进入项目后，Workbench 使用三联布局：

1. **左侧导航**：新建会话、首页、全部会话、知识芯片、最近会话和设置。
2. **中间会话区**：完整保留 DSH 原生 Chat、Trajectory、模型与推理等级、实时流、工具调用、审批、附件、队列、重试和上下文统计。
3. **右侧项目工具**：待办、定时任务、关联知识芯片和每日总结。

桌面宽屏保持三列；中等宽度把项目工具切换为右侧抽屉；移动端使用互斥导航与工具抽屉。界面支持键盘焦点、Escape 关闭、焦点恢复、`prefers-reduced-motion` 和低透明度降级。

## 知识芯片：把资料接入工作台

Workbench 把知识库设计成可以接入项目的“知识芯片”。一个项目可以关联多个知识芯片，同一个知识芯片也可以服务多个项目；解除关联不会删除文档。

新建知识芯片时可以一次上传多个文件。文件经过解析、分块、Embedding 和向量写入后，页面会显示文件级状态、总体百分比和失败重试入口。支持：

- TXT、Markdown、HTML
- DOCX、PPTX、XLSX
- JavaScript、TypeScript、JSX、TSX
- JSON、YAML、Python、Java、Go、Rust
- C、C++、头文件、CSS、SQL、Shell

单文件上传上限为 50 MiB，解压后的文本上限为 20 MiB。原始文件可以在浏览器中直接打开或下载。

默认使用本地 Ollama：

```text
model:      qwen3-embedding:0.6b
dimensions: 1024
```

Workbench 设置也支持 OpenAI-compatible Embedding API、模型、Endpoint 和向量维度。凭据由 DSH credentials 保存，不写入 Workbench 配置或浏览器存储。配置变化后可以重建全部向量索引。

知识检索不会只在后台悄悄发生：会话 Trajectory 可以看到注入的 knowledge context，最终回答后会附带去重后的来源脚注，并链接到对应原始文档，让用户知道回答参考了哪些资料。

## `@` 引用：在一条消息里组合上下文

Workbench 扩展 DSH 原生输入体验，输入 `@` 可以选择当前可访问的：

- Workspace 文件
- 关联或可用的知识芯片
- 其他 Workbench 会话

图片与普通附件继续使用 DSH 0.1.1-rc.2 Files API。Workbench 不复制上传状态或消息存储，只负责把已选择的来源安全地交给原生会话。

## 待办、定时 Agent 与每日自动化

### 待办

项目待办按今天、未来日期、已过期和已完成组织。手动创建时必须选择预计完成日期和时间；支持搜索、编辑、完成、删除和独立查看已完成记录。

自动生成的次日待办默认截止到次日 18:00。Agent 只根据项目当天会话的用户消息与最终回答，以及当天新增的知识内容判断后续事项。工具调用、Thinking、协议文本和错误信息不会被保存成待办。

### 定时任务

定时任务不是普通提醒。每次到期后，Workbench 会唤起一个真正的 DSH Agent 执行提示词，并把运行过程保留为可见的项目会话：

- **一次性**：指定日期和时间
- **每日**：指定本地时间
- **每周**：指定星期和本地时间
- **每月**：指定每月日期和本地时间

每条规则第一次执行时创建一个项目会话，后续执行复用同一会话上下文。执行继承 DSH 原生模型、preset 与工具能力，不使用无法续聊的 one-shot 子智能体。失败执行同样保留 Session ID 和 Trajectory，方便排查后继续运行。

### 每日总结与次日待办

每个项目可以分别开启：

- `21:00` 每日总结
- `21:00` 次日待办

每日总结读取该项目当天的所有项目会话，不混入独立的知识芯片会话；当天新增的知识内容会作为项目进展的一部分。系统只保存 LLM 的最终正文，生成过程中的工具、Thinking、协议内容和错误都会被拒绝。总结支持立即生成、Markdown 下载和删除。

生成中的状态使用轻量光波反馈；新记录到达时只播放一次提示动画，不用重复的“执行中 / 已完成”文字打断操作。

Workbench 全局时区同时控制定时任务、待办截止时间、每日总结、次日待办和界面时间。默认是 `Asia/Shanghai`，也可以设置其他有效 IANA 时区。

## 完整保留 DSH 0.1.1-rc.2 能力

Workbench 只增加组织层，不替换 DSH 的 ConversationRoot 和 Session 运行时。因此项目、知识芯片和独立会话都可以继续使用：

- Chat / Trajectory 与工具详情
- 模型和推理等级切换
- 流式输出、停止、重试、队列与 steer
- 图片、附件和 Files API
- 权限、审批、命令、计划与上下文统计
- Subagent 活动、会话筛选、消息查看、详情和中断
- DSH 原生设置、模型、插件、Agent Preset 和动态 Slot 扩展

可续聊的子智能体可以继续发送消息；one-shot 子智能体保持只读，避免前端制造底层并不存在的多轮能力。

## 可选 Codex 接入

Codex 桥接默认关闭。普通启动不会读取 `~/.codex/auth.json`。

第一次使用时，进入 **设置 → Workbench → Codex**，点击 **扫描并接入 Codex**。只有这次明确操作才会读取 `${CODEX_HOME}/auth.json` 中的本地 Access Token，并将凭据安全导入 DSH credentials。前端只接收脱敏状态，不会得到 Token 或认证文件内容。

也可以在启动时显式开启：

```bash
dsh-workbench --codex-auth=auto
```

或只向本次 DSH 子进程注入 Token：

```bash
CODEX_ACCESS_TOKEN="..." dsh-workbench
```

Token 不会进入命令行参数、Workbench SQLite、浏览器存储或日志。Codex 本地缓存桥接是可选兼容功能，不是 OpenAI 公开认证 API；缓存格式发生变化时可能需要更新适配。

## 快速开始

### 运行要求

- macOS 或 Linux
- Node.js `>=22.5.0`
- DeepSeek Harness `0.1.1-rc.2`
- 一个已在 DSH 中配置好的生成模型 Provider
- 使用默认本地 RAG 时，需要 Ollama 和 `qwen3-embedding:0.6b`

默认推荐生成模型为 `deepseek-official/deepseek-v4-flash`。Workbench 不伪造 Provider，也不会覆盖用户在 DSH 原生界面中的模型选择。

### 安装与启动

```bash
npm install -g dsh-cyberpunk-workbench
dsh-workbench
```

第一次运行时，启动器会自动注册 DSH Web Profile 并加载包内 patch。之后仍然只需运行 `dsh-workbench`；裸命令等价于 `dsh-workbench web`。

准备默认本地向量模型：

```bash
ollama serve
ollama pull qwen3-embedding:0.6b
```

### 从源码运行

```bash
git clone https://github.com/yeah529/Harness-Workbench.git
cd Harness-Workbench
npm ci
npm run build
./scripts/install.sh
node ./bin/dsh-workbench.js
```

开发当前工作树时，可以使用：

```bash
npm run dev:activate
dsh-workbench
```

`dev:activate` 会构建当前工作树，更新全局命令和 DSH Web Profile 中的开发链接，再执行一次只读诊断，避免启动到旧工作树。

## Proxy：保存的是下次启动配置

Workbench 设置页会明确区分“当前进程正在使用的网络环境”和“下次启动配置”。修改 Proxy 后，需要通过 `dsh-workbench` 重启 DSH 才会生效。

```bash
dsh-workbench --proxy-mode=custom \
  --proxy-url=http://127.0.0.1:7890 \
  --no-proxy=localhost,127.0.0.1
```

也可以直接继承环境变量：

```bash
NODE_USE_ENV_PROXY=1 \
HTTPS_PROXY=http://127.0.0.1:7890 \
dsh-workbench
```

代理和凭据是两条独立链路：端口监听成功不等于模型请求成功，`fetch failed` 与 `MISSING_CREDENTIAL` 需要分别检查。

## 本地数据、删除与恢复

Workbench 默认数据目录：

```text
~/.dsh/cyberpunk-workbench/
```

其中包含 SQLite、上传文件、LanceDB 向量索引和索引日志，不属于 Git 仓库，也不会进入 npm 发布包。

文档解析和默认 Embedding 在本机完成。用户问题、检索到的上下文、项目总结和自动待办会发送给 DSH 当前配置的生成模型 Provider。使用远程 Provider 时，不要上传或索引不允许离开本机的内容。

项目和知识芯片的永久删除采用事务化维护流程：

1. 冻结并展示精确删除清单。
2. 要求输入完整名称，并提示服务将自动重启。
3. 停止 DSH，备份 Session 元数据、Workbench 数据库和向量索引。
4. 只隔离清单内的会话和孤立数据。
5. 新服务通过就绪与一致性检查后才提交删除。
6. 任一步骤失败都会自动恢复；恢复后仍无法启动时，维护页会显示事务编号和恢复命令。

项目真实文件夹和 DSH Workspace 不在删除范围内。解除项目与知识芯片的关联不会触发维护模式，也不会删除共享文档。

## 架构边界

| 能力 | 负责方 |
| --- | --- |
| 消息、流式输出、Chat / Trajectory、模型、附件、工具、审批、队列、重试和压缩 | DSH 原生 Session 运行时 |
| 项目、会话范围、待办、定时任务、总结、知识芯片元数据和本地检索 | Harness Workbench |
| 生成模型 Provider、模型列表和凭据 | DSH 设置与 credentials |
| Embedding Provider、文档索引和向量配置 | Workbench 设置，敏感凭据仍交给 DSH credentials |

这种边界避免出现两套消息、两套模型状态或两套附件上传逻辑。DSH 升级时，Workbench 只适配公开能力边界，而不是重新实现底层 Agent。

## 开发与验证

```bash
npm ci
npm run check
npm pack --dry-run
```

`npm run check` 会构建 Host 与 Client bundle、执行完整 Node 测试、静态架构与发布校验，并检查生成文件语法。

开发守卫：

```bash
npm run dev:doctor   # 只读检查工作树和运行链接
npm run dev:activate # 构建并把运行链接切到当前工作树
npm run premerge     # 要求工作树干净并执行完整检查
```

`premerge` 只负责验证，不会自动提交、合并或推送。

目录结构：

```text
bin/                 Workbench 启动器
src/client/          Workbench 前端与 DSH Slot 组合
src/host/            API、SQLite、调度、Session 与 RAG
src/launcher/        Profile、Proxy 和可选 Codex 启动逻辑
src/maintenance/     事务化删除与自动恢复监督器
scripts/             构建、安装、开发守卫和 Demo 工具
test/                单元、集成、契约与界面测试
```

## 当前限制

- 当前版本只保证与 DSH `0.1.1-rc.2` 的公开接口兼容。
- 定时任务只在 DSH Host 运行时调度，不会安装操作系统级常驻服务。
- 生成 Provider 的网络、限流和模型可用性仍由 DSH 负责。
- Codex 缓存扫描需要用户明确开启，缓存格式变化后可能需要重新适配。
- 默认 Embedding 为本地 Ollama；使用远程 Embedding API 时，文档分块会发送到对应服务。

## License 与声明

[MIT](./LICENSE)

Harness Workbench 是独立开源项目，不是 DeepSeek、CD Projekt Red 或 OpenAI 的官方产品。DeepSeek、Cyberpunk 2077、Codex 及其他产品名称和商标归各自权利人所有。
