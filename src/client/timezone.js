export const DEFAULT_TIME_ZONE = "Asia/Shanghai";

function formatter(timeZone, withTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    calendar: "gregory",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" } : {}),
  });
}

export function validateTimeZone(value) {
  if (typeof value !== "string" || value.trim() === "") throw new Error("timezone must be a valid IANA time zone ID");
  const zone = value.trim();
  try { formatter(zone).format(new Date()); } catch { throw new Error("timezone must be a valid IANA time zone ID"); }
  return zone;
}

export function localDateTimeParts(value, timeZone = DEFAULT_TIME_ZONE) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("invalid date");
  const fields = Object.fromEntries(formatter(validateTimeZone(timeZone), true).formatToParts(date)
    .filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return { year: Number(fields.year), month: Number(fields.month), day: Number(fields.day), hour: Number(fields.hour), minute: Number(fields.minute), second: Number(fields.second) };
}

export function localDateKey(value = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const p = localDateTimeParts(value, timeZone);
  return `${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function addLocalDays(dateValue, days) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateValue));
  if (!match) throw new Error("date must use YYYY-MM-DD");
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + Number(days)));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function parseLocal(dateValue, timeValue) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateValue));
  const time = /^(\d{2}):(\d{2})$/.exec(String(timeValue));
  if (!date || !time) throw new Error("local date and time must use YYYY-MM-DD and HH:mm");
  const result = { year: +date[1], month: +date[2], day: +date[3], hour: +time[1], minute: +time[2], second: 0 };
  const calendar = new Date(Date.UTC(result.year, result.month - 1, result.day));
  if (calendar.getUTCFullYear() !== result.year || calendar.getUTCMonth() !== result.month - 1 || calendar.getUTCDate() !== result.day || result.hour > 23 || result.minute > 59) throw new Error("local date and time is invalid");
  return result;
}

export function zonedDateTimeToUtc(dateValue, timeValue, timeZone = DEFAULT_TIME_ZONE) {
  const zone = validateTimeZone(timeZone);
  const wanted = parseLocal(dateValue, timeValue);
  const naive = Date.UTC(wanted.year, wanted.month - 1, wanted.day, wanted.hour, wanted.minute);
  let instant = new Date(naive);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const actual = localDateTimeParts(instant, zone);
    const actualAsUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second);
    instant = new Date(naive - (actualAsUtc - instant.getTime()));
  }
  const actual = localDateTimeParts(instant, zone);
  if (actual.year !== wanted.year || actual.month !== wanted.month || actual.day !== wanted.day || actual.hour !== wanted.hour || actual.minute !== wanted.minute) throw new Error("local date and time does not exist in timezone");
  return instant;
}

export function formatInstant(value, timeZone = DEFAULT_TIME_ZONE) {
  const p = localDateTimeParts(value, timeZone);
  return `${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")} ${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}
