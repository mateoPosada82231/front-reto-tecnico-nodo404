import { useState, useEffect, useCallback } from "react";
import useAuthStore from "../../../shared/stores/useAuthStore";
import useContent from "../../../shared/hooks/useContent";
import { getFriendlyError } from "../../../shared/utils/errors";
import { updateUser } from "../../../shared/services/users";
import { getUserBuys } from "../../../shared/services/buys";
import lang from "../../../shared/lang";

const EDITABLE_FIELDS = [
  "fullName",
  "country",
  "identification",
  "mobileNumber",
  "dateOfBirth",
];

function buildFormState(user) {
  return EDITABLE_FIELDS.reduce((acc, field) => {
    acc[field] = user?.[field] ?? "";
    return acc;
  }, {});
}

export default function useProfile() {
  const { user, email, loading, isLoggedIn } = useAuthStore();
  const { content } = useContent("profile.page");
  const { content: validation } = useContent("validation.profile");
  const { content: errorsContent } = useContent("errors.common");
  const [form, setForm] = useState(() => buildFormState(user));
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  useEffect(() => {
    if (user) setForm(buildFormState(user));
  }, [user]);

  useEffect(() => {
    if (!email) {
      setLoadingPurchases(false);
      return;
    }

    let cancelled = false;

    const load = (currentLang) => {
      setLoadingPurchases(true);
      getUserBuys(email, currentLang)
        .then((result) => {
          if (!cancelled) setPurchases(result);
        })
        .catch(() => {
          if (!cancelled) setPurchases([]);
        })
        .finally(() => {
          if (!cancelled) setLoadingPurchases(false);
        });
    };

    load(lang.get());

    const unsubscribe = lang.onChange((newLang) => {
      if (!cancelled) load(newLang);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [email]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = validation.name_required;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form, validation]);

  const startEditing = useCallback(() => {
    setFeedback(null);
    setEditing(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setForm(buildFormState(user));
    setErrors({});
    setFeedback(null);
    setEditing(false);
  }, [user]);

  const saveProfile = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      setSaving(true);
      setFeedback(null);
      try {
        const payload = {
          ...form,
          provider: user?.provider,
          betaTester: user?.betaTester ?? false,
          dateOfBirth: form.dateOfBirth || null,
        };
        await updateUser(email, payload);
        await useAuthStore.getState().fetchUser();
        setFeedback({
          type: "success",
          message: content.success_message,
        });
        setEditing(false);
      } catch (err) {
        setFeedback({
          type: "error",
          message: getFriendlyError(errorsContent, err) || content.error_message,
        });
      } finally {
        setSaving(false);
      }
    },
    [email, form, validate, content, errorsContent, user],
  );

  const betaPurchases = purchases.filter((p) => p.extension?.isPublic === false);

  return {
    user,
    email,
    loading,
    isLoggedIn,
    form,
    errors,
    editing,
    saving,
    feedback,
    handleChange,
    startEditing,
    cancelEditing,
    saveProfile,
    purchases,
    betaPurchases,
    loadingPurchases,
  };
}