/** Time-zone primitives shared by Workbench persistence and scheduling. */

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
  const timeZone = value.trim();
  try {
    formatter(timeZone).format(new Date());
  } catch {
    throw new Error("timezone must be a valid IANA time zone ID");
  }
  return timeZone;
}

function parts(date, timeZone, withTime = false) {
  const values = Object.fromEntries(
    formatter(validateTimeZone(timeZone), withTime)
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    ...(withTime ? { hour: Number(values.hour), minute: Number(values.minute), second: Number(values.second) } : {}),
  };
}

export function localDateKey(date, timeZone = DEFAULT_TIME_ZONE) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) throw new Error("invalid date");
  const result = parts(value, timeZone);
  return `${String(result.year).padStart(4, "0")}-${String(result.month).padStart(2, "0")}-${String(result.day).padStart(2, "0")}`;
}

export function localDateTimeParts(date, timeZone = DEFAULT_TIME_ZONE) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) throw new Error("invalid date");
  return parts(value, timeZone, true);
}

function localAsUtcMillis(value) {
  return Date.UTC(value.year, value.month - 1, value.day, value.hour ?? 0, value.minute ?? 0, value.second ?? 0);
}

function parseLocalDateTime(dateValue, timeValue) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateValue));
  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(timeValue));
  if (!dateMatch || !timeMatch) throw new Error("local date and time must use YYYY-MM-DD and HH:mm");
  const value = {
    year: Number(dateMatch[1]), month: Number(dateMatch[2]), day: Number(dateMatch[3]),
    hour: Number(timeMatch[1]), minute: Number(timeMatch[2]), second: Number(timeMatch[3] ?? 0),
  };
  const calendar = new Date(Date.UTC(value.year, value.month - 1, value.day));
  if (calendar.getUTCFullYear() !== value.year || calendar.getUTCMonth() !== value.month - 1 || calendar.getUTCDate() !== value.day || value.hour > 23 || value.minute > 59 || value.second > 59) {
    throw new Error("local date and time is invalid");
  }
  return value;
}

/** Convert a wall-clock date/time in an IANA zone to an absolute UTC instant. */
export function zonedDateTimeToUtc(dateValue, timeValue, timeZone = DEFAULT_TIME_ZONE) {
  const zone = validateTimeZone(timeZone);
  const wanted = parseLocalDateTime(dateValue, timeValue);
  const naive = localAsUtcMillis(wanted);
  let instant = new Date(naive);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const actual = localDateTimeParts(instant, zone);
    const offset = localAsUtcMillis(actual) - instant.getTime();
    instant = new Date(naive - offset);
  }
  const actual = localDateTimeParts(instant, zone);
  if (actual.year !== wanted.year || actual.month !== wanted.month || actual.day !== wanted.day || actual.hour !== wanted.hour || actual.minute !== wanted.minute || actual.second !== wanted.second) {
    throw new Error("local date and time does not exist in timezone");
  }
  return instant;
}

/** Add calendar days without applying the host process timezone. */
export function addLocalDays(dateValue, days) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateValue));
  if (!match) throw new Error("date must use YYYY-MM-DD");
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + Number(days)));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
