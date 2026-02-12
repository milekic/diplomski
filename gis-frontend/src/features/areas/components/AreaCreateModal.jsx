import AreaCreateForm from "./AreaCreateForm";

export default function AreaCreateModal({
  show = false,
  onClose = () => {},
  onCreate = async () => {},
  loading = false,
}) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={() => !loading && onClose()}
      />

      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block" }}
        aria-modal="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: "90vw", width: "90vw", height: "90vh", margin: "auto" }}
        >
          <div
            className="modal-content"
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div className="modal-header">
              <h5 className="modal-title">Dodaj novu oblast</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Zatvori"
                onClick={() => !loading && onClose()}
              />
            </div>

            {/* KLJUČNO: flex:1 da form može da “raste” */}
            <div className="modal-body" style={{ flex: 1, overflow: "hidden" }}>
              <AreaCreateForm loading={loading} onCancel={onClose} onSubmit={onCreate} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
