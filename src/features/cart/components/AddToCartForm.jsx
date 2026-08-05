import { useState } from "react";
import useContent from "../../../shared/hooks/useContent";
import Button from "../../../shared/components/Button";
import SelectField from "../../auth/components/SelectField";

const LANGUAGE_OPTIONS = [
  { value: "ES", label: "Español" },
  { value: "EN", label: "Inglés" },
];
const PLATFORM_OPTIONS = [
  { value: "PC", label: "PC" },
  { value: "PS5", label: "PlayStation 5" },
  { value: "XBOX", label: "Xbox" },
];

function AddToCartForm({ onSubmit, onCancel, loading }) {
  const { content } = useContent("landing.detail");
  const { content: errorsContent } = useContent("errors.common");
  const [formData, setFormData] = useState({
    language: "ES",
    platform: "PC",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.language) errs.language = errorsContent.required_field;
    if (!formData.platform) errs.platform = errorsContent.required_field;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 p-4 border border-border rounded-xl bg-surface">
      <SelectField
        label={content.language_label}
        name="language"
        value={formData.language}
        onChange={(e) => handleChange("language", e.target.value)}
        options={LANGUAGE_OPTIONS}
        error={errors.language}
        required
      />
      <SelectField
        label={content.platform_label}
        name="platform"
        value={formData.platform}
        onChange={(e) => handleChange("platform", e.target.value)}
        options={PLATFORM_OPTIONS}
        error={errors.platform}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {loading ? content.adding_to_cart_text : content.add_to_cart_confirm}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          {content.cancel_button}
        </Button>
      </div>
    </form>
  );
}

export default AddToCartForm;
