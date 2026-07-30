import { useNavigate } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Button from "../../../shared/components/Button";
import Alert from "./Alert";
import SocialButtons from "./SocialButtons";
import useLoginForm from "../hooks/useLoginForm";
import useContent from "../../../shared/hooks/useContent";

function LoginForm() {
  const navigate = useNavigate();
  const { content } = useContent("auth.login");
  const { content: placeholders } = useContent("placeholders");
  const {
    form,
    errors,
    serverError,
    loading,
    success,
    handleChange,
    handleSubmit,
  } = useLoginForm({
    onSuccess: () => setTimeout(() => navigate("/"), 1500),
  });

  return (
    <form
      onSubmit={handleSubmit}
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
