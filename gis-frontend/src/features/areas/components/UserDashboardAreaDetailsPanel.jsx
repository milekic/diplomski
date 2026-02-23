function formatMeasuredTime(measuredAtUtc) {
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

function formatValue(value, unit) {
  if (value == null) return "-";
  return unit ? `${value} ${unit}` : String(value);
}

export default function UserDashboardAreaDetailsPanel({ area, measurements = [] }) {
  const areaName = area?.name ?? area?.Name ?? "-";

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
            Mjerenja ({measurements.length})
          </div>

          {measurements.length === 0 ? (
            <div className="text-muted small mt-2">Nema mjerenja za izabranu oblast.</div>
          ) : (
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
                  {measurements.map((measurement) => (
                    <tr key={measurement.id}>
                      <td className="small">{measurement.eventTypeName ?? "-"}</td>
                      <td className="small text-nowrap">
                        {formatValue(measurement.value, measurement.unit)}
                      </td>
                      <td className="small text-nowrap">{formatMeasuredTime(measurement.measuredAtUtc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
