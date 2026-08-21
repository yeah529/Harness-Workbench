# Harness Workbench

<p align="center">
  <img src="./src/client/assets/harness-workbench-logo.svg" alt="Harness Workbench" width="380">
</p>

<p align="center">
  面向 DeepSeek Harness 的项目化、赛博朋克风格智能工作台。
</p>

<p align="center">
  <a href="./README.md">English</a> · 简体中文
</p>

> [!IMPORTANT]
> 当前版本面向 **DeepSeek Harness 0.1.0-rc.8**。DSH 仍处于候选版本阶段，升级 DSH 前请先验证接口兼容性。

Harness Workbench 在 DSH Web 客户端上增加项目卡片、原生会话、本地知识库、待办、定时任务和每日项目自动化。它保留 DSH 会话引擎作为唯一真相源，在其外层提供面向项目的工作空间。

## 核心能力

- 项目卡片首页，支持新建、重命名、删除和继续最近会话。
- 项目内三联布局：左侧导航、中间 DSH 原生会话、右侧项目工具。
- 支持从首页或知识库创建不隶属于项目的独立会话。
- 最近会话可统一切换项目、知识库和独立会话。
- 项目待办必须选择预计完成日期和时间，支持编辑、完成和逾期提醒。
- 项目定时任务支持一次性、每日、每周和每月执行。
- 每日 21:00 自动生成项目总结和次日待办，可按项目分别开关。
- 本地 RAG 知识库支持文档上传、向量化、检索、重建和删除。
- 自适应赛博朋克风格界面，支持键盘操作、低动态效果和透明度降级。

## 架构边界

Workbench 不替换 DSH 的会话运行时。

| 能力 | 负责方 |
| --- | --- |
| 消息、流式输出、对话/轨迹、模型与推理等级、附件、工具、审批、队列、重试、压缩 | DSH 原生会话运行时 |
| 项目、会话范围、待办、定时任务、总结、知识库元数据、SQLite、向量检索 | Harness Workbench |
| 生成模型凭据和 Provider 配置 | DSH 设置与 credentials |
| Embedding Provider 和索引配置 | Workbench 设置；密钥通过 DSH credentials 保存 |

## 运行要求

- macOS 或 Linux
- Node.js `>=22.5.0`
- DeepSeek Harness `0.1.0-rc.8`
- 默认本地向量化方案需要 Ollama
- 已在 DSH 中配置可用的生成模型 Provider

默认推荐生成模型为 `deepseek-official/deepseek-v4-flash`。默认本地向量模型为 `qwen3-embedding:0.6b`，维度 1024。二者均可在设置中修改。

## 快速开始

```bash
git clone https://github.com/yeah529/Harness-Workbench.git
cd Harness-Workbench
npm ci
npm run build
```

准备默认本地向量模型：

```bash
ollama serve
ollama pull qwen3-embedding:0.6b
```

安装到 DSH Web Profile：

```bash
./scripts/install.sh
dsh web
```

安装脚本会把当前目录链接到 DSH Web Profile，并确保只有一条 `dsh-cyberpunk-workbench` 插件注册。发现无关的同名路径或重复注册时会停止，不会静默覆盖。

也可以使用项目自带启动器：

```bash
node ./bin/dsh-workbench.js web
```

如果已通过 npm 安装，则可使用：

```bash
dsh-workbench web
```

## 知识库

默认通过 Ollama 在本地完成文档向量化。Workbench 设置还支持 OpenAI-compatible Embedding API，并允许配置模型和向量维度。

支持的内容包括：

- TXT、Markdown、HTML
- DOCX、PPTX、XLSX
- JavaScript、TypeScript、JSX、TSX
- JSON、YAML、Python、Java、Go、Rust
- C、C++、头文件、CSS、SQL、Shell

单文件上传上限为 50 MiB，解压后文本上限为 20 MiB。删除知识库时，会同步删除它拥有的文档、分块、向量索引和知识库会话。项目关联知识库仅表示可供该项目检索，不会把知识库转为项目私有。

在会话输入中，`@` 引用可索引受支持的会话来源、关联知识库，以及 DSH host 授权访问的当前工作目录文件。

## 项目与自动化

项目绑定一个 DSH Workspace。删除项目时，会删除 Workbench 中的项目元数据、待办、定时任务、总结、项目会话和项目独占索引文档；**不会删除真实文件夹或 DSH Workspace**，也不会删除共享知识库的文档。

手动创建待办时必须选择日期和时间。自动生成的次日待办默认截止到次日 18:00。定时任务支持：

- 一次性：指定日期和时间
- 每日：指定本地时间
- 每周：指定星期和本地时间
- 每月：指定每月日期和本地时间

Workbench 全局时区同时控制定时任务、待办截止时间、每日总结、次日待办和界面时间显示。默认值是 `Asia/Shanghai`，也可填写其他有效 IANA 时区。

## Proxy 设置

Proxy 作为“下次启动”配置保存，由 Workbench 启动器应用。设置页会区分当前进程实际生效的网络环境与下次启动配置。

示例：

```bash
dsh-workbench web --proxy-mode=custom \
  --http-proxy=http://127.0.0.1:7890 \
  --https-proxy=http://127.0.0.1:7890
```

```bash
NODE_USE_ENV_PROXY=1 HTTPS_PROXY=http://127.0.0.1:7890 dsh-workbench web
```

保存 Proxy 不代表当前进程已经切换网络。修改后请通过 Workbench 启动器重启 DSH。

## 可选 Codex 认证桥接

Codex 桥接默认关闭。普通启动不会扫描 `~/.codex/auth.json`。

首次接入时，可以打开 **DSH 设置 → Workbench → Codex**，点击 **扫描并接入 Codex**。只有点击后才会读取 `${CODEX_HOME}/auth.json`。也可以在启动器中显式开启：

```bash
dsh-workbench web --codex-auth=auto
```

或只为子进程显式传入 Access Token：

```bash
CODEX_ACCESS_TOKEN="..." dsh-workbench web
```

安全边界：

- Token 只注入 DSH 子进程环境。
- Token 不写入本仓库、Workbench SQLite、浏览器存储、日志或命令行参数。
- 前端只接收脱敏状态和 credential 引用。
- 本地 Codex 缓存桥接属于兼容能力，不是公开的 Codex 认证 API，缓存格式变化后可能需要适配。

## 本地数据与隐私

Workbench 默认运行数据目录：

```text
~/.dsh/cyberpunk-workbench/
```

其中包含 SQLite、上传文件、向量索引和索引日志。这些内容不属于 Git 仓库，也不会进入 npm 发布包。

文档解析和默认 Embedding 在本地完成。问题、检索上下文、总结和自动待办会发送给 DSH 中配置的生成模型 Provider。使用远程 Provider 时，请勿索引或提交不允许离开本机的内容。

## 开发与验证

```bash
npm ci
npm run check
npm pack --dry-run
```

`npm run check` 会构建 host/client bundle，执行完整 Node 测试、发布校验脚本，以及生成文件的语法检查。

目录结构：

```text
bin/                 Workbench 启动器
src/client/          Workbench 前端界面
src/host/            API、存储、调度、会话与 RAG
src/launcher/        Proxy 和可选认证启动逻辑
scripts/             构建、安装、校验和 Demo 重置
test/                单元、集成、契约与界面测试
```

## 兼容性与限制

- 当前版本绑定 DSH `0.1.0-rc.8` 的 Slot 和 Session 契约。
- Codex 本地缓存扫描为显式可选能力；缓存格式变化后可能需要更新。
- 定时任务仅在 DSH host 运行时执行，本项目不会安装操作系统级服务。
- 生成 Provider 的可用性与网络健康状态仍由 DSH 负责。

## 开源许可

[MIT](./LICENSE)

Harness Workbench 是独立开源项目，不是 DeepSeek、CD Projekt Red 或 OpenAI 的官方产品。相关产品名和商标归各自权利人所有。
