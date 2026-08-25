# Harness Workbench 事务式会话永久删除设计

日期：2026-08-25

状态：书面规格已确认，进入实施计划

目标基线：DeepSeek Harness `0.1.1-rc.2`

## 1. 背景与已确认事实

Workbench 目前可以删除项目业务数据，但在项目包含 DSH 原生会话时会禁用“永久删除”。这不是名称确认组件失效，而是 RC.2 没有公开会话删除 API：

- `workspace.delete` 只删除 Workspace 注册，不删除会话日志。
- `workspace.archiveSession` 只隐藏会话，仍保留日志。
- RC.2 Session API 支持创建、查询和恢复，不支持删除或保留策略。
- RC.2 官方说明将 Session pruning 定义为存储后端的离线维护。

本机 RC.2 默认存储由多个彼此关联的持久化层组成：

```text
~/.dsh/
├── sessions/<cwd-encoded>/<session-id>/session.jsonl.zstd
├── storages/workspace.json
├── storages/session_projcache.json
└── cyberpunk-workbench/
    ├── workbench.sqlite
    └── vectors/
```

仅删除 `sessions/` 下的目录会留下 Workspace 引用、Session 投影和 Workbench 业务索引；仅编辑 JSON 又会留下真实会话正文。运行中的 DSH 还可能把内存状态重新写回磁盘。因此永久删除必须在 DSH 完全停止后，以一组可恢复、可验证的事务步骤执行。

## 2. 核心决策

采用“`dsh-workbench` 启动器监督的事务式清除”，不让浏览器页面或运行中的 DSH Host 直接删除原生会话文件。

```text
用户确认
  → Workbench Host 创建清除任务
  → Launcher 收到任务并停止 DSH
  → Launcher 隔离精确目标并更新原生引用
  → Launcher 重启 DSH
  → Workbench Host 完成业务数据清理并报告就绪
  → Launcher 验证后销毁隔离数据
```

如果任何步骤失败，Launcher 使用任务备份恢复原生数据，并按原启动参数重新启动 Workbench。恢复启动仍失败时保留 `rollback_pending`，下次执行 `dsh-workbench` 时先恢复，再进入正常启动。

该能力只在 `dsh-workbench` 监督模式下开放。直接执行原生 `dsh web` 时保持失败关闭，并提示用户改用 Workbench 启动器。

## 3. 目标

- 在 Workbench 内安全永久删除项目或知识芯片及其所属会话。
- 明确提示用户服务会自动重启，页面会短暂断线。
- 删除过程可恢复，不因进程崩溃、断电或重启失败造成半删除状态。
- 删除范围严格限定为二次确认时冻结的容器、会话和派生索引。
- 清除 DSH 原始会话、Workspace 引用、投影缓存、Workbench 投影和相关向量数据。
- 维护页反映真实阶段，并在浏览器断线期间继续显示状态。
- 重启失败时提供自动恢复和可执行的人工恢复入口。
- 设计适用于开源用户，不依赖个人路径、固定端口或本机进程标识。

## 4. 非目标

- 不为 RC.2 伪造一个运行时原生会话删除 API。
- 不在 DSH 运行时直接修改 `workspace.json`、`session_projcache.json` 或 Session 目录。
- 不删除整个 `workspace.json`、`session_projcache.json`、`sessions/` 或 Workbench 数据目录。
- 不删除用户磁盘上的项目 Workspace 文件夹和源文件。
- 不删除知识芯片导入来源之外的原始外部文件。
- 不支持未知 Session persistence backend 的猜测式清理。
- 不用固定百分比、计时器或动画冒充实际删除进度。
- 不建设通用进程管理器；监督范围只覆盖当前 `dsh-workbench web` 子进程及本次维护重启。

## 5. 支持边界与能力门控

首版只支持随 RC.2 发布并经过识别的本地存储组合：

- JSONL.Zstd Session persistence。
- JSON `workspace.json` Workspace 存储。
- JSON `session_projcache.json` Session 投影缓存。
- Workbench SQLite 和本地向量目录。

启动器在启动时探测以下事实并生成能力描述：

```text
supervised: true | false
backend: rc2-jsonl-zstd | unsupported
transactionalPurge: true | false
reason: string | null
```

只有 `supervised=true`、存储类型完全匹配且所有目标路径都位于当前 `DSH_HOME` 时，前端才允许选择永久删除。其余情况只能“保留会话并移为独立会话”，并显示明确原因。

不提供旧后端兼容层。后续 DSH 发布官方删除 API 时，应单独设计原生适配器替换离线维护实现，而不是把两条路径混在同一个执行器中。

## 6. 用户体验

### 6.1 第一次删除弹窗

项目或知识芯片删除弹窗继续展示影响统计：

- 所属会话数。
- 关联知识芯片或项目数。
- 文档数和独占索引数。
- 待办、定时任务和每日总结等业务数据。

用户选择：

1. 保留会话并移为独立会话。
2. 永久删除所属会话。

选择永久删除后，必须完整输入当前容器名称。名称匹配只解锁“继续确认”，不会立即执行。

### 6.2 第二次重启确认

第二次确认必须单独出现，不能与名称确认合并。内容明确说明：

- Workbench 将自动停止并重启。
- 页面预计中断 3 至 10 秒，实际时间以本地数据量和启动速度为准。
- 页面会自动重新连接，不需要手工刷新。
- 删除失败时会自动恢复备份并重新启动。
- 如果两次启动都失败，下次运行同一条 `dsh-workbench` 命令会优先恢复。

用户必须勾选：

> 我已了解 Workbench 将自动重启。

主按钮文案为“永久删除并重启”。弹窗同时显示被删除容器名称和冻结后的会话数量，防止用户在最后一步误认目标。

### 6.3 全屏维护状态

确认后进入全屏 Cyberpunk 2077 风格维护页。视觉沿用已确认设计稿：

- 深黑与暗酒红磨砂背景。
- 青色电路、城市线框和坐标刻度。
- 低对比度 `2077` HUD、水印与扫描雷达。
- 青色表示系统活动，琥珀黄表示当前高风险操作，红色只用于失败。
- 中央“正在重启智能核心”主状态，周围信息保持克制，不遮挡恢复说明。

维护页只显示真实阶段：

1. 正在安全关闭 DSH。
2. 正在隔离会话数据。
3. 正在清理索引与关联。
4. 正在重启并验证。

阶段使用完成、进行中、等待和失败四种状态，不显示无法计算的百分比。浏览器断线后保持当前画面并显示“正在重新连接”；服务恢复后重新查询任务状态。

### 6.4 结果状态

- 成功：显示删除摘要，自动返回首页并刷新项目、会话和最近记录。
- 删除失败但恢复成功：显示“删除未完成，数据已恢复”，保留错误摘要和重试入口。
- 自动恢复后服务仍无法启动：显示人工恢复页、任务编号、备份位置说明和原始启动命令复制按钮。
- 用户关闭浏览器后重新打开：从服务器任务状态恢复维护页或结果页，不依赖单次页面内存。

浏览器无法在 DSH 完全停止期间读取 Launcher 文件状态，因此离线窗口只保留最后一个已确认阶段并显示“正在重新连接”，不按计时器猜测后台进度。创建任务的响应同时返回不含令牌和代理凭证的恢复命令；超过离线等待阈值后，已加载的页面可以展示这条命令和人工恢复说明。服务恢复后仍以任务 API 的真实状态覆盖本地提示。

## 7. 组件与职责

### 7.1 Workbench Client

- 展示删除计划和两次确认。
- 创建清除任务后进入维护页。
- 持久保存当前任务 ID 到 `sessionStorage`，用于页面刷新后恢复。
- 轮询任务状态；断线使用指数退避，但不把网络错误写成删除结果。
- 不持有文件系统路径，不直接修改 DSH 数据。

### 7.2 Workbench Host

- 根据容器生成精确删除计划。
- 冻结目标会话、Subagent 后代、业务数据和索引范围。
- 校验容器名称、策略、能力和并发任务。
- 持久化清除任务并向 Launcher 发出维护请求。
- 重启后按任务令牌完成 Workbench SQLite 与向量清理。
- 写入带启动代次的就绪标记，供 Launcher 验证。

### 7.3 Workbench Launcher

- 是唯一允许停止和重新启动 DSH 的监督者。
- 保存本次启动使用的二进制、参数、环境变量、代理和认证配置。
- 监听当前 `DSH_HOME` 下的本地维护请求。
- 等待 Host 已返回任务响应后，再优雅停止 DSH 子进程。
- 执行隔离、原生引用更新、重启、就绪验证和最终销毁。
- 失败时恢复备份并按同一参数重新启动。
- 每次正常启动前先检查未完成任务和 `rollback_pending`。

### 7.4 Purge Storage Adapter

首版只有 `rc2-jsonl-zstd` 适配器，负责：

- 解析并校验目标 Session 目录。
- 读取和重写 `workspace.json` 的精确 Session 引用。
- 删除 `session_projcache.json` 的精确 Session 行。
- 将目标 Session 目录移动到任务隔离区。
- 生成可验证清单和恢复数据。

适配器禁止接受通配符、目录前缀或任意绝对路径作为删除目标。

## 8. 删除计划

用户第一次打开删除弹窗时只读取预览。点击“继续确认”时，Host 生成冻结计划：

```json
{
  "jobId": "purge-uuid",
  "container": {
    "kind": "project",
    "id": 12,
    "name": "智能陪练"
  },
  "policy": "delete_sessions",
  "sessionIds": ["session-a", "session-b"],
  "descendantSessionIds": ["session-subagent-c"],
  "workbenchTargets": {
    "todos": 4,
    "schedules": 2,
    "summaries": 6,
    "vectors": 3
  },
  "storageIdentity": {
    "dshHome": "resolved-identity",
    "backend": "rc2-jsonl-zstd"
  },
  "createdAt": "ISO-8601",
  "expiresAt": "ISO-8601"
}
```

计划不保存用户令牌、代理密码或完整会话正文。路径仅在 Launcher 侧依据受信任 `DSH_HOME` 和 Session ID 解析。

执行前重新校验：

- 容器仍存在且名称未变化。
- 当前会话集合与冻结计划一致。
- 没有会话在计划生成后被移动到其他容器。
- 计划未过期。
- 没有另一项清除任务处于活动状态。

任一条件不满足都中止并要求用户重新打开删除弹窗，不自动扩大删除范围。

## 9. Subagent 会话规则

DSH Subagent 会话是父会话执行记录的一部分。永久删除父会话时：

- 通过已持久化的 `parentSession` 关系收集所有后代。
- 计划中单独列出后代数量。
- 递归关系必须按 Session ID 精确解析并做循环防护。
- 只删除属于目标父链的后代；共享或无法确认归属的会话使计划失败关闭。
- “保留并移为独立会话”时，父会话和后代一并保留，不破坏原生追踪关系。

## 10. 持久化任务模型

清除任务保存在 `DSH_HOME` 下独立的 Workbench maintenance 目录，不依赖即将被修改的 Workbench SQLite：

```text
maintenance/
└── <job-id>/
    ├── request.json
    ├── state.json
    ├── manifest.json
    ├── backup/
    │   ├── native/
    │   └── workbench/
    └── quarantine/
```

状态机：

```text
queued
→ stopping
→ quarantining
→ native_refs_updated
→ restarting
→ workbench_finalizing
→ verifying
→ completed
```

失败恢复：

```text
任何可恢复失败
→ restoring
→ restored

恢复后再次启动失败
→ rollback_pending
```

每次状态变化都采用临时文件写入、同步和原子重命名。状态包括单调递增的 `revision`，防止旧进程覆盖新状态。

同一 `DSH_HOME` 同时只允许一个活动清除任务。锁包含 Launcher PID 和启动代次；发现失效 PID 时必须先按已有状态恢复或继续，不能直接抢锁执行新任务。

## 11. 事务执行顺序

### 11.1 请求与停机

1. Host 持久化 `queued` 任务并返回 `202 Accepted` 和 `jobId`。
2. Client 进入维护页。
3. Launcher 读取任务并将状态改为 `stopping`。
4. Launcher 向 DSH 子进程发送正常终止信号并等待退出。
5. 超时后才升级终止；仍无法确认退出则中止删除，不触碰数据。

### 11.2 隔离和原生引用更新

1. Launcher 重新解析支持的存储身份并比较任务快照。
2. 将 `workspace.json` 和 `session_projcache.json` 复制到任务备份目录，记录哈希。
3. DSH 已完全停止后，对 Workbench SQLite 主文件及仍存在的 WAL/SHM 文件、共享 LanceDB 向量目录制作同文件系统任务快照并记录哈希。向量表同时保存目标和非目标行，首版使用文件克隆优先、普通复制回退的完整快照保证可恢复。维护期间不接受其他 Workbench 写入，因此恢复整份快照不会覆盖并发用户变更。
4. 把每个精确 Session 目录原子移动到 `quarantine/`；跨文件系统移动不被允许。
5. 在内存中删除 `workspace.json` 的以下精确引用：
   - `global.archivedSessionIds` 中的目标 ID。
   - 各 Workspace `sessionIds` 中的目标 ID。
6. 删除 `session_projcache.json` 中以目标 Session ID 为键的精确投影。
7. 两个 JSON 文件分别写到同目录临时文件，完成同步后原子替换。
8. 重新读取并验证目标引用已消失、非目标内容哈希投影保持一致。

任何一步失败都在 DSH 仍停止时恢复两个 JSON、Workbench SQLite 快照和全部隔离目录。

### 11.3 重启和 Workbench 最终清理

1. Launcher 使用原始二进制、参数和环境启动新的 DSH 子进程，并注入 `CPWB_MAINTENANCE_JOB_ID` 与启动代次。
2. Workbench Host 启动后读取任务，只删除冻结计划中的业务数据：
   - 容器和项目关系。
   - 会话归属与标题投影。
   - 待办、定时任务和每日总结。
   - 文档关联与独占向量索引。
3. SQLite 清理在单一数据库事务内完成。失败时回滚 SQLite 事务。
4. Host 通过现有 VectorIndex API 删除目标 Session 和孤立文档的精确向量行；启动器保留停机时的共享向量目录快照，直到整个任务验证成功。
5. Host 完成初始化和清理后写入与启动代次匹配的 ready 标记。
6. Launcher 验证子进程存活、ready 标记匹配且任务状态为 `verifying`。

Launcher 不通过 stdout 文案、固定端口或静态等待时间判断成功。

从新子进程启动到任务完成期间，Host 进入维护锁定模式：除任务状态和健康检查外拒绝业务写入，Client 也不退出维护页。若启动、最终清理或就绪验证失败，Launcher 先停止新子进程，再恢复原生 JSON、Session 目录、Workbench SQLite 快照和向量隔离项，最后执行一次恢复启动。

### 11.4 提交完成

1. Launcher 将任务标记为 `completed`。
2. 永久销毁 Session 和向量隔离区。
3. 删除包含会话正文的隔离项、Workbench SQLite 快照和原生 JSON 临时备份；只保留不含正文的审计摘要。
4. Client 收到完成状态，返回首页并刷新列表。

若进程在 `completed` 写入后、隔离区销毁前崩溃，下次启动继续销毁，不恢复已经提交的删除。

## 12. 崩溃与恢复矩阵

| 中断位置 | 下次启动行为 | 用户结果 |
|---|---|---|
| `queued` / `stopping`，未修改数据 | 取消过期任务或重新请求 | 数据不变 |
| 已移动部分 Session，JSON 未替换 | 恢复已移动目录和备份 JSON | 删除未完成，数据已恢复 |
| JSON 已替换，尚未启动 DSH | 恢复 JSON 和 Session 目录 | 删除未完成，数据已恢复 |
| 新 DSH 启动失败 | 停止失败子进程，恢复，按原参数再启动一次 | 自动恢复 |
| Workbench SQLite 最终清理或就绪验证失败 | 停止新子进程，恢复原生数据、SQLite 快照和向量隔离项 | 自动恢复 |
| 恢复后再次启动失败 | 保留备份和 `rollback_pending` | 显示人工恢复说明 |
| `completed` 后隔离区未销毁 | 继续销毁，不回滚 | 删除成功 |

启动器在任何普通启动前先扫描活动任务。`rollback_pending` 的优先级高于启动新 DSH，确保用户只需重新执行原来的 `dsh-workbench` 命令即可恢复。

## 13. API 契约

### 13.1 获取删除计划

```http
GET /api/cpwb/projects/:id/deletion-plan
GET /api/cpwb/knowledge-bases/:id/deletion-plan
```

响应增加：

```json
{
  "permanentDeletion": {
    "available": true,
    "requiresRestart": true,
    "reason": null
  }
}
```

### 13.2 创建清除任务

```http
POST /api/cpwb/maintenance/purge-jobs
```

请求只接受容器身份、策略、计划版本、完整名称确认和重启确认。服务端自行计算 Session ID，不接受客户端提交路径或 Session ID 清单。

成功返回：

```json
{
  "jobId": "purge-uuid",
  "status": "queued",
  "requiresRestart": true,
  "recoveryCommand": "dsh-workbench web"
}
```

`recoveryCommand` 由 Launcher 生成，只保留重建同一启动方式所需的非敏感参数；访问令牌、认证头和代理凭证不得进入响应。

### 13.3 查询任务

```http
GET /api/cpwb/maintenance/purge-jobs/:jobId
```

响应提供状态、阶段、可公开错误码、目标摘要、恢复状态和更新时间。不得返回备份正文、令牌或内部堆栈。

### 13.4 维护请求传递

Host 与 Launcher 使用 `DSH_HOME` 内仅当前用户可读写的任务文件通信，不开放独立网络管理端口。Launcher 只接受由当前 Host 创建、结构和权限都通过校验的任务。

## 14. 错误模型

稳定错误码包括：

- `PURGE_SUPERVISOR_REQUIRED`
- `PURGE_BACKEND_UNSUPPORTED`
- `PURGE_PLAN_STALE`
- `PURGE_JOB_CONFLICT`
- `PURGE_DSH_STOP_TIMEOUT`
- `PURGE_STORAGE_IDENTITY_CHANGED`
- `PURGE_NATIVE_UPDATE_FAILED`
- `PURGE_WORKBENCH_FINALIZE_FAILED`
- `PURGE_RESTART_FAILED`
- `PURGE_RESTORE_FAILED`
- `PURGE_ROLLBACK_PENDING`

错误详情写入本地维护日志，但必须剥离访问令牌、Authorization、Cookie、代理凭证和会话正文。前端只显示可操作摘要和任务编号。

## 15. 安全约束

- 所有路径由受信任根目录加已验证 Session ID 推导。
- 拒绝 `..`、路径分隔符、符号链接逃逸和不在 `DSH_HOME` 内的目标。
- 删除清单必须按实际存在目标重新解析，不使用宽泛 glob。
- 备份、隔离目录和任务文件权限仅限当前用户。
- JSON 写入必须保持非目标字段和未知字段，不用固定 Schema 重建整个文件。
- 恢复前比较文件身份和任务 revision，防止覆盖其他进程的新写入。
- 清除期间禁止第二个 Launcher 使用同一 `DSH_HOME` 启动。
- 审计摘要只记录 ID、数量、时间、结果和错误码，不记录消息内容。
- 完成后不得无限期保留会话正文备份。

## 16. 响应式与可访问性

- 维护页在桌面、平板和 390px 手机视口均不产生横向滚动。
- 核心阶段和恢复说明不依赖背景动画才能理解。
- `prefers-reduced-motion` 下停止扫描线、城市闪烁和雷达旋转，保留状态颜色和文字。
- 红、黄、青状态同时使用图标和文字，不只依赖颜色。
- 第二确认、维护失败和人工恢复按钮支持键盘操作和可见焦点。
- 背景 HUD 设为装饰内容，不进入辅助技术阅读顺序。

## 17. 测试与验收

### 17.1 单元测试

- 删除计划冻结和过期校验。
- Session 后代收集、循环防护和共享归属失败关闭。
- 精确编辑 Workspace 与投影 JSON，未知字段保持不变。
- 路径逃逸、符号链接和错误后端拒绝。
- 状态机合法迁移、revision 和单任务锁。
- 代理、认证和原始启动参数在重启前后保持一致。
- 恢复命令脱敏，不包含令牌、认证头或代理凭证。

### 17.2 故障注入

在每个事务阶段注入异常和进程退出，验证：

- 非目标 Session 内容与引用不变。
- 失败时目标数据完整恢复。
- `completed` 后不会错误复活目标数据。
- 第二次启动失败会留下可继续的 `rollback_pending`。
- 下次 `dsh-workbench` 启动先恢复再提供服务。

### 17.3 集成测试

使用临时 `DSH_HOME` 和真实 RC.2 存储格式：

- 创建项目会话、归档会话和 Subagent 后代。
- 执行项目永久删除。
- 验证 Session 目录、Workspace 引用、投影缓存、Workbench 行和向量文件全部按计划消失。
- 验证其他项目、独立会话和知识芯片会话仍可恢复。
- 验证“保留并移为独立会话”不触发重启和原生数据删除。

### 17.4 浏览器验收

- 两次确认和重启提示完整。
- 服务断线期间维护页保持可见。
- 服务断线期间不伪造阶段变化；超时后显示已缓存的脱敏恢复命令。
- 服务恢复后自动更新到成功、恢复或人工恢复状态。
- 在设计稿目标视口实际渲染并对比 Cyberpunk 维护页。
- 桌面、平板和手机视口无溢出，减少动画设置生效。

### 17.5 完成标准

只有同时满足以下条件才可声明永久删除成功：

1. Launcher 验证了匹配启动代次的 Workbench ready 标记。
2. 目标 DSH Session 目录和原生引用都已消失。
3. Workbench SQLite、业务关系和独占向量都已清理。
4. 非目标会话可读取和恢复。
5. Session 与向量隔离区已销毁。
6. Client 收到 `completed` 状态并完成列表刷新。

端口监听、进程存在、API 返回 `202` 或单元测试通过都不能单独替代上述端到端证据。

## 18. 发布与恢复说明

- 功能默认由 `dsh-workbench` 启动器能力探测启用，不新增用户必须配置的开关。
- 直接运行原生 DSH 时继续显示能力不可用，不提供危险回退。
- README 增加永久删除的重启说明、支持后端范围和人工恢复流程。
- 日志显示任务编号和恢复状态，不输出认证或会话正文。
- 发布前必须使用全新临时 `DSH_HOME` 完成成功删除、首启失败自动恢复、双重启动失败后下次恢复三条真实链路。
