import React from "react";
import formatEventLocation from "./formatEventLocation";
import formatMeasuredTime from "./formatMeasuredTime";
import { getThresholdExceedanceText } from "./thresholdExceedanceUtils";

export default function EventDetailsModal({ show, event, onClose }) {
  if (!show) return null;
  const measuredText = formatMeasuredTime(event?.measuredAtUtc);

  const valueText =
    event?.value != null
      ? `${event.value}${event?.eventTypeUnit ? ` ${event.eventTypeUnit}` : ""}`
      : "-";

  const locationText = formatEventLocation(event?.x, event?.y, 3);
  const thresholdExceedanceText = getThresholdExceedanceText(
    event?.value,
    event?.threshold,
    event?.eventTypeUnit
  );

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

                {thresholdExceedanceText && (
                  <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                    <span className="text-muted small">Prekoračenje preko kritičnog praga</span>
                    <span className="badge bg-warning-subtle text-warning-emphasis border px-3 py-2">
                      {thresholdExceedanceText}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Vrijeme početka mjerenja</span>
                  <span className="fw-semibold">{measuredText}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light rounded-3 border">
                  <span className="text-muted small">Lokacija</span>
                  <span className="fw-semibold">{locationText}</span>
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
