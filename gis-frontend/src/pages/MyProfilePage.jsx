import ProfileCard from "../features/profile/components/ProfileCard";
import PasswordCard from "../features/profile/components/PasswordCard";
import useMyProfilePage from "../features/profile/hooks/useMyProfilePage";
import "./MyProfilePage.css";

export default function MyProfilePage() {
  const {
    loadingProfile,
    onChangePassword,
    onPasswordFieldChange,
    onProfileFieldChange,
    onSaveProfile,
    passwordForm,
    profileError,
    profileForm,
    profileSuccess,
    savingPassword,
    savingProfile,
  } = useMyProfilePage();

  return (
    <div className="container-fluid py-4 my-profile-page">
      <div className="container">
        <div className="mb-4">
          <h1 className="h3 mb-1">Moj profil</h1>
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
            <PasswordCard
              passwordForm={passwordForm}
              loadingProfile={loadingProfile}
              savingPassword={savingPassword}
              onPasswordFieldChange={onPasswordFieldChange}
              onChangePassword={onChangePassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
