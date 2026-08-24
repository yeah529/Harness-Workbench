import React from "react";

function finiteRect(rect, keys = ["left", "right", "top", "bottom", "width", "height"]) {
  if (!rect) return false;
  return keys.every((key) => Number.isFinite(rect[key]));
}

export function activeKnowledgeBaseId({ previewId, pinnedId }) {
  return previewId ?? pinnedId ?? null;
}

export function nextKnowledgePreviewAfterLeave(currentPreviewId, leavingId) {
  return currentPreviewId === leavingId ? null : currentPreviewId;
}

export function routeKnowledgeBackplaneLink({ boardRect, chipRect, panelRect, blockerRects = [] }) {
  if (!finiteRect(boardRect, ["left", "top", "width", "height"])
    || !finiteRect(chipRect)
    || !finiteRect(panelRect, ["left", "top"])) return null;
  const startX = Math.round(chipRect.right - boardRect.left);
  const startY = Math.round(chipRect.top + chipRect.height / 2 - boardRect.top);
  const endX = Math.round(panelRect.left - boardRect.left);
  const endY = Math.round(panelRect.top + 96 - boardRect.top);
  const startYInViewport = chipRect.top + chipRect.height / 2;
  const blockers = blockerRects.filter((rect) => finiteRect(rect)
    && rect.left < panelRect.left
    && rect.right > chipRect.right
    && rect.top <= startYInViewport
    && rect.bottom >= startYInViewport);
  const nearestBlockerLeft = blockers.length
    ? Math.min(...blockers.map((rect) => rect.left))
    : chipRect.right + 56;
  const firstLaneX = Math.min(
    Math.round(chipRect.right + Math.max(8, (nearestBlockerLeft - chipRect.right) / 2) - boardRect.left),
    endX - 42,
  );
  const secondLaneX = endX - 28;
  const laneY = blockers.length
    ? Math.round(Math.max(chipRect.bottom, ...blockers.map((rect) => rect.bottom)) - boardRect.top + 18)
    : startY;
  return {
    path: `M ${startX} ${startY} H ${firstLaneX} V ${laneY} H ${secondLaneX} V ${endY} H ${endX}`,
    origin: { x: startX, y: startY },
    target: { x: endX, y: endY },
    viewBox: `0 0 ${Math.round(boardRect.width)} ${Math.round(boardRect.height)}`,
  };
}

function sameLink(a, b) {
  return a?.path === b?.path && a?.viewBox === b?.viewBox;
}

export function useKnowledgeBackplaneLink({ activeId, boardRef, panelRef, cardRefs, cardCount }) {
  const [link, setLink] = React.useState(null);

  const measure = React.useCallback(function () {
    const board = boardRef.current;
    const panel = panelRef.current;
    const card = cardRefs.current.get(String(activeId));
    if (!board || !panel || !card) {
      setLink((current) => current == null ? current : null);
      return;
    }
    const next = routeKnowledgeBackplaneLink({
      boardRect: board.getBoundingClientRect(),
      chipRect: card.getBoundingClientRect(),
      panelRect: panel.getBoundingClientRect(),
      blockerRects: [...cardRefs.current.entries()]
        .filter(([id]) => id !== String(activeId))
        .map(([, element]) => element.getBoundingClientRect()),
    });
    setLink((current) => sameLink(current, next) ? current : next);
  }, [activeId, boardRef, panelRef, cardRefs]);

  const useLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
  useLayoutEffect(function () {
    measure();
    const observed = [boardRef.current, panelRef.current, ...cardRefs.current.values()].filter(Boolean);
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observed.forEach((element) => observer?.observe(element));
    globalThis.addEventListener?.("resize", measure);
    return function () {
      observer?.disconnect();
      globalThis.removeEventListener?.("resize", measure);
    };
  }, [cardCount, measure, boardRef, panelRef, cardRefs]);

  return link;
}
