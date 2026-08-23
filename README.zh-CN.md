# Harness Workbench

<p align="center">
  <img src="./src/client/assets/harness-workbench-logo.svg" alt="Harness Workbench" width="380">
</p>

<p align="center">面向 DeepSeek Harness 的项目化、本地优先智能工作台。</p>

<p align="center"><a href="./README.md">English</a> · 简体中文</p>

> [!IMPORTANT]
> 当前版本锁定 **DeepSeek Harness 0.1.1-rc.2**。DSH 仍处于候选版本阶段，升级前应重新运行完整检查与隔离 Web 冒烟。

Harness Workbench 在 DSH 原生会话运行时外增加项目、知识库、自动化和本地检索层。项目会话、知识库会话和独立会话使用同一套会话模型；消息、流式输出、模型切换、工具、审批、Files API、Chat/Trajectory 和子智能体仍由 DSH 作为唯一真相源。

## 核心能力

- 统一三类会话：项目、知识库、独立会话。
- 一个项目或知识库可拥有多个会话；独立会话不要求绑定任何容器。
- 一个项目可以关联多个知识库。
- 会话可固定知识库、Workspace 文件、上传文件或其他会话作为上下文。
- 左侧先显示当前容器的会话，再显示其他最近会话；底部设置与 Harness Workbench SVG 常驻。
- 会话支持可逆归档：默认列表隐藏归档记录，独立“归档会话”入口可查看、继续打开或恢复；DSH 原生历史不会被删除。
- 中间完整保留 DSH 原生会话能力。
- 右侧工具随会话类型变化，不把项目能力混入独立会话。
- 本地 RAG 支持 Ollama 与 OpenAI-compatible Embedding API。
- 项目待办、定时任务、每日总结和次日待办统一使用 Workbench 全局时区，默认 `Asia/Shanghai`。
- 自适应赛博朋克界面，支持桌面、平板和手机布局。

## 会话归属与信息结构

每个 Workbench 会话只有一个标准归属：

| 会话类型 | 默认继承上下文 | 右侧工具 |
| --- | --- | --- |
| 项目会话 | 项目 Workspace 文件、当前关联的全部知识库 | 待办、定时任务、关联知识库、每日总结 |
| 知识库会话 | 当前知识库中全部可用文档 | 文档、索引、关联项目、全局定时 |
| 独立会话 | 默认不继承容器上下文 | 上下文、文件、Subagent、全局定时 |

项目和知识库关系变化后，继承上下文会动态更新。用户手动固定的来源在仍然有效时会继续保留。来源被删除后会显示为“不可用”，但不会阻塞其他上下文。

新建会话在第一条有效消息发送前只存在于浏览器本地。只有第一条非空消息提交时才创建 DSH 原生会话；首次请求失败会保留原文和草稿状态，重试不会重复创建会话。

## DSH 原生能力边界

Workbench 不替换 `ConversationRoot`，不接管 `conversation.session`、`conversation.view` 或原生详情 Slot。以下能力继续由 rc.2 standard session kit 提供：

- 消息历史、实时流式输出；
- 模型与 reasoning 等级切换；
- Files API、图片附件、`@file` 与 `@session`；
- 权限、工具、审批、命令、队列/steer、停止与重试；
- Chat/Trajectory、compaction、统计与动态 Slot 扩展；
- Subagent 目录、历史、追问和中断。

Workbench 只通过 DSH 公开组合接口增加知识库引用、项目范围和检索上下文。

## 运行要求

- macOS 或 Linux
- Node.js `>=22.5.0`
- DeepSeek Harness `0.1.1-rc.2`
- 已配置可用的 DSH 生成模型 Provider
- 使用默认本地向量化方案时需要 Ollama

默认推荐：

```text
生成 Provider：deepseek-official
生成模型：    deepseek-v4-flash
向量模型：    qwen3-embedding:0.6b
向量维度：    1024
```

运行中的模型与推理等级最终由 DSH 控制。Workbench 只提供首次默认值，并在界面中显示原生会话当前选择。

## 快速开始

```bash
git clone https://github.com/yeah529/Harness-Workbench.git
cd Harness-Workbench
npm ci
npm run build
```

准备默认向量模型：

```bash
ollama serve
ollama pull qwen3-embedding:0.6b
```

安装到 DSH Web Profile：

```bash
./scripts/install.sh
dsh web
```

也可以使用项目自带启动器：

```bash
node ./bin/dsh-workbench.js web
```

npm 安装后可直接使用：

```bash
dsh-workbench web
```

## Proxy 与 Codex 接入

Workbench 设置中保存的 Proxy 属于“下次启动”配置，不会改变当前已经运行的 DSH 进程。修改后请使用 Workbench 启动器重启：

```bash
dsh-workbench web \
  --proxy-mode=custom \
  --proxy-url=http://127.0.0.1:7897 \
  --no-proxy=localhost,127.0.0.1
```

Codex 凭据桥接默认关闭。首次使用可以点击 **DSH 设置 → Workbench → Codex → 扫描并接入 Codex**，或显式开启启动器桥接：

```bash
dsh-workbench web --codex-auth=auto
```

Token 不会写入 Workbench SQLite、浏览器状态、日志、命令行参数、测试数据或导出。设置页接入会通过 DSH credentials 保存凭据引用；启动器模式只向子进程注入 `OPENAI_CODEX_ACCESS_TOKEN`。

## 知识库与向量检索

支持 TXT、Markdown、HTML、DOCX、PPTX、XLSX 及常见代码文件。单文件上限 50 MiB，解析后的文本上限 20 MiB。

Embedding 可以使用本地 Ollama 或 OpenAI-compatible API。配置必须先完成连接测试才能保存，修改后可以重建受影响的全部索引。

删除知识库会删除 Workbench 自有且不再共享的文档副本、分块与向量；不会删除外部原文件，也不会删除本地 embedding 模型。

## 项目自动化

项目拥有自己的待办、定时任务、每日总结和次日待办。

- 手动待办必须选择预计完成日期和时间；
- 自动待办默认截止到次日 18:00；
- 待办按日期与状态分组，支持过期标识、编辑、完成、查询已完成和删除；
- 定时任务支持一次、每日、每周、每月；
- 全局定时入口支持按项目、状态和触发日期筛选；
- 每日 21:00 总结读取该项目当天全部最终会话正文，不把 thinking、tool call 或错误信息当作总结；
- 总结和自动待办提示词可以在 Workbench 设置中修改。

## 安全删除项目与知识库

删除项目或知识库前，弹窗会先显示所属会话数、关系数、文档数和独占索引数。

默认推荐选择“保留会话并移为独立会话”。容器继承的来源会移除，仍然有效的手动固定来源会保留。删除项目不会删除磁盘目录，也不会删除 DSH Workspace 定义。

“永久删除所属会话”只有在 DSH 提供正式原生删除能力时才开放。DSH 0.1.1-rc.2 没有公开该 Host API，因此当前界面会禁用危险选项，后端也会在改变任何数据前失败关闭，不会伪装成已经删除。

## 本地数据与隐私

默认 Workbench 数据目录：

```text
${DSH_HOME:-$HOME/.dsh}/cyberpunk-workbench/
```

其中包含 SQLite、Workbench 自有文件副本、向量数据和索引元数据。Workspace 源码、DSH Workspace 定义、外部原文件和 Ollama 模型不在该目录内。

问题、检索上下文、总结与自动待办会发送给 DSH 中配置的生成 Provider。使用远程 Provider 时，请勿索引或提交不允许离开本机的内容。

## 开发与验证

```bash
npm ci
npm run check
npm pack --dry-run
```

`npm run check` 会构建 host/client bundle，运行全部 Node 测试、静态架构与发布契约，并检查生成 bundle 语法。

```text
bin/          Workbench 启动器
src/client/   Workbench 应用壳与界面
src/host/     API、SQLite、会话、调度器与 RAG
src/launcher/ Proxy 和可选 Codex 桥接
scripts/      构建、安装、验证、Demo 重置
test/         单元、集成、契约与界面测试
```

## 开源许可与商标说明

[MIT](./LICENSE)

Harness Workbench 是独立开源项目，不是 DeepSeek、CD Projekt Red 或 OpenAI 的官方产品。相关产品名与商标归各自权利人所有。
