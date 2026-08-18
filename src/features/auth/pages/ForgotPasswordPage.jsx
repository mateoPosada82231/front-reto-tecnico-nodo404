import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import { forgotPassword } from "../../../shared/services/auth";
import useContent from "../../../shared/hooks/useContent";

function ForgotPasswordPage() {
  const { content } = useContent("auth.forgot_password");
  const { content: placeholders } = useContent("placeholders");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl mb-3 tracking-tight">
          {content.title}
        </h1>
        <p className="text-text-sub text-sm md:text-base leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20"
      >
        {sent && (
          <Alert variant="success" autoDismiss={5000} onDismiss={() => setSent(false)}>
            {content.success_message}
          </Alert>
        )}

        {error && !sent && <Alert variant="error">{error}</Alert>}

        {!sent && (
          <>
            <InputField
              label={content.email_label}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholders.email}
              required
            />

            <Button type="submit" loading={loading} disabled={loading} className="w-full">
              {loading ? content.loading_text : content.submit_text}
            </Button>
          </>
        )}

        <div className="text-center">
          <Link to="/login" className="text-sm text-plumbob underline hover:text-plumbob-light">
            {content.back_to_login}
          </Link>
        </div>
      </form>
    </section>
  );
}

export default ForgotPasswordPage;
