//normalizacija datuma
function normalizeMeasuredAtUtc(rawValue) {
  if (rawValue == null) return null;

  const toIsoFromNumber = (numeric) => {
    if (!Number.isFinite(numeric)) return null;
    const ms = numeric > 1e12 ? numeric : numeric * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  };

  if (typeof rawValue === "number") {
    return toIsoFromNumber(rawValue);
  }

  if (typeof rawValue === "string") {
    const trimmed = rawValue.trim();
    if (!trimmed) return null;

    if (/^\d+$/.test(trimmed)) {
      return toIsoFromNumber(Number(trimmed));
    }

    const parsed = Date.parse(trimmed);
    if (Number.isFinite(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  return null;
}

export function normalizeEventForPanel(eventItem, fallbackAreaId) {
  const areaId = Number(eventItem?.areaId ?? eventItem?.AreaId ?? fallbackAreaId);
  const eventTypeId = Number(eventItem?.eventTypeId ?? eventItem?.EventTypeId);
  const value =
    eventItem?.value ??
    eventItem?.Value ??
    eventItem?.measuredValue ??
    eventItem?.MeasuredValue ??
    null;
  const measuredAtRaw =
    eventItem?.measuredAtUtc ??
    eventItem?.MeasuredAtUtc ??
    eventItem?.measuredAt ??
    eventItem?.MeasuredAt ??
    eventItem?.measurementTimeUtc ??
    eventItem?.MeasurementTimeUtc ??
    eventItem?.measurementTime ??
    eventItem?.MeasurementTime ??
    eventItem?.timeOfMeasurement ??
    eventItem?.TimeOfMeasurement ??
    eventItem?.timestamp ??
    eventItem?.Timestamp ??
    eventItem?.createdAt ??
    eventItem?.CreatedAt ??
    null;
  const measuredAtUtc = normalizeMeasuredAtUtc(measuredAtRaw);
  const unit = eventItem?.eventTypeUnit ?? eventItem?.EventTypeUnit ?? "";
  const backendEventTypeName = eventItem?.eventTypeName ?? eventItem?.EventTypeName;

  return {
    areaId,
    eventTypeId,
    value,
    measuredAtUtc,
    unit,
    backendEventTypeName,
  };
}

export { normalizeMeasuredAtUtc };
