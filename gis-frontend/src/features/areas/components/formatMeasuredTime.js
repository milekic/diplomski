export default function formatMeasuredTime(measuredAtUtc) {
  if (!measuredAtUtc) return "-";

  const date = new Date(measuredAtUtc);
  if (Number.isNaN(date.getTime())) return "-";

  const parts = new Intl.DateTimeFormat("bs-BA", {
    timeZone: "Europe/Sarajevo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
