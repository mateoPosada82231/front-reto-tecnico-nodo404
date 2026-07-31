import { useState, useEffect, useCallback } from "react";
import useAuthStore from "../../../shared/stores/useAuthStore";
import useContent from "../../../shared/hooks/useContent";
import { getFriendlyError } from "../../../shared/utils/errors";
import { updateUser } from "../../../shared/services/users";

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

  useEffect(() => {
    if (user) setForm(buildFormState(user));
  }, [user]);

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
        const payload = { ...form, provider: user?.provider, betaTester: user?.betaTester ?? false };
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
  };
}
