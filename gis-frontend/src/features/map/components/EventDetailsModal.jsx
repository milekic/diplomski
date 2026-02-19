import React from "react";

export default function EventDetailsModal({ show, event, onClose }) {
  if (!show) return null;

  const measuredText = event?.measuredAtUtc
    ? new Date(event.measuredAtUtc).toLocaleString()
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
                <strong>Oblast (AreaId):</strong> {event?.areaId ?? "-"}
              </div>

              <div className="mb-2">
                <strong>Tip događaja (EventTypeId):</strong> {event?.eventTypeId ?? "-"}
              </div>

              <div className="mb-2">
                <strong>Vrijednost:</strong> {event?.value ?? "-"}
              </div>

              <div className="mb-2">
                <strong>Vrijeme mjerenja:</strong> {measuredText}
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
