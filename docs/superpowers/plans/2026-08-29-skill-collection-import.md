# Harness Workbench Skill Collection Import Implementation Plan

> **For agentic workers:** Execute this plan test-first in the current feature worktree. Do not delegate unless the user explicitly requests it.

**Goal:** 支持从本地目录或 ZIP 预览并原子导入 `skills/<name>/` 集合包，同时保持现有单 Skill 导入行为不变。

**Architecture:** 安全解包器识别单 Skill 或固定 `skills/` 集合结构；Skill manager 对集合先返回无副作用预览，再用一个带恢复描述符的批量事务提交；现有 API 和 React 导入组件扩展一个明确的集合确认状态。

**Tech Stack:** Node.js ESM、React 18、原生 HTTP API、fflate、js-yaml、Node test runner、现有 Workbench CSS。

**Spec:** `docs/superpowers/specs/2026-08-29-skill-collection-import-design.md`

## Tasks

- [x] 扩展 `skill-package`：失败测试覆盖集合识别、外层包装、名称匹配和不支持结构；实现安全提取并保持单 Skill API 兼容。
- [x] 扩展 `skill-manager`：失败测试覆盖无副作用预览、冲突摘要、确认导入、保留停用状态、运行时失败回滚和重启恢复；实现批量事务。
- [x] 扩展 Host API 与 Client API/store：失败测试覆盖确认请求头、安全错误详情和集合成功响应。
- [x] 扩展 `SkillsManager`：失败测试覆盖集合确认弹窗、冲突标识、取消、确认和失败重试；按现有技能矩阵设计系统补充样式。
- [x] 用真实 `superpowers-skills-6.3.0.zip` 做端到端导入验证，并确认安装后的 14 个子 Skill 能被 Workbench catalog 与 DSH 文件系统 provider 发现。
- [x] 运行聚焦测试、构建、完整 `npm run check`、实际页面交互与截图检查；记录未覆盖边界。
