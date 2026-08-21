import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_TIME_ZONE,
  validateTimeZone,
  localDateKey,
  zonedDateTimeToUtc,
} from "../src/host/timezone.js";

test("Workbench timezone defaults to Asia/Shanghai and accepts IANA IDs", () => {
  assert.equal(DEFAULT_TIME_ZONE, "Asia/Shanghai");
  assert.equal(validateTimeZone("Asia/Shanghai"), "Asia/Shanghai");
  assert.equal(validateTimeZone("America/Los_Angeles"), "America/Los_Angeles");
  assert.throws(() => validateTimeZone("UTC+8"), /IANA/i);
  assert.throws(() => validateTimeZone("Not/AZone"), /IANA/i);
});

test("local date conversion crosses UTC dates in the configured timezone", () => {
  const instant = new Date("2026-08-21T01:00:00.000Z");
  assert.equal(localDateKey(instant, "Asia/Shanghai"), "2026-08-21");
  assert.equal(localDateKey(instant, "America/Los_Angeles"), "2026-08-20");
});

test("zoned local date-time persists as UTC and handles DST", () => {
  assert.equal(zonedDateTimeToUtc("2026-08-20", "18:00", "Asia/Shanghai").toISOString(), "2026-08-20T10:00:00.000Z");
  assert.equal(zonedDateTimeToUtc("2026-08-20", "18:00", "America/Los_Angeles").toISOString(), "2026-08-21T01:00:00.000Z");
  assert.equal(zonedDateTimeToUtc("2026-07-01", "09:00", "America/New_York").toISOString(), "2026-07-01T13:00:00.000Z");
  assert.equal(zonedDateTimeToUtc("2026-01-01", "09:00", "America/New_York").toISOString(), "2026-01-01T14:00:00.000Z");
});
