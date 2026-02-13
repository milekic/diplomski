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

  // Učitaj EventTypes kad se modal otvori
  useEffect(() => {
    if (!show) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getEventTypes();
        if (!cancelled) setEventTypes(data ?? []);
      } catch (e) {
        if (!cancelled) setError("Ne mogu se učitati tipovi događaja. Pokušaj ponovo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [show]);

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
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: 12 }}>
            {/* Header */}
            <div className="modal-header border-bottom-0" style={{ padding: "1.5rem 2rem 1rem 2rem" }}>
              <h4 className="modal-title fw-semibold">
                Upravljanje događajima: "{area.name}"
              </h4>
              <button type="button" className="btn-close" aria-label="Zatvori" onClick={onClose} />
            </div>

            {/* Body */}
            <div className="modal-body pt-0" style={{ padding: "0 2rem 2rem 2rem" }}>
              <p className="text-muted mb-4">
                Odaberite događaje za praćenje (pragove ćemo dodati u sljedećem koraku).
              </p>

              <div className="border rounded-3 p-4 bg-light" style={{ minHeight: 250 }}>
                {loading ? (
                  <div className="text-muted">Učitavanje tipova događaja...</div>
                ) : error ? (
                  <div className="alert alert-danger mb-0" role="alert">
                    {error}
                  </div>
                ) : eventTypes.length === 0 ? (
                  <div className="text-muted">Nema dostupnih tipova događaja.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {eventTypes.map((et) => (
                      <label
                        key={et.id}
                        className="d-flex align-items-start gap-3 bg-white border rounded-3 p-3"
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mt-1"
                          // za sada ništa ne radimo (kasnije dodajemo state)
                          onChange={() => {}}
                        />

                        <div className="flex-grow-1">
                          <div className="fw-semibold">{et.name}</div>
                          {et.description ? (
                            <div className="text-muted small">{et.description}</div>
                          ) : null}
                        </div>

                        <div className="text-muted small" style={{ minWidth: 70, textAlign: "right" }}>
                          {et.unit}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top-0" style={{ padding: "1rem 2rem 1.5rem 2rem" }}>
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                Otkaži
              </button>
              <button type="button" className="btn btn-primary px-4" onClick={onConfirm}>
                Potvrdi
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
