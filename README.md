# DSH Cyberpunk Workbench

面向 DeepSeek Harness Web 的赛博朋克风格项目工作台插件：项目卡片、待办、项目知识库、定时会话、每日总结和次日待办均由 host 侧服务提供。

## 当前能力

- 单一 `shell.overlay` 应用壳：固定全局导航、项目主页、完整知识库中心、全部会话和原生会话页互斥切换；原生 ConversationRoot 继续持有 `conversation.session` / `conversation.view`、InputBar、Chat Node、实时流和动态扩展，保持唯一真相源；Workbench **不注册 `details` slot**。
- 模型、推理等级、权限、计划、附件、命令、停止/重试、队列/steer、审批、工具详情、Trajectory/Chat、统计和 compaction 均由 rc.2 standard session kit 提供，Workbench 不复制消息或输入状态。
- 会话输入区直接复用 rc.2 原生 Files API、图片附件以及 `@file` / `@session` 引用；Workbench 将引用浮层扩展到输入区同宽，并在模型按钮旁显示“模型 · 推理等级”的紧凑状态。
- 子智能体抽屉读取 rc.2 公共目录与历史 API，支持会话筛选、完整消息查看、详情覆盖层、可续聊子智能体追问与中断；one-shot 子智能体明确保持只读。
- 首页使用大尺寸项目卡片继续“最近一次会话”，全局侧栏可以新建独立会话，并以最多 8 条最近会话混合展示项目、知识库和独立上下文；添加项目使用 DSH 原生文件夹选择器。
- 只有项目会话显示右侧项目工具（待办、定时任务、关联知识库、每日总结）；知识库与独立会话保持完整聊天宽度。`>=1280px` 为真实三列，`900–1279px` 保留紧凑左栏并把项目工具切换为右侧 modal 抽屉，低于 `900px` 时导航与项目工具使用互斥抽屉。
- 每个项目独立保存待办、文档、定时规则和总结。
- 定时规则支持一次性 ISO 时间、`daily HH:MM` 和 `weekly mon HH:MM`；host 启动后每分钟检查，不依赖浏览器页面保持打开。
- 每日 21:00 的总结与次日待办有独立开关；手动生成和立即执行提供 loading、成功、空态和错误反馈。
- 文档上传上限 50 MiB，解压后内容上限 20 MiB；支持 TXT、Markdown、HTML、DOCX、PPTX、XLSX，以及 JS/TS/JSX/TSX、JSON、YAML、Python、Java、Go、Rust、C/C++、H/HPP、CSS、SQL、Shell。索引失败会保留失败状态，可在知识库页面重试。
- 界面提供键盘焦点环、Escape 关闭抽屉、焦点恢复、窄屏布局、无障碍标签、`prefers-reduced-motion` 与 reduced-transparency 降级；功能图标统一使用 Phosphor，品牌使用批准的 `190×74` Harness Workbench SVG，不使用 emoji。

## 生成与本地向量化

所有新建项目聊天、知识库聊天、scheduled session、每日总结和次日待办的初始推荐生成选择为：

```text
provider: deepseek-official
model:    deepseek-v4-flash
```

这两个值由 DSH 配置管理，作为 Workbench 的首次推荐/部署默认。原生 DSH 设置、部署默认和 `session.selectModel` 规则优先；用户在 DSH 中切换模型后，新建或恢复会话可以按 rc.2 原生规则使用其他模型。插件不注册、不伪造 DeepSeek adapter，也不自行探测 DeepSeek provider 的网络或模型健康状态。
Workbench 会话的首次路由只作为 rc.2 创建默认；运行中的模型/推理等级切换由原生 session.models/session.selectModel 与 durable request header 负责，Workbench 不另存或覆盖当前选择。

默认使用本地 Ollama 完成知识库向量化与检索：

```text
model:      qwen3-embedding:0.6b
dimensions: 1024
```

Workbench 设置允许把 embedding 切换为本地 Ollama 或 OpenAI-compatible API，并通过 DSH credentials 保存引用凭据；配置变更必须先测试，随后可重建全部知识库索引。首页按最终信息架构不再常驻显示模型、embedding 或健康状态，以免占用项目管理空间。索引和模型错误会在发生操作的知识库/会话上下文中显示；生成模型状态仍由 DSH 管理，本插件不把不存在的本地 health check 写成事实。

## 数据边界与隐私

项目/知识库聊天以及自动化生成会把用户问题和检索到的上下文发送给 DSH 配置的 `deepseek-official` provider，以便生成回答、总结和计划。不要把未获准发送到该 provider 的敏感内容放入问题或知识库。

文件本体、SQLite、上传文件和向量数据仍保存在本机；文件不会因为生成请求而上传，向量化只调用本机 Ollama embedding 服务，不把文件或向量发送到 DeepSeek。默认数据目录为 `~/.dsh/cyberpunk-workbench/`，包括 `workbench.sqlite`、LanceDB 向量目录、`files/` 和索引日志。备份时需同时保留 `workbench.sqlite` 和 `files/`（以及需要快速恢复索引时的向量目录）。若 embedding 模型或索引元数据变化，使用知识库页面的“重建索引”操作恢复对应文档。

scheduled session 创建后调用 DSH rc.2 的 `agentCtx.tools.restrict({ allow: [] })`，因此定时任务默认不继承 shell、文件修改等工具；这不改变生成请求向 DSH provider 发送问题和检索上下文的边界。

## 安装

要求：Node.js `>=22.5.0`、DSH `0.1.1-rc.2` Web、本机 Ollama embedding 服务，以及 DSH 已配置的 `deepseek-official/deepseek-v4-flash` 路由。插件依赖和 peer 依赖均锁定在 DSH `0.1.1-rc.2` API；发布包将 `@deepseek-ai/dsh` 声明为可选 peer，便于已安装 DSH 的用户直接复用本地入口。

准备本地向量化服务：

```bash
ollama serve
ollama pull qwen3-embedding:0.6b
```

在本目录执行安装脚本：

```bash
./scripts/install.sh
```

脚本会把当前插件目录以 symlink 写入 `$DSH_HOME/profiles/web/node_modules/`，并在 `cordis.patch.yml` 中确保只有一条 `dsh-cyberpunk-workbench` 注册项。默认 `DSH_HOME` 为 `~/.dsh`，可用 `DSH_HOME=/path/to/.dsh` 或 `DSH_WEB_PROFILE=/path/to/profile` 覆盖。已有同名非本插件路径或重复注册项会拒绝覆盖，避免静默破坏部署。

安装后手动重启 Web：

```bash
dsh web
```

### Workbench 启动器、Codex 与代理

安装本包后也可以使用 `dsh-workbench web`，或在源码目录执行 `node ./bin/dsh-workbench.js web`。启动器只负责将认证和代理配置安全地注入即将启动的 DSH 子进程；普通启动不会读取 `CODEX_HOME` 或 `~/.codex/auth.json`。

启动器解析 DSH 的顺序是：显式 `DSH_BIN`；当前安装能够解析到的 `@deepseek-ai/dsh/lib/bin.js`（用当前 Node 直接运行）；最后使用 `npx --yes @deepseek-ai/dsh@0.1.1-rc.2 web`。因此不要求用户把名为 `dsh` 的全局可执行文件放进 PATH。`DSH_BIN` 仍可用于测试或自定义发行版。

Workbench 设置页保存的代理属于“下次启动”配置。启动器只读 Workbench SQLite 的 `workbench_settings.network` 行，不启动 host、不迁移数据库，也不会创建数据库；默认目录为 `${DSH_HOME:-$HOME/.dsh}/cyberpunk-workbench/`，可用 `DSH_CYBERPUNK_WORKBENCH_DATA_DIR=/path/to/data` 或 `--data-dir=/path/to/data` 指定同一数据目录。没有数据库或 network 行时回退为 inherit；损坏或非法代理配置会在 spawn 前失败。命令行 `--proxy-*` 明确覆盖已保存值。

Codex 缓存桥接必须显式开启，且只读取 `${CODEX_HOME}/auth.json` 的 `tokens.access_token`。首次使用可打开 **设置 → Workbench → Codex**，点击“扫描并接入 Codex”；扫描只在点击后发生，凭据写入 DSH credentials，下一次模型请求即时生效，无需重启。浏览器和 Workbench SQLite 只收到脱敏状态，不会收到 token 或认证文件内容。

也可以通过启动器显式开启：

```bash
# 显式环境变量优先于缓存，token 不会进入 argv 或持久化设置
CODEX_ACCESS_TOKEN="..." dsh-workbench web

# 仅此模式允许读取 CODEX_HOME/auth.json
CODEX_HOME="$HOME/.codex" dsh-workbench web --codex-auth=auto
```

启动器会把结果只映射为子进程环境变量 `OPENAI_CODEX_ACCESS_TOKEN`；设置按钮则把同一凭据引用交给 DSH credentials 持久化。两条路径都通过 `dsh-codex.patch.yml` 使用可选的 `openai-codex` 路由，不覆盖 DSH 默认的 `deepseek-official/deepseek-v4-flash`。认证缓存缺失、权限错误、非法 JSON、字段缺失或空值都会返回明确错误，不会伪装成远端认证成功。

代理参数也只作用于下次启动的子进程：

```bash
dsh-workbench web --proxy-mode=direct
dsh-workbench web --proxy-mode=custom --proxy-url=https://proxy.example:8443 --no-proxy=localhost,127.0.0.1
```

代理 URL 必须是没有 userinfo 的 `http`/`https` URL；启动器设置 `NODE_USE_ENV_PROXY=1`，并透传 DSH 的其余参数、退出码和终止信号。Workbench 设置页中的“当前生效”仍表示当前 DSH 进程环境，“下次启动”表示上述启动器下一次 spawn 使用的配置。

## 验证

在插件目录执行：

```bash
npm run build
node scripts/verify.cjs
node --test test/sessions.test.js
node --test test/ollama.test.js
node --test test/scheduler.test.js
npm run check
```

`verify.cjs` 检查 bundle 工厂、唯一 Workbench shell、原生 `settings.section` 贡献、CSS 注入、无 `localStorage`、无 client-side scheduler，以及禁止接管原生 conversation/details Slot。自动测试覆盖 1280×720、768×900、390×844 的布局决策；真实浏览器 smoke 仍不能替代真实 DeepSeek 回答与实际文档向量化测试。

## 目录

```text
dsh-cyberpunk-workbench/
├── bin/            # dsh-workbench Codex/proxy-aware launcher
├── src/host/       # SQLite、Ollama embedding、RAG、session、host scheduler 和 API
├── src/launcher/   # opt-in Codex bridge、proxy env and process forwarding
├── src/client/     # 统一 Workbench shell、rc.2 session composition、主题和状态管理
├── scripts/        # bundle 构建、mock 验收和幂等安装
├── test/           # host、client、scheduler、数据库和生命周期测试
├── dsh-codex.patch.yml # optional openai-codex apiKeyEnv overlay
├── lib/            # npm build 生成的 host/client bundle
└── package.json    # DSH rc.2 manifest 和依赖
```

## 诊断边界

健康接口只检查本地 Ollama embedding 服务和模型维度；DeepSeek provider 的可用性由 DSH 配置和 DSH 自身运行时管理。没有本机 embedding 服务或当前环境无法启动 DSH 诊断实例时，自动化测试仍可验证错误传播和 fail-closed 行为，但不能证明真实浏览器显示、provider 响应或真实模型回答；验收记录应保留命令、阻止原因和未覆盖风险。

## 开源交付与 rc.2 能力边界

本包针对 DeepSeek Harness `0.1.1-rc.2`。`@deepseek-ai/dsh` 是可选 peer：已安装 DSH 的用户可直接复用自己的 Web profile；`@deepseek-ai/dsh-agent`、`@deepseek-ai/dsh-session`、LLM 和 agent preset 的版本范围与 rc.2 对齐。浏览器 bundle 通过 `dsh` manifest 的标准 plugin injection 装载，Node host bundle 和 reset 命令都随 npm 包发布，不依赖仓库外脚本。

原生能力对等矩阵：

| 能力 | Workbench 接入方式 | 真相源 |
| --- | --- | --- |
| 消息、会话、流式事件、Chat/Trajectory | native ConversationRoot、standard session kit、动态 `conversation.view` | DSH rc.2 session/agent |
| 模型、reasoning、权限、agent preset | native session model/request 与 settings sections；Workbench 只镜像紧凑状态并代理原生按钮 | DSH rc.2 |
| 工具树、详情、审批、提问、Files API、图片附件、`@file` / `@session`、命令、队列/steer、停止/重试 | native session kit/Slot，Workbench 只提供布局和项目 scope | DSH rc.2 |
| 子智能体目录、历史、追问、中断 | Workbench 赛博朋克抽屉调用公开 Subagent API；one-shot 只读，continuable 可续聊 | DSH rc.2 Subagent service |
| 项目待办、知识库、索引、总结、定时任务 | Workbench host API/SQLite；检索通过 agent `pre-step` 注入 | Workbench 数据层 + DSH agent |
| 设置、模型/插件/credentials | 原生 `settings.section` composition；Workbench 仅增加自有 section | DSH rc.2 SettingsRoot |

已验证的公开 composition snapshot：`shell.overlay`、`sidebar.settings`、`settings.section`、`conversation.session`、`conversation.view`、`conversation.input.right`、standard session kit 与 `agent/pre-step`。Workbench 不调用 `StoredEntry.component/inject`，不复制 SlotRenderer，也不以固定白名单过滤未知扩展；单个扩展错误在其 Slot 边界内隔离。当前验证版本为 `0.1.1-rc.2`，若升级 DSH，应先运行完整 `npm run check` 和隔离 Web smoke，再更新本表。

## 数据目录、升级与卸载

默认 Workbench 数据目录是 `${DSH_HOME:-$HOME/.dsh}/cyberpunk-workbench/`。可用 `DSH_CYBERPUNK_WORKBENCH_DATA_DIR=/absolute/path` 覆盖；启动器的 `--data-dir` 与设置页的“下次启动”配置必须指向同一目录。目录包含 SQLite/WAL/SHM、`uploads/`、`tmp/`、`vectors/` 和索引元数据。DSH 的 workspace 定义、源码目录和 Ollama 模型属于外部数据，不在 Workbench 数据目录清理范围内。已有的非空自定义目录必须包含当前 Workbench schema 的 `workbench.sqlite` 及必要表；任意 Documents、源码父目录或未标记目录都会被拒绝。

升级时先停止 DSH，备份 Workbench 数据目录和 DSH workspace 配置，安装新包后运行 `npm run build`/`npm run check`（源码开发时）并重新启动 Web。不要手工删除 SQLite；schema migration 由 host 负责。卸载时先停止 DSH，删除 profile 中指向本包的 symlink 和对应 `cordis.patch.yml` 注册行，再删除本包目录；除非明确需要，不要删除 Workbench 数据或 DSH workspace。

## 开发演示数据重置

`reset:demo` 是明确的开发工具，必须显式提供 `--dev`；没有 `--dev` 时直接拒绝，`--dry-run` 或其他非 destructive 模式只读取目标配置并输出计划，不会写入或删除。破坏性执行必须显式提供 `--port` 或 `--dsh-pid`；同时提供时两者都必须确认已停止。脚本只确认用户指定的 PID 或 localhost 端口，不做全系统进程发现，也不会自动 kill 进程。它会在任何 stopped probe 和写入前打印精确 targets、workspace identity、时区和 seed counts；检查失败、workspace 路径不存在/不唯一、JSON 损坏或数据目录不安全时会 fail closed。`--dry-run` 只解析并打印计划，不执行 stopped probe，也不写入。使用绝对的 DSH-Research 路径，workspace ID 会从 `workspace.json` 解析：

```bash
npm run reset:demo -- --dev --dry-run \
  --workspace-path /absolute/path/to/DSH-Research
npm run reset:demo -- --dev \
  --workspace-path /absolute/path/to/DSH-Research \
  --dsh-home /absolute/path/to/.dsh \
  --port 3080
```

正式执行只清理 DSH session 状态、session projection cache 和 Workbench 自有数据根，并保留 workspace 定义、路径、标题、ID、源码、其他用户文件和 Ollama 模型。它会以默认 `Asia/Shanghai`（或 `--timezone` 指定的合法 IANA ID）生成一组可重复演示数据：1 个 project、6 个 todos（1 overdue、2 today、1 次日 18:00 auto、1 future、1 done）、3 个 summaries（2 completed mock、1 pending），0 个知识库/文档/向量/上传/预建会话。重复执行不会累积。首次使用请先 dry-run；不要在未停止 DSH 时运行正式 reset。

## 故障排查与安全边界

- `DSH must be stopped`：确认 Web 端口或显式 PID 对应的 DSH 已退出；reset 不会尝试结束它。
- `workspace path does not resolve...`：传入 DSH profile 的 workspace 真实绝对路径，而不是显示名称；脚本只匹配 `workspace.json` 中唯一同路径 workspace。
- 代理保存后仍显示旧环境：设置页的 current effective 表示当前进程；custom/direct 只进入 next launch，需用 `dsh-workbench web` 重启。
- embedding 失败：先确认 Ollama 服务和 `qwen3-embedding:0.6b`，再检查 endpoint/model/dimensions 与 credentials 引用。
- Codex token 只在用户点击“扫描并接入 Codex”、显式 `--codex-auth=auto` 或显式环境变量时读取；前者写入 DSH credentials，后两者只桥接到子进程的 `OPENAI_CODEX_ACCESS_TOKEN`。token 不会写入 argv、日志、Workbench SQLite、API 响应、浏览器状态、fixture 或导出。
- 代理只允许没有 userinfo 的 `http`/`https` URL；当前进程环境与下次启动配置分离，`NO_PROXY/no_proxy` 会同步处理。

所有 reset 测试都使用临时 fixture；发布包 dry-run 应确认包含 `LICENSE`、`README.md`、`bin/`、`lib/`、`src/host/`、`scripts/reset-demo.mjs` 和 manifest，而不包含测试数据、个人路径或真实凭据。
