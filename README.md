# Harness Workbench

<p align="center">
  <img src="./src/client/assets/harness-workbench-logo.svg" alt="Harness Workbench" width="380">
</p>

<p align="center">
  A project-first, Cyberpunk-inspired workbench for DeepSeek Harness.
</p>

<p align="center">
  English · <a href="./README.zh-CN.md">简体中文</a>
</p>

> [!IMPORTANT]
> This release targets **DeepSeek Harness 0.1.0-rc.8**. Harness APIs are still release-candidate interfaces, so verify compatibility before upgrading DSH.

Harness Workbench extends the DSH web client with project cards, native conversations, local knowledge bases, todos, scheduled runs, and daily project automation. It keeps DSH's conversation engine as the single source of truth while adding a project-oriented workspace around it.

## Highlights

- Project-card home screen with create, rename, delete, and resume actions.
- Three-column project workspace: navigation, native DSH conversation, and project tools.
- Independent conversations created from the home screen or from a knowledge base.
- Recent-conversation navigation across project, knowledge-base, and independent sessions.
- Project todos with required due date/time, editing, completion, and overdue status.
- One-time, daily, weekly, and monthly scheduled project runs.
- Daily 21:00 project summaries and next-day todos, controlled per project.
- Local RAG knowledge bases with document upload, indexing, retrieval, and deletion.
- Responsive Cyberpunk-inspired UI with keyboard and reduced-motion support.

## Architecture

Harness Workbench deliberately does not replace the DSH conversation runtime.

| Layer | Owner |
| --- | --- |
| Messages, streaming, Chat/Trajectory, model and reasoning selection, attachments, tools, approvals, queueing, retries, compaction | DSH native session runtime |
| Projects, recent-session scopes, todos, schedules, summaries, knowledge-base metadata, SQLite persistence, vector retrieval | Harness Workbench |
| Generation credentials and provider configuration | DSH settings and credentials |
| Embedding provider and index configuration | Workbench settings, with secrets stored through DSH credentials |

## Requirements

- macOS or Linux
- Node.js `>=22.5.0`
- DeepSeek Harness `0.1.0-rc.8`
- Ollama for the default local embedding setup
- A generation provider configured in DSH

The default generation recommendation is `deepseek-official/deepseek-v4-flash`. The default local embedding model is `qwen3-embedding:0.6b` with 1024 dimensions. Both can be changed through settings.

## Quick start

```bash
git clone https://github.com/yeah529/Harness-Workbench.git
cd Harness-Workbench
npm ci
npm run build
```

Prepare the default local embedding model:

```bash
ollama serve
ollama pull qwen3-embedding:0.6b
```

Install the plugin into the DSH web profile:

```bash
./scripts/install.sh
dsh web
```

The installer links this checkout into the active DSH web profile and ensures there is one `dsh-cyberpunk-workbench` plugin entry. It refuses to silently replace an unrelated path or duplicate registration.

You can also use the bundled launcher:

```bash
node ./bin/dsh-workbench.js web
```

After installing the package globally or through npm, the equivalent command is:

```bash
dsh-workbench web
```

## Knowledge bases

The default setup embeds documents locally through Ollama. Workbench settings also support an OpenAI-compatible embedding endpoint and a configurable model/dimension pair.

Supported content includes:

- TXT, Markdown, HTML
- DOCX, PPTX, XLSX
- JavaScript, TypeScript, JSX, TSX
- JSON, YAML, Python, Java, Go, Rust
- C, C++, headers, CSS, SQL, and shell files

Uploads are limited to 50 MiB per file and 20 MiB after extraction. Deleting a knowledge base also removes its owned documents, chunks, vector index, and scoped conversations. A knowledge base linked to a project can be used by that project without becoming project-owned.

In conversations, `@` references can resolve supported session sources, linked knowledge bases, and files in the current workspace when the DSH host grants access.

## Projects and automation

Project data is scoped to the selected DSH workspace. Deleting a project removes Workbench metadata, todos, schedules, summaries, scoped sessions, and project-exclusive indexed documents. It **does not delete the real folder or the DSH workspace**, and it does not delete shared knowledge-base documents.

Todos require a due date and time. Automatically generated next-day todos default to 18:00 on the following local day. Scheduled runs support:

- One time: a specific date and time
- Daily: a local time
- Weekly: weekday and local time
- Monthly: day of month and local time

The global Workbench timezone applies to schedules, todo deadlines, daily summaries, next-day todos, and displayed timestamps. It defaults to `Asia/Shanghai` and accepts valid IANA timezone names.

## Proxy configuration

Proxy settings are saved as next-launch configuration and applied by the Workbench launcher. The settings page distinguishes the currently effective environment from the configuration that will be used on the next process start.

Examples:

```bash
dsh-workbench web --proxy-mode=custom \
  --http-proxy=http://127.0.0.1:7890 \
  --https-proxy=http://127.0.0.1:7890
```

```bash
NODE_USE_ENV_PROXY=1 HTTPS_PROXY=http://127.0.0.1:7890 dsh-workbench web
```

Workbench does not claim that a saved proxy is already active. Restart through the launcher after changing next-launch proxy settings.

## Optional Codex authentication bridge

The Codex bridge is disabled by default. Workbench does not scan `~/.codex/auth.json` during a normal launch.

For an explicit first-time connection, open **DSH Settings → Workbench → Codex** and choose **Scan and connect Codex**. The scan reads `${CODEX_HOME}/auth.json` only after this action. You can also opt in from the launcher:

```bash
dsh-workbench web --codex-auth=auto
```

Or provide an access token explicitly for the child process:

```bash
CODEX_ACCESS_TOKEN="..." dsh-workbench web
```

Security boundary:

- Tokens are injected only into the DSH child-process environment.
- Tokens are not written to this repository, Workbench SQLite, browser storage, logs, or command-line arguments.
- The UI receives only redacted status and credential references.
- The local Codex cache bridge is a compatibility path, not a public Codex authentication API, and may change.

## Local data and privacy

By default, Workbench runtime data is stored under:

```text
~/.dsh/cyberpunk-workbench/
```

This includes SQLite state, uploaded files, vector indexes, and indexing logs. None of these paths are part of the repository or npm package.

Document extraction and default embedding stay local. Prompts, retrieved context, summaries, and generated todos are sent to the generation provider configured in DSH. Do not index or submit content that is not permitted to leave your machine when using a remote generation provider.

## Development

```bash
npm ci
npm run check
npm pack --dry-run
```

`npm run check` builds the host and client bundles, runs the full Node test suite, executes the release verifier, and performs syntax checks on generated bundles.

Main directories:

```text
bin/                 Workbench launcher
src/client/          Workbench client UI
src/host/            API, persistence, scheduling, sessions, RAG
src/launcher/        Proxy and optional authentication bootstrap
scripts/             Build, installation, verification, demo reset
test/                Unit, integration, contract, and UI tests
```

## Compatibility and limitations

- This release is coupled to the DSH `0.1.0-rc.8` slot and session contracts.
- The Codex local-cache scan is explicit opt-in and may need adjustment if the local cache format changes.
- Scheduled jobs run while the DSH host is running; this project does not install an operating-system service.
- Generation-provider availability and network health remain DSH responsibilities.

## License

[MIT](./LICENSE)

Harness Workbench is an independent open-source project and is not an official DeepSeek, CD Projekt Red, or OpenAI product. Product and trademark names belong to their respective owners.
