import { Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Pencil, X, Check, KeyRound, Upload, Image as ImageIcon } from "lucide-react";
import Button from "../../../shared/components/Button";
import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import Skeleton from "../../../shared/components/Skeleton";
import ProfileAvatar from "../components/ProfileAvatar";
import ChangePasswordModal from "../components/ChangePasswordModal";
import useProfile from "../hooks/useProfile";
import useContent from "../../../shared/hooks/useContent";
import useConfig from "../../../shared/hooks/useConfig";
import useAuthStore from "../../../shared/stores/useAuthStore";

function ProfilePage() {
  const { content } = useContent("profile.page");
  const { content: selectDefault } = useContent("select.default");
  const { content: detailContent } = useContent("landing.detail");
  const { config: countries } = useConfig("countries");
  const { avatarUrl, setAvatarUrl } = useAuthStore();
  const fileInputRef = useRef(null);

  const {
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
    purchases,
    loadingPurchases,
  } = useProfile();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const paymentLabel = (method) =>
    method === "PAYPAL" ? detailContent.payment_method_paypal : detailContent.payment_method_card;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setAvatarUrl(imageUrlInput.trim());
      setShowUrlInput(false);
      setImageUrlInput("");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8 shadow-sm">
        {/* Header & Photo Upload Section */}
        <div className="flex flex-col items-center gap-4 text-center border-b border-border/60 pb-6 mb-6">
          <div className="relative group">
            <ProfileAvatar name={user?.fullName} size="xl" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-plumbob text-white shadow-md hover:bg-plumbob/90 transition-transform transform group-hover:scale-110 cursor-pointer"
              title="Subir foto de perfil"
            >
              <Upload className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-text-main md:text-2xl">
              {user?.fullName || content.name_fallback}
            </h1>
            <p className="text-sm text-text-sub">{email}</p>
          </div>

          {user?.betaTester && (
            <span className="inline-flex items-center rounded-full bg-plumbob/15 border border-plumbob/30 px-3 py-0.5 text-xs font-semibold text-plumbob">
              {content.beta_badge}
            </span>
          )}

          {/* Photo Management Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="text-xs px-3 py-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              Subir Foto
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-xs px-3 py-1.5 text-text-dim"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Usar URL
            </Button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="text-xs text-text-dim hover:text-red-400 transition-colors"
              >
                Quitar foto
              </button>
            )}
          </div>

          {showUrlInput && (
            <form onSubmit={handleUrlSubmit} className="flex gap-2 mt-2 w-full max-w-sm">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://ejemplo.com/mi-foto.jpg"
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-bg border border-border/80 text-text-main placeholder:text-text-dim focus:outline-none focus:border-plumbob"
              />
              <Button type="submit" variant="primary" className="text-xs px-3 py-1.5">
                Guardar
              </Button>
            </form>
          )}
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-plumbob/30 bg-plumbob/10 text-plumbob"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-5">
          <InputField
            label={content.fullname_label}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            disabled={!editing}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <SelectField
              label={content.country_label}
              name="country"
              value={form.country}
              onChange={handleChange}
              options={countries}
              error={errors.country}
              disabled={!editing}
              defaultPlaceholder={selectDefault.placeholder}
            />
            <InputField
              label={content.identification_label}
              name="identification"
              value={form.identification}
              onChange={handleChange}
              error={errors.identification}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label={content.phone_label}
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              disabled={!editing}
            />
            <InputField
              label={content.birthdate_label}
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {!editing ? (
              <Button type="button" variant="secondary" onClick={startEditing}>
                <Pencil className="h-4 w-4" />
                {content.edit_button}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                  {content.cancel_button}
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                  <Check className="h-4 w-4" />
                  {content.save_button}
                </Button>
              </>
            )}
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{content.security_title}</h2>
              <p className="text-sm text-text-sub">
                {content.security_subtitle}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPasswordModalOpen(true)}
            >
              <KeyRound className="h-4 w-4" />
              {content.change_password_button}
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60">
          <h2 className="text-lg font-semibold mb-4">{content.purchases_title}</h2>

          {loadingPurchases && (
            <p className="text-sm text-text-sub">{content.purchases_loading}</p>
          )}

          {!loadingPurchases && purchases.length === 0 && (
            <p className="text-sm text-text-sub">{content.purchases_empty}</p>
          )}

          {!loadingPurchases && purchases.length > 0 && (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center gap-4 rounded-xl border border-border/60 p-3"
                >
                  <img
                    src={purchase.extension.image}
                    alt={purchase.extension.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-text-main">{purchase.extension.name}</p>
                    <p className="text-xs text-text-sub">
                      {(content.purchases_item_meta || "")
                        .replace("{{date}}", purchase.date)
                        .replace("{{paymentMethod}}", paymentLabel(purchase.paymentMethod))}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${purchase.extension.price.toLocaleString("es-CO")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;