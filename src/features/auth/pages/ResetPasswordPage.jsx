import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import InputField from "../../../shared/components/InputField";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import { resetPassword } from "../../../shared/services/auth";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) return;

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.message?.toLowerCase().includes("inválido") || err.message?.toLowerCase().includes("expirado")) {
        setExpired(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
        <div className="w-full max-w-md space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20 text-center">
          <Alert variant="error">Este link no es válido.</Alert>
          <Link to="/forgot-password" className="text-sm text-plumbob underline hover:text-plumbob-light">
            Pedir un nuevo link
          </Link>
        </div>
      </section>
    );
  }

  if (expired) {
    return (
      <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
        <div className="w-full max-w-md space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20 text-center">
          <Alert variant="error">Este link venció o no es válido.</Alert>
          <Link to="/forgot-password" className="text-sm text-plumbob underline hover:text-plumbob-light">
            Pedir un nuevo link
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl mb-3 tracking-tight">
          Nueva contraseña
        </h1>
        <p className="text-text-sub text-sm md:text-base leading-relaxed">
          Escribe tu nueva contraseña para continuar.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20"
      >
        {success && (
          <Alert variant="success">
            ¡Contraseña actualizada! Redirigiendo al login...
          </Alert>
        )}

        {error && !success && <Alert variant="error">{error}</Alert>}

        {!success && (
          <>
            <InputField
              label="Nueva contraseña"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <InputField
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" loading={loading} disabled={loading} className="w-full">
              {loading ? "Guardando..." : "Cambiar contraseña"}
            </Button>
          </>
        )}
      </form>
    </section>
  );
}

export default ResetPasswordPage;