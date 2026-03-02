import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserPassword,
  getCurrentUserProfile,
  updateUserProfile,
} from "../api/profileApi";
import { setUsername } from "../../auth/authSlice";

export default function useMyProfilePage() {
  const { token, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadCurrentProfile = async () => {
      setLoadingProfile(true);

      try {
        const profile = await getCurrentUserProfile({ token, username });
        if (!profile) throw new Error("Profil korisnika nije pronađen.");

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
        setProfileError("Ne mogu učitati trenutne podatke korisnika.");
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

  const onPasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({
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
      setProfileError("Korisničko ime i email su obavezni.");
      scheduleProfileNoticeClear();
      return;
    }

    if (!profileId) {
      setProfileError("Nije moguće odrediti korisnika za izmjenu.");
      scheduleProfileNoticeClear();
      return;
    }

    const noChanges =
      payload.userName === initialProfile.userName &&
      payload.email.toLowerCase() === initialProfile.email.toLowerCase();

    if (noChanges) {
      setProfileSuccess("Nema novih izmjena.");
      scheduleProfileNoticeClear();
      return;
    }

    try {
      setSavingProfile(true);
      const result = await updateUserProfile(profileId, payload);

      setProfileForm(payload);
      setInitialProfile(payload);
      dispatch(setUsername(payload.userName));
      setProfileSuccess(result?.message ?? "Profil je uspješno ažuriran.");
      scheduleProfileNoticeClear();
    } catch (error) {
      const message = error?.response?.data?.message ?? "Neuspješno čuvanje izmjena profila.";
      setProfileError(message);
      scheduleProfileNoticeClear();
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (event) => {
    event.preventDefault();

    if (profileNoticeTimeoutRef.current) {
      clearTimeout(profileNoticeTimeoutRef.current);
      profileNoticeTimeoutRef.current = null;
    }

    setProfileError("");
    setProfileSuccess("");

    const payload = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmNewPassword: passwordForm.confirmNewPassword,
    };

    if (!payload.currentPassword || !payload.newPassword || !payload.confirmNewPassword) {
      setProfileError("Sva polja za promjenu lozinke su obavezna.");
      scheduleProfileNoticeClear();
      return;
    }

    if (!profileId) {
      setProfileError("Nije moguće odrediti korisnika za izmjenu lozinke.");
      scheduleProfileNoticeClear();
      return;
    }

    if (payload.newPassword.length < 8) {
      setProfileError("Nova lozinka mora imati najmanje 8 karaktera.");
      scheduleProfileNoticeClear();
      return;
    }

    if (payload.newPassword !== payload.confirmNewPassword) {
      setProfileError("Potvrda lozinke se ne poklapa.");
      scheduleProfileNoticeClear();
      return;
    }

    try {
      setSavingPassword(true);
      const result = await changeUserPassword(profileId, payload);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setProfileSuccess(result?.message ?? "Lozinka je uspješno promijenjena.");
      scheduleProfileNoticeClear();
    } catch (error) {
      const message = error?.response?.data?.message ?? "Neuspješna izmjena lozinke.";
      setProfileError(message);
      scheduleProfileNoticeClear();
    } finally {
      setSavingPassword(false);
    }
  };

  useEffect(() => {
    return () => {
      if (profileNoticeTimeoutRef.current) {
        clearTimeout(profileNoticeTimeoutRef.current);
      }
    };
  }, []);

  return {
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
  };
}
