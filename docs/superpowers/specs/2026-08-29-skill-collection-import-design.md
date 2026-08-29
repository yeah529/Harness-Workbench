# Harness Workbench Skill 集合包导入设计

日期：2026-08-29

状态：已确认，进入实现

## 目标

Workbench 继续把单个 Skill 目录作为安装与运行时发现的最小单位，同时允许用户从本地目录或 ZIP 导入一个包含多个独立 Skill 的集合包。

本功能只提取集合中的 Skill，不安装 Codex Plugin 清单、Hook、MCP Server 或其他插件运行时能力。Hook 支持需要单独定义可信执行模型，不属于本次范围。

## 支持的集合结构

集合包必须在根目录或一个外层包装目录下使用固定结构：

```text
skills/
├── first-skill/
│   └── SKILL.md
└── second-skill/
    └── SKILL.md
```

每个直接子目录是一个独立 Skill，frontmatter `name` 必须与子目录名一致。集合内至少包含两个 Skill；只有一个 `SKILL.md` 时继续使用原有单 Skill 导入流程。

ZIP 的路径、文件类型、条目数和解压体积沿用现有安全限制。集合包中的文件只能属于 `skills/<skill-name>/...`，不递归猜测其他目录，也不执行包内脚本。

## 交互与冲突

第一次提交集合包只做安全解析、校验和目标作用域冲突扫描，不修改文件系统。Workbench 显示：

- 将导入的 Skill 数量与名称；
- 每个 Skill 的描述和文件数；
- 同作用域内已经存在的同名 Skill；
- 本次导入的目标是全局还是当前项目。

用户确认后重新提交同一 Blob。无冲突时安装所有 Skill；存在冲突时，确认动作只替换这些同名 Skill，其他新 Skill 正常安装。取消不会产生任何安装结果。

## 原子性

集合确认导入使用一个批量事务。所有 Skill 在提交前完成解压、frontmatter 校验、冲突预检和暂存。提交过程中任一移动或校验失败，事务恢复到导入前状态；重启后 Host 根据事务描述符继续完成回滚或已提交清理。成功响应只在全部 Skill 可重新扫描后返回。

## API 契约

沿用 `POST /skills/import`：

- 单 Skill：行为不变，成功返回单个 catalog item；同名且未确认替换时返回 `SKILL_CONFLICT`。
- 集合包首次提交：返回 `409 SKILL_COLLECTION_CONFIRMATION_REQUIRED`，`details` 只包含安全的集合预览摘要。
- 集合包确认提交：请求头 `x-cpwb-confirm-collection: true`；有冲突时同时发送 `x-cpwb-replace: true`。
- 集合包成功：返回 `{ kind: "collection", count, replacedCount, items }`。

客户端保留用户选择的本地 Blob 直到确认、取消或请求失效，不保存来源绝对路径。

## 非目标

- 不导入完整 Codex Plugin。
- 不启用或模拟 Superpowers Hook。
- 不支持在线地址、GitHub 或市场安装。
- 不增加批量启停、删除、升级或版本回滚。
- 不改变 DSH 原生 Skill 发现和会话注入逻辑。
