import { useEffect, useMemo, useState } from "react";
import formatMeasuredTime from "./formatMeasuredTime";

function formatValue(value, unit) {
  if (value == null) return "-";
  return unit ? `${value} ${unit}` : String(value);
}

function parseFilterDateStart(dateValue) {
  if (!dateValue) return null;
  return new Date(`${dateValue}T00:00:00`);
}

function parseFilterDateEnd(dateValue) {
  if (!dateValue) return null;
  return new Date(`${dateValue}T23:59:59.999`);
}

export default function UserDashboardAreaDetailsPanel({ area, measurements = [] }) {
  const areaName = area?.name ?? area?.Name ?? "-";
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [criticalOnly, setCriticalOnly] = useState(false);

  const areaId = Number(area?.id ?? area?.Id);

  useEffect(() => {
    setEventTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setCriticalOnly(false);
  }, [areaId]);

  const eventTypeOptions = useMemo(() => {
    const unique = new Set(
      measurements
        .map((m) => m.eventTypeName ?? "-")
        .filter((name) => typeof name === "string" && name.trim().length > 0)
    );

    return [...unique].sort((a, b) => a.localeCompare(b, "bs-BA"));
  }, [measurements]);

  useEffect(() => {
    if (eventTypeFilter === "all") return;
    if (!eventTypeOptions.includes(eventTypeFilter)) {
      setEventTypeFilter("all");
    }
  }, [eventTypeFilter, eventTypeOptions]);

  const isInvalidDateRange = dateFrom && dateTo && dateFrom > dateTo;

  const filteredMeasurements = useMemo(() => {
    const from = parseFilterDateStart(dateFrom);
    const to = parseFilterDateEnd(dateTo);

    return measurements.filter((measurement) => {
      const eventTypeName = measurement.eventTypeName ?? "-";
      if (eventTypeFilter !== "all" && eventTypeName !== eventTypeFilter) {
        return false;
      }

      if (criticalOnly && !measurement.isCritical) {
        return false;
      }

      if (!from && !to) return true;

      const measuredAt = new Date(measurement.measuredAtUtc);
      if (Number.isNaN(measuredAt.getTime())) return false;

      if (from && measuredAt < from) return false;
      if (to && measuredAt > to) return false;
      return true;
    });
  }, [measurements, eventTypeFilter, criticalOnly, dateFrom, dateTo]);

  const hasActiveFilters = eventTypeFilter !== "all" || criticalOnly || dateFrom || dateTo;

  const clearFilters = () => {
    setEventTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setCriticalOnly(false);
  };

  return (
    <div className="border rounded h-100 p-3 bg-light d-flex flex-column">
      <h6 className="mb-2">Detalji oblasti</h6>

      {!area ? (
        <div className="text-muted text-center mt-5">Nema selektovane oblasti</div>
      ) : (
        <>
          <div className="mb-2 small">
            <strong>Naziv:</strong> {areaName}
          </div>

          <div className="small text-muted mb-2">
            Mjerenja ({filteredMeasurements.length}/{measurements.length})
          </div>

          {measurements.length === 0 ? (
            <div className="text-muted small mt-2">Nema mjerenja za izabranu oblast.</div>
          ) : (
            <>
              <div className="border rounded bg-white p-2 mb-2">
                <div className="row g-2 align-items-end">
                  <div className="col-12">
                    <label className="form-label small mb-1">Tip dogadjaja</label>
                    <select
                      className="form-select form-select-sm"
                      value={eventTypeFilter}
                      onChange={(event) => setEventTypeFilter(event.target.value)}
                    >
                      <option value="all">Svi tipovi</option>
                      {eventTypeOptions.map((eventType) => (
                        <option key={eventType} value={eventType}>
                          {eventType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6">
                    <label className="form-label small mb-1">Datum od</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateFrom}
                      onChange={(event) => setDateFrom(event.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small mb-1">Datum do</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateTo}
                      onChange={(event) => setDateTo(event.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="critical-only-filter"
                        checked={criticalOnly}
                        onChange={(event) => setCriticalOnly(event.target.checked)}
                      />
                      <label className="form-check-label small" htmlFor="critical-only-filter">
                        Samo dogadjaji iznad kritičnog praga
                      </label>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary w-100"
                        onClick={clearFilters}
                      >
                        Ocisti filtere
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isInvalidDateRange && (
                <div className="alert alert-warning py-2 px-2 small mb-2">
                  Datum "od" mora biti manji ili jednak datumu "do".
                </div>
              )}

              <div
                className="table-responsive border rounded bg-white flex-grow-1"
                style={{ minHeight: 0, overflowY: "auto" }}
              >
                <table className="table table-sm table-striped table-hover mb-0 align-middle">
                  <thead className="position-sticky top-0" style={{ zIndex: 1 }}>
                    <tr>
                      <th className="small bg-light">Tip dogadjaja</th>
                      <th className="small bg-light">Vrijednost</th>
                      <th className="small bg-light">Vrijeme</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isInvalidDateRange && filteredMeasurements.length > 0 ? (
                      filteredMeasurements.map((measurement) => (
                        <tr key={measurement.id}>
                          <td className="small">{measurement.eventTypeName ?? "-"}</td>
                          <td className="small text-nowrap">
                            {formatValue(measurement.value, measurement.unit)}
                          </td>
                          <td className="small text-nowrap">{formatMeasuredTime(measurement.measuredAtUtc)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="small text-muted text-center py-3" colSpan={3}>
                          Nema rezultata za odabrane filtere.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

