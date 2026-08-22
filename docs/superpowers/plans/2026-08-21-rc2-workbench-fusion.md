# DeepSeek Harness rc.2 × Workbench 融合实施计划

> 目标：保留现有 Workbench 信息架构与赛博朋克视觉，把 DeepSeek Harness `0.1.1-rc.2` 的原生会话、Files/图片附件、`@文件` 与 Subagent 能力接入正式插件。当前目录不含 Git 元数据，因此本次按文件级改动与测试证据交付，不伪造分支或提交记录。

## 设计边界

- 原生 `ConversationRoot` 继续作为唯一会话渲染器；Workbench 不声明 `conversation.session`、不筛掉 Chat/Trajectory，也不复制审批、队列、工具详情和模型路由。
- Workbench 只增加可组合的会话外壳：上下文栏、紧凑模型提示、Subagent 活动抽屉、项目工具栏，以及 rc.2 原生控件的主题样式。
- 图片上传、Files API 和 `@文件` 由 rc.2 原生 attachment/file-reference/input-trigger 链路处理；Workbench 只提供入口可见性、布局和视觉一致性。
- Subagent 抽屉读取 `ctx.sessions` 的实时目录，并用 `ctx.connection.api.subagents` 读取历史、续聊和中断；one-shot 只读，continuable 才显示输入与中断能力。
- 不新增凭据持久化，不把 Codex token、代理或历史内容写入前端状态、日志或导出文件。

## 实施步骤

1. 将 DSH 依赖与 peerDependencies 统一锁定到 `0.1.1-rc.2`，更新包描述和构建锁文件。
2. 先补纯函数与组件契约测试：RPC 解包、Subagent 目录/历史转换、one-shot 与 continuable 行为、模型标签压缩、Slot 不被接管。
3. 新增 Subagent 客户端适配器和抽屉：筛选、实时状态、会话记录、详情覆盖层、续聊、中断、错误/加载/空态。
4. 在会话输入行新增紧凑模型提示，点击后委托原生模型选择器；保持原生选择器是唯一模型真相源。
5. 调整会话 CSS：`@` 候选层与输入框等宽，附件/图片入口、模型菜单、Subagent 抽屉和悬停状态统一为青色边框 + 琥珀强调的 Cyberpunk 2077 风格。
6. 更新静态架构校验与 README 中的 rc.2 能力说明。
7. 运行 `npm run check`，再用隔离 `DSH_HOME` 启动 rc.2 做桌面/平板/手机三视口浏览器验收，确认设置、模型、附件、`@`、Subagent 和项目工具均可达且无横向溢出。

## 验收标准

- 当前模型在会话输入区以“模型名 · 推理等级”显示，点击在按钮附近打开原生模型选择器。
- `@` 候选框不窄于会话输入卡片的有效宽度；文件、目录、知识库和会话来源仍由各自原生/Workbench source 提供。
- Subagent 抽屉可列出直接子智能体、切换查看消息、查看详情；continuable 可继续对话和中断，one-shot 明确只读。
- 图片可从原生附件入口添加、预览并随消息发送；Workbench 不自行存储图片字节。
- 左侧设置常驻 Harness Logo 上方，项目右栏仍只有待办、定时任务、关联知识库和每日总结。
- Workbench 不占用 `conversation.session` 或 `conversation.view`；Chat、Trajectory 与 rc.2 动态扩展仍可组合。
- 全量构建、测试、静态校验与隔离浏览器冒烟均通过后才标记完成。
