import React from "react";
import { ArrowSquareOut, FileText } from "@phosphor-icons/react";
import { cpwbApi } from "./api.js";

export function groupKnowledgeDocuments(citations) {
  const groups = new Map();
  for (const citation of Array.isArray(citations) ? citations : []) {
    const documentId = Number(citation?.documentId);
    const validId = Number.isSafeInteger(documentId) && documentId > 0 ? documentId : null;
    const name = String(citation?.originalName || "未知文档");
    const key = validId === null ? "file:" + name : "document:" + validId;
    const group = groups.get(key) || { documentId: validId, name, locators: [] };
    const locator = String(citation?.locator || "").trim();
    if (locator && !group.locators.includes(locator)) group.locators.push(locator);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function KnowledgeSourcesTail({ matched }) {
  const documents = groupKnowledgeDocuments(matched?.citations);
  if (documents.length === 0) return null;
  const passageCount = Number.isSafeInteger(matched?.passageCount)
    ? matched.passageCount
    : matched.citations.length;

  return React.createElement("details", { className: "cpwb-knowledge-sources-tail", open: true },
    React.createElement("summary", { className: "cpwb-knowledge-sources-summary" },
      React.createElement("span", { className: "cpwb-knowledge-sources-mark", "aria-hidden": true }, "K"),
      React.createElement("span", { className: "cpwb-knowledge-sources-title" }, "本轮知识来源"),
      React.createElement("span", { className: "cpwb-knowledge-sources-count" },
        documents.length + " 个文档 / " + passageCount + " 个片段")),
    React.createElement("div", { className: "cpwb-knowledge-sources-list" },
      documents.map((document) => {
        const content = React.createElement(React.Fragment, null,
          React.createElement(FileText, { size: 15, weight: "regular", "aria-hidden": true }),
          React.createElement("span", { className: "cpwb-knowledge-source-name" }, document.name),
          React.createElement("span", { className: "cpwb-knowledge-source-locator" }, document.locators.join(" / ")),
          document.documentId === null ? null : React.createElement(ArrowSquareOut, {
            size: 14,
            weight: "bold",
            "aria-hidden": true,
          }));
        return document.documentId === null
          ? React.createElement("span", { key: "file:" + document.name, className: "cpwb-knowledge-source cpwb-knowledge-source-static" }, content)
          : React.createElement("a", {
            key: "document:" + document.documentId,
            className: "cpwb-knowledge-source",
            href: cpwbApi.documents.contentUrl(document.documentId),
            target: "_blank",
            rel: "noreferrer",
          }, content);
      })));
}
