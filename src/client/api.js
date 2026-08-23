/**
 * Server-backed API wrapper for the Cyberpunk workbench client.
 */

export const API_PREFIX = "/api/cpwb";

export class CpwbApiError extends Error {
  constructor(code, message, status = 0) {
    super(message);
    this.name = "CpwbApiError";
    this.code = code;
    this.status = status;
  }
}

function buildQuery(params) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    sp.set(key, String(value));
  }
  const s = sp.toString();
  return s ? "?" + s : "";
}

export function createCpwbApi({ fetchImpl, basePath = API_PREFIX } = {}) {
  const fetchFn = fetchImpl ?? globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("createCpwbApi requires a fetch implementation");
  }

  async function request({ method = "GET", path, query, body, headers = {}, rawBody, signal } = {}) {
    if (signal && signal.aborted) {
      throw new CpwbApiError("ABORTED", "request aborted", 0);
    }
    const url = basePath + path + buildQuery(query);
    const init = { method, headers: { ...headers }, signal };
    if (rawBody !== undefined && rawBody !== null) {
      init.body = rawBody;
    } else if (body !== undefined) {
      init.headers["content-type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetchFn(url, init);
    } catch (cause) {
      if (signal && signal.aborted) throw new CpwbApiError("ABORTED", "request aborted", 0);
      const message = cause && typeof cause.message === "string" ? cause.message : String(cause);
      throw new CpwbApiError("NETWORK_ERROR", "network request failed: " + message, 0);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      if (!response.ok) {
        throw new CpwbApiError("HTTP_" + response.status, "HTTP " + response.status, response.status);
      }
      throw new CpwbApiError("INVALID_RESPONSE", "response was not JSON", response.status);
    }

    if (!response.ok) {
      const err = data && typeof data.error === "object" && data.error !== null ? data.error : {};
      const code = typeof err.code === "string" && err.code ? err.code : "HTTP_" + response.status;
      const message = typeof err.message === "string" && err.message ? err.message : "request failed";
      throw new CpwbApiError(code, message, response.status);
    }
    return data;
  }

  return {
    health({ signal } = {}) {
      return request({ path: "/health", signal });
    },

    projects: {
      list({ signal } = {}) {
        return request({ path: "/projects", signal });
      },
      create({ name, path, workspaceId }, { signal } = {}) {
        return request({ method: "POST", path: "/projects", body: { name, path, workspaceId }, signal });
      },
      update({ id, name }, { signal } = {}) {
        return request({ method: "PATCH", path: "/projects/" + id, body: { name }, signal });
      },
      remove(id, { signal } = {}) {
        return request({ method: "DELETE", path: "/projects/" + id, signal });
      },
    },

    knowledgeBases: {
      list({ signal } = {}) {
        return request({ path: "/knowledge-bases", signal });
      },
      create({ name, description }, { signal } = {}) {
        return request({ method: "POST", path: "/knowledge-bases", body: { name, description }, signal });
      },
      remove(id, { signal } = {}) {
        return request({ method: "DELETE", path: "/knowledge-bases/" + id, signal });
      },
    },

    projectKnowledgeBases: {
      list(projectId, { signal } = {}) {
        return request({ path: "/projects/" + projectId + "/knowledge-bases", signal });
      },
      link(projectId, knowledgeBaseId, { signal } = {}) {
        return request({ method: "POST", path: "/projects/" + projectId + "/knowledge-bases/" + knowledgeBaseId, signal });
      },
      unlink(projectId, knowledgeBaseId, { signal } = {}) {
        return request({ method: "DELETE", path: "/projects/" + projectId + "/knowledge-bases/" + knowledgeBaseId, signal });
      },
    },

    documents: {
      list({ scope, scopeId, signal } = {}) {
        return request({ path: "/documents", query: { scope, scopeId }, signal });
      },
      get(id, { signal } = {}) {
        return request({ path: "/documents/" + id, signal });
      },
      upload({ file, scope, scopeId }, { signal } = {}) {
        return request({
          method: "POST",
          path: "/documents",
          rawBody: file,
          headers: {
            "x-cpwb-filename": encodeURIComponent(file.name),
            "x-cpwb-scope": scope,
            "x-cpwb-scope-id": String(scopeId),
          },
          signal,
        });
      },
      reindex(id, { signal } = {}) {
        return request({ method: "POST", path: "/documents/" + id + "/reindex", signal });
      },
      unlink({ id, scope, scopeId }, { signal } = {}) {
        return request({ method: "DELETE", path: "/documents/" + id + "/links/" + scope + "/" + scopeId, signal });
      },
    },

    search({ scope, scopeId, query, limit }, { signal } = {}) {
      return request({ method: "POST", path: "/search", body: { scope, scopeId, query, limit }, signal });
    },

    todos: {
      list({ projectId, signal } = {}) { return request({ path: "/todos", query: { projectId }, signal }); },
      create({ projectId, title, dueAt, source }, { signal } = {}) { return request({ method: "POST", path: "/todos", body: { projectId, title, dueAt, source }, signal }); },
      update({ id, title, dueAt, done }, { signal } = {}) { return request({ method: "PATCH", path: "/todos", body: { id, title, dueAt, done }, signal }); },
      remove(id, { signal } = {}) { return request({ method: "DELETE", path: "/todos/" + id, signal }); },
    },

    settings: {
      timezone({ signal } = {}) { return request({ path: "/settings/timezone", signal }); },
      updateTimezone(timezone, { signal } = {}) { return request({ method: "PATCH", path: "/settings/timezone", body: { timezone }, signal }); },
      automationPrompts({ signal } = {}) { return request({ path: "/settings/automation-prompts", signal }); },
      updateAutomationPrompts(body, { signal } = {}) { return request({ method: "PATCH", path: "/settings/automation-prompts", body, signal }); },
      embedding({ signal } = {}) { return request({ path: "/settings/embedding", signal }); },
      updateEmbedding(body, { signal } = {}) { return request({ method: "PATCH", path: "/settings/embedding", body, signal }); },
      testEmbedding(body, { signal } = {}) { return request({ method: "POST", path: "/settings/embedding/test", body, signal }); },
      indexStatus({ signal } = {}) { return request({ path: "/settings/index", signal }); },
      reindex({ signal } = {}) { return request({ method: "POST", path: "/settings/index/reindex", signal }); },
      putEmbeddingCredential(body, { signal } = {}) { return request({ method: "PUT", path: "/settings/embedding/credential", body, signal }); },
      deleteEmbeddingCredential(body, { signal } = {}) { return request({ method: "DELETE", path: "/settings/embedding/credential", body, signal }); },
      network({ signal } = {}) { return request({ path: "/settings/network", signal }); },
      updateNetwork(body, { signal } = {}) { return request({ method: "PATCH", path: "/settings/network", body, signal }); },
      testNetwork(body, { signal } = {}) { return request({ method: "POST", path: "/settings/network/test", body, signal }); },
      authStatus({ signal } = {}) { return request({ path: "/settings/auth/status", signal }); },
      authTest({ signal } = {}) { return request({ method: "POST", path: "/settings/auth/test", body: {}, signal }); },
      connectCodex({ signal } = {}) { return request({ method: "POST", path: "/settings/auth/codex/connect", body: {}, signal }); },
    },

    knowledgeBaseIndex: {
      reindex(knowledgeBaseId, { signal } = {}) { return request({ method: "POST", path: "/knowledge-bases/" + knowledgeBaseId + "/reindex", signal }); },
    },

    schedules: {
      list({ projectId, signal } = {}) {
        return request({ path: "/schedules", query: { projectId }, signal });
      },
      create({ projectId, name, recurrence, startsAt, prompt, enabled }, { signal } = {}) {
        return request({ method: "POST", path: "/schedules", body: { projectId, name, recurrence, startsAt, prompt, enabled }, signal });
      },
      update({ id, name, prompt, recurrence, startsAt, enabled }, { signal } = {}) {
        return request({ method: "PATCH", path: "/schedules", body: { id, name, prompt, recurrence, startsAt, enabled }, signal });
      },
      remove(id, { signal } = {}) {
        return request({ method: "DELETE", path: "/schedules/" + id, signal });
      },
      run(id, { signal } = {}) {
        return request({ method: "POST", path: "/schedules/" + id + "/run", signal });
      },
      runs(id, { signal } = {}) {
        return request({ path: "/schedules/" + id + "/runs", signal });
      },
    },

    summaries: {
      list({ projectId, signal } = {}) {
        return request({ path: "/summaries", query: { projectId }, signal });
      },
      run({ projectId, summaryDate }, { signal } = {}) {
        return request({ method: "POST", path: "/summaries/run", body: { projectId, summaryDate }, signal });
      },
      remove(id, { signal } = {}) {
        return request({ method: "DELETE", path: "/summaries/" + id, signal });
      },
    },

    automation: {
      get(projectId, { signal } = {}) {
        return request({ path: "/projects/" + projectId + "/automation", signal });
      },
      update({ projectId, summaryEnabled, nextDayTodosEnabled }, { signal } = {}) {
        return request({ method: "PATCH", path: "/projects/" + projectId + "/automation", body: { summaryEnabled, nextDayTodosEnabled }, signal });
      },
    },

    knowledgeChats: {
      list({ knowledgeBaseId, signal } = {}) {
        return request({ path: "/knowledge-chats", query: { knowledgeBaseId }, signal });
      },
      create({ knowledgeBaseId, title }, { signal } = {}) {
        return request({ method: "POST", path: "/knowledge-chats", body: { knowledgeBaseId, title }, signal });
      },
    },

    chat: {
      sessions: {
        list({ projectId, knowledgeBaseId, limit, offset, query, context } = {}, { signal } = {}) {
          if (projectId != null && knowledgeBaseId != null) {
            return Promise.reject(new CpwbApiError("INVALID_SCOPE", "provide at most one session scope"));
          }
          return request({
            path: "/chat/sessions",
            query: { projectId, knowledgeBaseId, limit, offset, query, context },
            signal,
          });
        },
        create({ projectId, knowledgeBaseId, title, chatId, resumeSessionId }, { signal } = {}) {
          return request({ method: "POST", path: "/chat/sessions", body: { projectId, knowledgeBaseId, title, chatId, resumeSessionId }, signal });
        },
      },
      prompts: {
        submit({ sessionId, question, projectId, knowledgeBaseId }, { signal } = {}) {
          return request({ method: "POST", path: "/chat/prompts", body: { sessionId, question, projectId, knowledgeBaseId }, signal });
        },
      },
    },
  };
}

export const cpwbApi = createCpwbApi();
