import { useEffect, useState } from "react";
import { getEventTypes } from "./eventTypesApi";

export default function AreaEventsModal({
  show = false,
  area = null,
  onClose = () => {},
  onConfirm = () => {},
}) {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selektovani događaji i pragovi
  // format: { eventTypeId: thresholdValue }
  const [selectedEvents, setSelectedEvents] = useState({});

  // Validacione greške
  const [errors, setErrors] = useState({});

  // Učitaj EventTypes kad se modal otvori
  useEffect(() => {
    if (!show) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventTypes();
        setEventTypes(data ?? []);
      } catch {
        setError("Ne mogu učitati tipove događaja.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [show]);

  // Validacija
  const validate = (selected) => {
    const newErrors = {};

    for (const [idStr, value] of Object.entries(selected)) {
      const id = Number(idStr);
      const trimmed = String(value).trim();

      if (trimmed === "") {
        newErrors[id] = "Unesite kritični prag.";
        continue;
      }

      const num = Number(trimmed);

      if (Number.isNaN(num)) {
        newErrors[id] = "Prag mora biti broj.";
        continue;
      }

      if (num <= 0) {
        newErrors[id] = "Prag mora biti veći od 0.";
      }
    }

    return newErrors;
  };

  // Automatska validacija kad se nešto promijeni
  useEffect(() => {
    setErrors(validate(selectedEvents));
  }, [selectedEvents]);

  // Da li je forma validna
  const isValid =
    Object.keys(selectedEvents).length > 0 &&
    Object.keys(errors).length === 0;

  // Checkbox toggle
  const toggleEvent = (id) => {
    setSelectedEvents((prev) => {
      const copy = { ...prev };

      if (copy[id]) {
        delete copy[id];
      } else {
        copy[id] = "";
      }

      return copy;
    });
  };

  // Promjena praga
  const handleThresholdChange = (id, value) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (!show || !area) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      />

      {/* Modal */}
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        aria-modal="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div
            className="modal-content shadow-lg border-0"
            style={{ borderRadius: 12 }}
          >
            {/* Header */}
            <div className="modal-header border-bottom-0 px-4 pt-4">
              <h4 className="modal-title fw-semibold">
                Upravljanje događajima: "{area.name}"
              </h4>
              <button
                type="button"
                className="btn-close"
                aria-label="Zatvori"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body px-4 pb-4 pt-2">
              <p className="text-muted mb-4">
                Odaberite događaje i definišite kritične pragove:
              </p>

              <div className="border rounded-3 p-4 bg-light">
                {loading ? (
                  <div>Učitavanje...</div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {eventTypes.map((et) => {
                      const isChecked =
                        selectedEvents.hasOwnProperty(et.id);

                      return (
                        <div
                          key={et.id}
                          className="bg-white border rounded-3 p-3"
                        >
                          <div className="d-flex align-items-start gap-3">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              className="form-check-input mt-1"
                              checked={isChecked}
                              onChange={() => toggleEvent(et.id)}
                            />

                            {/* Naziv + opis */}
                            <div className="flex-grow-1">
                              <div className="fw-semibold">
                                {et.name}
                              </div>
                              <div className="text-muted small">
                                {et.description}
                              </div>
                            </div>

                            {/* Threshold input */}
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="number"
                                className="form-control"
                                style={{ width: 150 }}
                                placeholder="Kritični prag"
                                disabled={!isChecked}
                                value={
                                  selectedEvents[et.id] ?? ""
                                }
                                onChange={(e) =>
                                  handleThresholdChange(
                                    et.id,
                                    e.target.value
                                  )
                                }
                              />
                              <span className="text-muted">
                                {et.unit}
                              </span>
                            </div>
                          </div>

                          {/* Error poruka */}
                          {isChecked && errors[et.id] && (
                            <div className="text-danger small mt-2">
                              {errors[et.id]}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {Object.keys(selectedEvents).length === 0 && (
                      <div className="text-muted small mt-3">
                        Odaberite bar jedan događaj.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top-0 px-4 pb-4">
              <button
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
              >
                Otkaži
              </button>

              <button
                className="btn btn-primary px-4"
                disabled={!isValid}
                onClick={() => onConfirm(selectedEvents)}
              >
                Potvrdi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
