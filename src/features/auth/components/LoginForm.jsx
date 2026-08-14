import { useNavigate, Link } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import SocialButtons from "./SocialButtons";
import useLoginFormStore from "../stores/useLoginFormStore";
import useContent from "../../../shared/hooks/useContent";

function LoginForm() {
  const navigate = useNavigate();
  const { content } = useContent("auth.login");
  const { content: placeholders } = useContent("placeholders");
  const { content: validation } = useContent("validation.login");
  const { content: errorsContent } = useContent("errors.common");
  const { form, errors, serverError, loading, success, handleChange, handleSubmit } =
    useLoginFormStore();

  const submit = (e) =>
    handleSubmit(e, {
      validation,
      errorsContent,
      onSuccess: () => setTimeout(() => navigate("/"), 1500),
    });

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20 animate-scale-in"
    >
      {success && <Alert variant="success">{content.success_message}</Alert>}

      {serverError && !success && <Alert variant="error">{serverError}</Alert>}

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

      <InputField
        label={content.password_label}
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        placeholder={placeholders.password}
        required
      />

      <div className="text-right">
        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
          {content.forgot_password_link}
        </Link>
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        {loading ? content.loading_text : content.submit_text}
      </Button>

      <SocialButtons mode="login" />
    </form>
  );
}

export default LoginForm;
