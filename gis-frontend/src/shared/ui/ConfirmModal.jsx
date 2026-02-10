export default function ConfirmModal({
  show,
  title = "Potvrda",
  message = "Da li ste sigurni?",
  confirmText = "OK",
  cancelText = "Otkaži",
  loading = false,
  onConfirm = () => {},
  onClose = () => {},
}) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Zatvori"
                onClick={onClose}
                disabled={loading}
              />
            </div>

            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                {cancelText}
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "Brisanje..." : confirmText}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
