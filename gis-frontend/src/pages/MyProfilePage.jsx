import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentUserProfile, updateUserProfile } from "../features/profile/api/profileApi";
import ProfileCard from "../features/profile/components/ProfileCard";
import "./MyProfilePage.css";

export default function MyProfilePage() {
  const { token, username } = useSelector((state) => state.auth);
  const profileNoticeTimeoutRef = useRef(null);

  const [profileId, setProfileId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    userName: "",
    email: "",
  });
  const [initialProfile, setInitialProfile] = useState({
    userName: "",
    email: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCurrentProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");
      setProfileSuccess("");

      try {
        const profile = await getCurrentUserProfile({ token, username });
        if (!profile) throw new Error("Profil korisnika nije pronadjen.");

        if (!isMounted) return;

        const normalized = {
          userName: profile.userName ?? "",
          email: profile.email ?? "",
        };

        setProfileId(profile.id ?? null);
        setProfileForm(normalized);
        setInitialProfile(normalized);
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
    setProfileSuccess("");
  };

  const scheduleProfileNoticeClear = () => {
    if (profileNoticeTimeoutRef.current) {
      clearTimeout(profileNoticeTimeoutRef.current);
    }

    profileNoticeTimeoutRef.current = setTimeout(() => {
      setProfileError("");
      setProfileSuccess("");
      profileNoticeTimeoutRef.current = null;
    }, 1500);
  };

  const onSaveProfile = async (event) => {
    event.preventDefault();

    if (profileNoticeTimeoutRef.current) {
      clearTimeout(profileNoticeTimeoutRef.current);
      profileNoticeTimeoutRef.current = null;
    }

    setProfileError("");
    setProfileSuccess("");

    const payload = {
      userName: profileForm.userName.trim(),
      email: profileForm.email.trim(),
    };

    if (!payload.userName || !payload.email) {
      setProfileError("Korisnicko ime i email su obavezni.");
      scheduleProfileNoticeClear();
      return;
    }

    if (!profileId) {
      setProfileError("Nije moguce odrediti korisnika za izmjenu.");
      scheduleProfileNoticeClear();
      return;
    }

    const noChanges =
      payload.userName === initialProfile.userName &&
      payload.email.toLowerCase() === initialProfile.email.toLowerCase();

    if (noChanges) {
      setProfileSuccess("Nema novih izmjena za cuvanje.");
      scheduleProfileNoticeClear();
      return;
    }

    try {
      setSavingProfile(true);
      const result = await updateUserProfile(profileId, payload);

      setProfileForm(payload);
      setInitialProfile(payload);
      setProfileSuccess(result?.message ?? "Profil je uspjesno azuriran.");
      scheduleProfileNoticeClear();
    } catch (error) {
      const message = error?.response?.data?.message ?? "Neuspjesno cuvanje izmjena profila.";
      setProfileError(message);
      scheduleProfileNoticeClear();
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    return () => {
      if (profileNoticeTimeoutRef.current) {
        clearTimeout(profileNoticeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="container-fluid py-4 my-profile-page">
      <div className="container">
        <div className="mb-4">
          <h1 className="h3 mb-1">Moj profil</h1>
          <p className="text-secondary mb-0">Izmijenite korisnicko ime i email pa sacuvajte promjene.</p>
        </div>

        {profileError && (
          <div className="alert alert-danger" role="alert">
            {profileError}
          </div>
        )}
        {profileSuccess && (
          <div className="alert alert-success" role="alert">
            {profileSuccess}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <ProfileCard
              profileForm={profileForm}
              loadingProfile={loadingProfile}
              savingProfile={savingProfile}
              onProfileFieldChange={onProfileFieldChange}
              onSaveProfile={onSaveProfile}
            />
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
