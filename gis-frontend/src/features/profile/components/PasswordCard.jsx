export default function PasswordCard({
  passwordForm,
  loadingProfile,
  savingPassword,
  onPasswordFieldChange,
  onChangePassword,
}) {
  const isPasswordFormValid =
    passwordForm.currentPassword.length > 0 &&
    passwordForm.newPassword.length >= 8 &&
    passwordForm.confirmNewPassword.length >= 8;

  return (
    <div className="card border-0 shadow-sm h-100 my-profile-card">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Izmjena lozinke</h2>

        <form onSubmit={onChangePassword}>
          <div className="mb-3">
            <label htmlFor="current-password" className="form-label">
              Trenutna lozinka
            </label>
            <input
              id="current-password"
              type="password"
              className="form-control"
              placeholder="Unesite trenutnu lozinku"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={onPasswordFieldChange}
              autoComplete="current-password"
              disabled={loadingProfile || savingPassword}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="new-password" className="form-label">
              Nova lozinka
            </label>
            <input
              id="new-password"
              type="password"
              className="form-control"
              placeholder="Unesite novu lozinku"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={onPasswordFieldChange}
              minLength={8}
              autoComplete="new-password"
              disabled={loadingProfile || savingPassword}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirm-password" className="form-label">
              Potvrdi novu lozinku
            </label>
            <input
              id="confirm-password"
              type="password"
              className="form-control"
              placeholder="Ponovo unesite novu lozinku"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={onPasswordFieldChange}
              minLength={8}
              autoComplete="new-password"
              disabled={loadingProfile || savingPassword}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary px-4 my-profile-save-btn"
            disabled={loadingProfile || savingPassword || !isPasswordFormValid}
          >
            {savingPassword ? "Čuvanje..." : "Promijeni lozinku"}
          </button>
        </form>
      </div>
    </div>
  );
}
