import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import PasswordRequirements from "../../../shared/components/PasswordRequirements";
import { buildPasswordRequirements } from "../../../shared/utils/passwordRules";
import SocialButtons from "./SocialButtons";
import useRegisterFormStore from "../stores/useRegisterFormStore";
import useUsersStore from "../../../shared/stores/useUsersStore";
import useContent from "../../../shared/hooks/useContent";
import useConfig from "../../../shared/hooks/useConfig";

function RegisterForm() {
  const navigate = useNavigate();
  const { content } = useContent("auth.register");
  const { content: placeholders } = useContent("placeholders");
  const { content: selectDefault } = useContent("select.default");
  const { content: validation } = useContent("validation.register");
  const { content: errorsContent } = useContent("errors.common");
  const { config: countries } = useConfig("countries");
  const { form, errors, serverError, loading, success, handleChange, handleSubmit, reset } =
    useRegisterFormStore();
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    useUsersStore.getState().loadEmails();
  }, []);

  const submit = (e) =>
    handleSubmit(e, {
      validation,
      errorsContent,
      onSuccess: () => setTimeout(() => navigate("/login"), 3000),
    });

  const passwordRequirements = buildPasswordRequirements(validation);

  return (
    <form
      noValidate
      onSubmit={submit}
      className="w-full max-w-2xl space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20 animate-scale-in"
    >
      {success && <Alert variant="success" autoDismiss={5000} onDismiss={reset}>{content.success_message}</Alert>}

      {serverError && !success && <Alert variant="error">{serverError}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label={content.fullname_label}
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder={content.fullname_placeholder}
          required
        />
        <InputField
          label={content.email_label}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder={placeholders.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField
          label={content.country_label}
          name="country"
          value={form.country}
          onChange={handleChange}
          options={countries}
          error={errors.country}
          required
          defaultPlaceholder={selectDefault.placeholder}
        />
        <InputField
          label={content.birthdate_label}
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          error={errors.birthDate}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label={content.id_label}
          name="identification"
          value={form.identification}
          onChange={handleChange}
          error={errors.identification}
          placeholder={placeholders.id}
          required
        />
        <InputField
          label={content.phone_label}
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder={placeholders.phone}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <InputField
            label={content.password_label}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder={content.password_placeholder}
            required
            minLength={8}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <PasswordRequirements
            value={form.password}
            requirements={passwordRequirements}
            visible={passwordFocused || Boolean(form.password)}
          />
        </div>
        <InputField
          label={content.confirm_password_label}
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder={content.confirm_password_placeholder}
          required
        />
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        {loading ? content.loading_text : content.submit_text}
      </Button>

      <SocialButtons />

      <p className="text-center text-sm text-text-sub">
        {content.has_account_text}{" "}
        <Link to="/login" className="text-plumbob underline hover:text-plumbob-light">
          {content.has_account_link}
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
