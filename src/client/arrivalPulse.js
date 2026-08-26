import React from "react";

function recordId(record) {
  const value = record && typeof record === "object" ? record.id : record;
  return value == null ? null : String(value);
}

export function getNewRecordIds(previousIds, records) {
  if (previousIds == null) return [];
  return (Array.isArray(records) ? records : [])
    .map(recordId)
    .filter((id) => id != null && !previousIds.has(id));
}

export function useArrivalPulse(records, duration = 1100) {
  const ids = (Array.isArray(records) ? records : []).map(recordId).filter(Boolean);
  const signature = JSON.stringify(ids);
  const previousIds = React.useRef(null);
  const clearTimer = React.useRef(null);
  const [arrivingIds, setArrivingIds] = React.useState(() => new Set());

  React.useEffect(() => {
    const added = getNewRecordIds(previousIds.current, ids);
    previousIds.current = new Set(ids);
    if (added.length === 0) return;
    if (clearTimer.current != null) clearTimeout(clearTimer.current);
    setArrivingIds(new Set(added));
    clearTimer.current = setTimeout(() => {
      clearTimer.current = null;
      setArrivingIds(new Set());
    }, duration);
  }, [signature, duration]);

  React.useEffect(() => () => {
    if (clearTimer.current != null) clearTimeout(clearTimer.current);
  }, []);

  return arrivingIds;
}

export function GenerationWave({ label }) {
  return React.createElement("div", {
    className: "cpwb-generation-wave",
    role: "status",
    "aria-label": label,
  }, React.createElement("span", { "aria-hidden": true }));
}
