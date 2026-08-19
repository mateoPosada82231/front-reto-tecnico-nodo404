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
  const { content: errorsContent } = useContent("errors.common");
  const {
    form,
    errors,
    serverError,
    loading,
    success,
    handleChange,
    handleSubmit,
    reset,
  } = useLoginFormStore();

  const submit = (e) =>
    handleSubmit(e, {
      errorsContent,
      onSuccess: () => {
        setTimeout(() => {
          navigate("/");
          reset();
        }, 1500);
      },
    });

  return (
    <form
      noValidate
      onSubmit={submit}
      className="w-full max-w-md 3xl:max-w-lg 4k:max-w-xl space-y-5 rounded-2xl bg-surface border border-border/50 p-8 3xl:p-10 4k:p-12 shadow-2xl shadow-black/20 animate-scale-in"
    >
      {success && (
        <Alert variant="success" autoDismiss={1500} onDismiss={reset}>
          {content.success_message}
        </Alert>
      )}

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
        <Link
          to="/forgot-password"
          className="text-sm text-plumbob underline hover:text-plumbob-light"
        >
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

      <p className="text-center text-sm text-text-sub">
        {content.no_account_text}{" "}
        <Link
          to="/registro"
          className="text-plumbob underline hover:text-plumbob-light"
        >
          {content.no_account_link}
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
