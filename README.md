# Harness Workbench

<p align="center">
  <img src="./src/client/assets/harness-workbench-logo.svg" alt="Harness Workbench" width="380">
</p>

<p align="center">A project-oriented, local-first workbench for DeepSeek Harness.</p>

<p align="center">English · <a href="./README.zh-CN.md">简体中文</a></p>

> [!IMPORTANT]
> This release targets **DeepSeek Harness 0.1.1-rc.2**. DSH is still a release candidate; run the full checks and an isolated Web smoke test before upgrading it.

Harness Workbench adds a Cyberpunk-inspired project layer around the native DSH conversation runtime. Projects, knowledge bases, and standalone chats all use one canonical session model. DSH remains the source of truth for messages, streaming, model selection, tools, approvals, Files API, Chat/Trajectory views, and subagents.

## Highlights

- One unified session architecture with three owners: project, knowledge base, or standalone.
- Multiple sessions per project and per knowledge base; standalone sessions require no container.
- Projects can link multiple knowledge bases. Sessions can also pin knowledge bases, workspace files, uploaded files, or other sessions.
- A stable three-column workbench: global navigation, native DSH conversation, and context-specific tools.
- Project tools: todos, schedules, linked knowledge bases, and daily summaries.
- Knowledge-base tools: documents, vector index status, linked projects, and global schedules.
- Standalone tools: context sources, Files API guidance, subagent activity, and global schedules.
- Recent sessions are grouped by the current container before unrelated history.
- Sessions support reversible archiving: archived records leave recents, remain searchable and openable in Archive, and can be restored without deleting native DSH history.
- Local RAG with Ollama or an OpenAI-compatible embedding endpoint.
- Project automation uses one configurable IANA timezone, defaulting to `Asia/Shanghai`.
- Responsive layouts and an approved Harness Workbench SVG identity.

## Session ownership and context

Every Workbench conversation is a DSH session with one canonical scope:

| Scope | Inherited context | Right rail |
| --- | --- | --- |
| Project | Workspace files plus all currently linked knowledge bases | Todos, schedules, knowledge, summaries |
| Knowledge base | All currently available documents in that knowledge base | Documents, index, linked projects, global schedules |
| Standalone | No inherited container context | Context, files, subagents, global schedules |

Pinned sources survive container changes when they are still valid. Missing references stay visible as unavailable sources and never block the remaining context.

A new session remains a local draft until the first non-empty prompt. Only then does Workbench create the native DSH session. Failed first prompts preserve the draft and can be retried without creating duplicate sessions.

## Native DSH capabilities

Workbench does not replace `ConversationRoot` and does not claim `conversation.session`, `conversation.view`, or the native details slot. The rc.2 standard session kit remains responsible for:

- message history and streaming;
- model and reasoning selection;
- Files API, image attachments, `@file`, and `@session` references;
- permissions, tools, approvals, commands, queue/steer, stop/retry;
- Chat/Trajectory, compaction, statistics, and dynamic slot extensions;
- Subagent catalog, history, follow-up, and interrupt operations.

Workbench adds knowledge-base references and scoped retrieval through public DSH composition seams.

## Requirements

- macOS or Linux
- Node.js `>=22.5.0`
- DeepSeek Harness `0.1.1-rc.2`
- A configured DSH generation provider
- Ollama when using the default local embedding configuration

Default recommendations:

```text
generation provider:  deepseek-official
generation model:     deepseek-v4-flash
embedding model:      qwen3-embedding:0.6b
embedding dimensions: 1024
```

Generation selection is ultimately controlled by DSH. Workbench only supplies the initial default and mirrors the current native selection in its visual shell.

## Quick start

```bash
git clone https://github.com/yeah529/Harness-Workbench.git
cd Harness-Workbench
npm ci
npm run build
```

Prepare the default embedding model:

```bash
ollama serve
ollama pull qwen3-embedding:0.6b
```

Install into the DSH Web profile:

```bash
./scripts/install.sh
dsh web
```

Or launch through the included proxy/Codex-aware wrapper:

```bash
node ./bin/dsh-workbench.js web
```

After an npm installation:

```bash
dsh-workbench web
```

## Proxy and Codex authentication

Saved proxy settings apply to the next DSH process, not the currently running process. Restart with the Workbench launcher after changing them.

```bash
dsh-workbench web \
  --proxy-mode=custom \
  --proxy-url=http://127.0.0.1:7897 \
  --no-proxy=localhost,127.0.0.1
```

The Codex credential bridge is opt-in. Either click **DSH Settings → Workbench → Codex → Scan and connect Codex**, or explicitly enable the launcher bridge:

```bash
dsh-workbench web --codex-auth=auto
```

Tokens are never stored in Workbench SQLite, browser state, logs, argv, fixtures, or exports. The settings action stores a credential reference through DSH credentials; launcher mode only injects `OPENAI_CODEX_ACCESS_TOKEN` into the child process.

## Knowledge bases

Supported uploads include TXT, Markdown, HTML, DOCX, PPTX, XLSX, and common source-code formats. The per-file limit is 50 MiB and extracted text is capped at 20 MiB.

Embedding can use local Ollama or an OpenAI-compatible API. Configuration changes must pass a connection test before save; users can then rebuild all affected indexes.

Deleting a knowledge base removes Workbench-owned document copies, chunks, and vectors that are no longer shared. It never deletes original external files or the embedding model.

## Safe container deletion

Project and knowledge-base deletion always starts with an impact preview: owned sessions, relationships, documents, and exclusive indexes.

The default and recommended policy moves owned sessions to standalone scope. Container-inherited sources are removed while valid pinned sources remain. Project deletion never deletes the workspace folder or DSH workspace definition.

Permanent session deletion is only enabled when the active DSH runtime exposes a supported native deletion capability. DSH 0.1.1-rc.2 does not expose that Host API, so Workbench disables the destructive option and fails closed before changing any data.

## Local data and privacy

The default Workbench data root is:

```text
${DSH_HOME:-$HOME/.dsh}/cyberpunk-workbench/
```

It contains SQLite data, Workbench-owned file copies, vector data, and index metadata. Workspace source trees, DSH workspace definitions, external originals, and Ollama models live outside this root.

Questions, retrieved context, summaries, and generated todos are sent to the generation provider configured in DSH. Do not index material that is not allowed to leave the machine when using a remote provider.

## Development and verification

```bash
npm ci
npm run check
npm pack --dry-run
```

`npm run check` builds both bundles, runs all Node tests, executes static architecture and packaging contracts, and syntax-checks generated bundles.

```text
bin/          launcher
src/client/   Workbench shell and UI
src/host/     API, SQLite, sessions, scheduler, RAG
src/launcher/ proxy and opt-in Codex bridge
scripts/      build, install, verify, demo reset
test/         unit, integration, contract, and UI tests
```

## License and trademark notice

[MIT](./LICENSE)

Harness Workbench is an independent open-source project. It is not an official product of DeepSeek, CD Projekt Red, or OpenAI. Product names and trademarks belong to their respective owners.
