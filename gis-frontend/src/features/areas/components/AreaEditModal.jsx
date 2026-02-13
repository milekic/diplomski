import AreaCreateForm from "./AreaCreateForm";

export default function AreaEditModal({
  show = false,
  area = null,
  onClose = () => {},
  onEdit = async () => {},
  loading = false,
}) {
  if (!show || !area) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
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
          style={{
            maxWidth: "90vw",
            width: "90vw",
            height: "90vh",
            margin: "auto",
          }}
        >
          <div
            className="modal-content"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title">Izmjena oblasti: {area.name}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Zatvori"
                onClick={() => !loading && onClose()}
              />
            </div>

            
            <div className="modal-body" style={{ flex: 1, overflow: "hidden" }}>
              <AreaCreateForm
                loading={loading}
                onCancel={onClose}
                onSubmit={onEdit}
                initialData={area}
                isEditMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
