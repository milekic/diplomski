import React from "react";

export default function EventDetailsModal({ show, event, onClose }) {
  if (!show) return null;

  const measuredText = event?.measuredAtUtc
    ? (() => {
        const parts = new Intl.DateTimeFormat("bs-BA", {
          timeZone: "Europe/Sarajevo",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).formatToParts(new Date(event.measuredAtUtc));

        const get = (type) => parts.find((p) => p.type === type)?.value ?? "00";
        return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
      })()
    : "-";

  const valueText =
    event?.value != null
      ? `${event.value}${event?.eventTypeUnit ? ` ${event.eventTypeUnit}` : ""}`
      : "-";

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-md modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="modal-header bg-light border-bottom">
              <div>
                <h5 className="modal-title mb-0">Detalji dogadaja</h5>
                <small className="text-muted">Pregled izmjerenih podataka</small>
              </div>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body p-4">
              <div className="d-grid gap-2">
                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Naziv oblasti</span>
                  <span className="fw-semibold">{event?.areaName ?? "-"}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Tip događaja</span>
                  <span className="fw-semibold">{event?.eventTypeName ?? "-"}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Izmjerena vrijednost</span>
                  <span className="badge bg-primary-subtle text-primary-emphasis border px-3 py-2">
                    {valueText}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Vrijeme pocetka mjerenja</span>
                  <span className="fw-semibold">{measuredText}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Lokacija</span>
                  <span className="fw-semibold">
                    {event?.x != null && event?.y != null ? `${event.x}, ${event.y}` : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top">
              <button className="btn btn-secondary px-4" onClick={onClose}>
                Zatvori
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
