import { useState } from "react";
import useContent from "../../../shared/hooks/useContent";
import Button from "../../../shared/components/Button";
import SelectField from "../../../shared/components/SelectField";

function BuyDirectForm({ onSubmit, onCancel, buying }) {
  const { content } = useContent("landing.detail");
  const { content: errorsContent } = useContent("errors.common");
  const [formData, setFormData] = useState({
    paymentMethod: "CARD",
    language: "ES",
    platform: "PC",
  });
  const [errors, setErrors] = useState({});

  const PAYMENT_OPTIONS = [
    { value: "CARD", label: content.payment_method_card },
    { value: "PAYPAL", label: content.payment_method_paypal },
  ];
  const LANGUAGE_OPTIONS = [
    { value: "ES", label: content.language_es },
    { value: "EN", label: content.language_en },
  ];
  const PLATFORM_OPTIONS = [
    { value: "PC", label: "PC" },
    { value: "PS5", label: "PlayStation 5" },
    { value: "XBOX", label: "Xbox" },
  ];

  const validate = () => {
    const errs = {};
    if (!formData.paymentMethod) errs.paymentMethod = errorsContent.required_field;
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
        label={content.payment_method_label}
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={(e) => handleChange("paymentMethod", e.target.value)}
        options={PAYMENT_OPTIONS}
        error={errors.paymentMethod}
        required
      />
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
        <Button type="submit" loading={buying}>
          {buying ? content.processing_text : content.confirm_button}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={buying}>
          {content.cancel_button}
        </Button>
      </div>
    </form>
  );
}

export default BuyDirectForm;
