import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import useExpansionDetail from "../hooks/useExpansionDetail";
import useAuthStore from "../../../shared/stores/useAuthStore";
import useCart from "../../../shared/hooks/useCart";
import useCartUIStore from "../../../shared/stores/useCartUIStore";
import Button from "../../../shared/components/Button";
import Skeleton from "../../../shared/components/Skeleton";
import Alert from "../../auth/components/Alert";
import BuyDirectForm from "../../buys/components/BuyDirectForm";
import AddToCartForm from "../../cart/components/AddToCartForm";
import { getFriendlyError } from "../../../shared/utils/errors";

function ExpansionDetailPage() {
  const { id } = useParams();
  const { email, isLoggedIn } = useAuthStore();
  const { addItem } = useCart();
  const { open: openCart } = useCartUIStore();
  const {
    pack,
    loading,
    error,
    buySuccess,
    buyError,
    buying,
    showForm,
    setShowForm,
    submitBuy,
    detailContent,
    errorsContent,
  } = useExpansionDetail(id, email);

  const [showCartForm, setShowCartForm] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-10 space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="max-w-3xl mx-auto p-10 space-y-4">
        <Alert variant="error">{detailContent.not_found}</Alert>
        <Button variant="secondary" href="/">
          <ArrowLeft className="h-4 w-4" />
          {detailContent.back_text}
        </Button>
      </div>
    );
  }

  const handleAddToCart = async (formData) => {
    setAddingToCart(true);
    setCartError(null);
    try {
      await addItem({
        email,
        extensionId: pack.id,
        language: formData.language,
        platform: formData.platform,
      });
      setCartSuccess(true);
      setShowCartForm(false);
      openCart();
    } catch (err) {
      setCartError(getFriendlyError(errorsContent, err));
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-text-sub hover:text-text-main transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {detailContent.back_text}
      </Link>

      <h1 className="text-3xl font-bold text-text-main">{pack.name}</h1>
      <p className="text-text-sub mb-2">
        {detailContent.category_label}: {pack.category}
      </p>
      <p className="text-2xl font-semibold text-text-main mb-6">
        ${pack.price?.toLocaleString("es-CO")}
      </p>

      {pack.image && (
        <div className="relative overflow-hidden rounded-2xl border border-border/50 mb-8">
          <img
            src={pack.image}
            alt={pack.name}
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-6">
        <div>
          <span className="text-text-sub">
            {detailContent.required_age_label}
          </span>
          <p className="text-text-main">
            {pack.requiredAge}+ {detailContent.years_text}
          </p>
        </div>
        <div>
          <span className="text-text-sub">
            {detailContent.distributor_label}
          </span>
          <p className="text-text-main">{pack.distributor}</p>
        </div>
        <div>
          <span className="text-text-sub">
            {detailContent.publication_date_label}
          </span>
          <p className="text-text-main">{pack.publicationDate}</p>
        </div>
        <div>
          <span className="text-text-sub">{detailContent.platforms_label}</span>
          <p className="text-text-main">{pack.platforms}</p>
        </div>
        <div>
          <span className="text-text-sub">{detailContent.languages_label}</span>
          <p className="text-text-main">{pack.languages}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-main mb-2">
          {detailContent.about_label}
        </h2>
        <p className="text-text-main">{pack.aboutGame}</p>
      </div>

      {!isLoggedIn && (
        <Alert variant="info" className="mb-4">
          {detailContent.login_required}{" "}
          <Link to="/login" className="underline font-medium">
            {detailContent.login_link}
          </Link>
        </Alert>
      )}

      {buySuccess && (
        <Alert variant="success" className="mb-4">
          <span className="inline-flex items-center gap-1.5">
            {detailContent.success_message}
          </span>
        </Alert>
      )}

      {buyError && (
        <Alert variant="error" className="mb-4">
          {buyError}
        </Alert>
      )}

      {cartSuccess && (
        <Alert variant="success" className="mb-4">
          <span className="inline-flex items-center gap-1.5">
            {detailContent.add_to_cart_success}
          </span>
        </Alert>
      )}

      {cartError && (
        <Alert variant="error" className="mb-4">
          {cartError}
        </Alert>
      )}

      {isLoggedIn && !buySuccess && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {!showForm && !showCartForm && (
              <>
                <Button onClick={() => setShowForm(true)}>
                  {detailContent.buy_button}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCartForm(true)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {detailContent.add_to_cart_button}
                </Button>
              </>
            )}
          </div>
          {showForm && (
            <BuyDirectForm
              onSubmit={submitBuy}
              onCancel={() => setShowForm(false)}
              buying={buying}
            />
          )}
          {showCartForm && (
            <AddToCartForm
              onSubmit={handleAddToCart}
              onCancel={() => setShowCartForm(false)}
              loading={addingToCart}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ExpansionDetailPage;
