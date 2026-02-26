export default function ProfileCard({
  profileForm,
  loadingProfile,
  savingProfile,
  onProfileFieldChange,
  onSaveProfile,
}) {
  return (
    <div className="card border-0 shadow-sm h-100 my-profile-card">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Profil</h2>
          <p className="text-secondary mb-3">Izmijenite korisničko ime i email pa sačuvajte promjene.</p>

        <form onSubmit={onSaveProfile}>
          <div className="mb-3">
            <label htmlFor="profile-username" className="form-label">
              Korisničko ime
            </label>
            <input
              id="profile-username"
              type="text"
              className="form-control"
              placeholder="Unesite korisnicko ime"
              name="userName"
              value={profileForm.userName}
              onChange={onProfileFieldChange}
              disabled={loadingProfile || savingProfile}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="profile-email" className="form-label">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              className="form-control"
              placeholder="Unesite email"
              name="email"
              value={profileForm.email}
              onChange={onProfileFieldChange}
              disabled={loadingProfile || savingProfile}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary px-4 my-profile-save-btn"
            disabled={loadingProfile || savingProfile}
          >
            {loadingProfile ? "Učitavanje..." : savingProfile ? "Čuvanje..." : "Sačuvaj izmjene"}
          </button>
        </form>
      </div>
    </div>
  );
}
