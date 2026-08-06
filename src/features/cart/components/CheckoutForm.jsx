import { useState } from "react";
import useContent from "../../../shared/hooks/useContent";
import Button from "../../../shared/components/Button";
import SelectField from "../../../shared/components/SelectField";

function CheckoutForm({ onSubmit, onCancel, loading }) {
  const { content } = useContent("landing.detail");
  const { content: errorsContent } = useContent("errors.common");
  const [formData, setFormData] = useState({
    paymentMethod: "CARD",
  });
  const [errors, setErrors] = useState({});

  const PAYMENT_OPTIONS = [
    { value: "CARD", label: content.payment_method_card },
    { value: "PAYPAL", label: content.payment_method_paypal },
  ];

  const validate = () => {
    const errs = {};
    if (!formData.paymentMethod) errs.paymentMethod = errorsContent.required_field;
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
      <div className="flex gap-2">
        <Button type="submit" loading={loading}>
          {loading ? content.checkout_processing : content.confirm_button}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          {content.cancel_button}
        </Button>
      </div>
    </form>
  );
}

export default CheckoutForm;