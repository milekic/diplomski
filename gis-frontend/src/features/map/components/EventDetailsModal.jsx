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
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalji događaja</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-2">
                <strong>Ime oblasti:</strong> {event?.areaName ?? "-"}
              </div>

              <div className="mb-2">
                <strong>Ime dogadaja:</strong> {event?.eventTypeName ?? "-"}
              </div>

              <div className="mb-2">
                <strong>Izmjerena vrijednost:</strong> {valueText}
              </div>

              <div className="mb-2">
                <strong>Vrijeme pocetka mjerenja:</strong> {measuredText}
              </div>

              <div className="mb-2">
                <strong>Lokacija:</strong>{" "}
                {event?.x != null && event?.y != null ? `${event.x}, ${event.y}` : "-"}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Zatvori
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
