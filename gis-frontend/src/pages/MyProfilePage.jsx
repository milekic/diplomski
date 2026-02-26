import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentUserProfile } from "../features/profile/api/profileApi";
import "./MyProfilePage.css";

export default function MyProfilePage() {
  const { token, username } = useSelector((state) => state.auth);
  const [profileForm, setProfileForm] = useState({
    userName: "",
    email: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCurrentProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");

      try {
        const profile = await getCurrentUserProfile({ token, username });

        if (!profile) {
          throw new Error("Profil korisnika nije pronadjen.");
        }

        if (!isMounted) return;
        setProfileForm({
          userName: profile.userName ?? "",
          email: profile.email ?? "",
        });
      } catch (error) {
        if (!isMounted) return;
        setProfileError("Ne mogu ucitati trenutne podatke korisnika.");
        setProfileForm((prev) => ({
          ...prev,
          userName: prev.userName || username || "",
        }));
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    loadCurrentProfile();

    return () => {
      isMounted = false;
    };
  }, [token, username]);

  const onProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid py-4 my-profile-page">
      <div className="container">
        <div className="mb-4">
          <h1 className="h3 mb-1">Moj profil</h1>
          <p className="text-secondary mb-0">
            Osnovni izgled stranice. Logiku i API povezivanje cemo dodati kasnije.
          </p>
        </div>

        {profileError && (
          <div className="alert alert-warning" role="alert">
            {profileError}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100 my-profile-card">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Profil</h2>

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
                    disabled={loadingProfile}
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
                    disabled={loadingProfile}
                  />
                </div>

                <button type="button" className="btn btn-primary px-4" disabled={loadingProfile}>
                  {loadingProfile ? "Ucitavanje..." : "Sacuvaj izmjene"}
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100 my-profile-card">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Sigurnost</h2>

                <div className="mb-3">
                  <label htmlFor="current-password" className="form-label">
                    Trenutna lozinka
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="form-control"
                    placeholder="Unesite trenutnu lozinku"
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
                  />
                </div>

                <button type="button" className="btn btn-outline-primary px-4">
                  Promijeni lozinku
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
