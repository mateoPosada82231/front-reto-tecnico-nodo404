import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Pencil, X, Check, KeyRound } from "lucide-react";
import Button from "../../../shared/components/Button";
import InputField from "../../../shared/components/InputField";
import SelectField from "../../../shared/components/SelectField";
import Skeleton from "../../../shared/components/Skeleton";
import ProfileAvatar from "../components/ProfileAvatar";
import ChangePasswordModal from "../components/ChangePasswordModal";
import useProfile from "../hooks/useProfile";
import useContent from "../../../shared/hooks/useContent";
import useConfig from "../../../shared/hooks/useConfig";

function ProfilePage() {
  const { content } = useContent("profile.page");
  const { content: selectDefault } = useContent("select.default");
  const { content: detailContent } = useContent("landing.detail");
  const { config: countries } = useConfig("countries");
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
    betaPurchases,
    loadingPurchases,
  } = useProfile();

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const paymentLabel = (method) =>
    method === "PAYPAL" ? detailContent.payment_method_paypal : detailContent.payment_method_card;

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
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
        <div className="flex flex-col items-center gap-3 text-center border-b border-border/60 pb-6 mb-6">
          <ProfileAvatar name={user?.fullName} />
          <div>
            <h1 className="text-xl font-semibold text-text-main md:text-2xl">
              {user?.fullName || content.name_fallback}
            </h1>
            <p className="text-sm text-text-sub">{email}</p>
          </div>
          {user?.betaTester && (
            <span className="inline-flex items-center rounded-full bg-plumbob/15 border border-plumbob/30 px-2.5 py-0.5 text-xs font-semibold text-plumbob">
              {content.beta_badge}
            </span>
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

        {user?.betaTester && (
          <div className="mt-8 pt-6 border-t border-border/60">
            <h2 className="text-lg font-semibold mb-4">{content.beta_extensions_title}</h2>

            {loadingPurchases && (
              <p className="text-sm text-text-sub">{content.beta_extensions_loading}</p>
            )}

            {!loadingPurchases && betaPurchases.length === 0 && (
              <p className="text-sm text-text-sub">{content.beta_extensions_empty}</p>
            )}

            {!loadingPurchases && betaPurchases.length > 0 && (
              <div className="space-y-3">
                {betaPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center gap-4 rounded-xl border border-plumbob/40 bg-plumbob/5 p-3"
                  >
                    <img
                      src={purchase.extension.image}
                      alt={purchase.extension.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-text-main">{purchase.extension.name}</p>
                      <p className="text-xs text-text-sub">
                        {(content.beta_extensions_item_meta || "")
                          .replace("{{date}}", purchase.date)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-plumbob/15 border border-plumbob/30 px-2.5 py-0.5 text-xs font-semibold text-plumbob">
                      {content.beta_badge}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}

export default ProfilePage;