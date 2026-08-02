import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExtensionById } from "../../../shared/services/extensions";
import useAuthStore from "../../../shared/stores/useAuthStore";
import { buyDirect } from "../../../shared/services/buys";

function ExpansionDetailPage() {
  const { id } = useParams();
  const { email, isLoggedIn } = useAuthStore();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [buyError, setBuyError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getExtensionById(id)
      .then((result) => {
        if (!cancelled) setPack(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  async function handleBuy() {
    setBuying(true);
    setBuyError(null);

    try {
      await buyDirect({
        email,
        extensionId: pack.id,
        paymentMethod: "CARD",
        language: "ES",
        platform: "PC",
      });
      setBuySuccess(true);
    } catch (err) {
      setBuyError(err.message);
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return <p className="max-w-3xl mx-auto p-10">Cargando...</p>;
  }

  if (error || !pack) {
    return (
      <div className="max-w-3xl mx-auto p-10">
        <p>Expansión no encontrada.</p>
        <Link to="/" className="text-sm text-gray-600 hover:underline">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <Link to="/" className="inline-block mb-6 text-sm text-gray-600 hover:underline">
        ← Volver
      </Link>

      <h1 className="text-3xl font-bold">{pack.name}</h1>
      <p className="text-gray-500 mb-2">{pack.category}</p>
      <p className="text-2xl font-semibold mb-6">
        ${pack.price?.toLocaleString("es-CO")}
      </p>

      <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
        <span className="text-gray-500">Edad:</span>
        <span>{pack.requiredAge}+</span>

        <span className="text-gray-500">Distribuidor:</span>
        <span>{pack.distributor}</span>

        <span className="text-gray-500">Fecha:</span>
        <span>{pack.publicationDate}</span>

        <span className="text-gray-500">Plataformas:</span>
        <span>{pack.platforms}</span>

        <span className="text-gray-500">Idiomas:</span>
        <span>{pack.languages}</span>
      </div>

      <p className="mb-8">{pack.aboutGame}</p>

      {!isLoggedIn && (
        <p className="text-sm text-red-500 mb-4">
          Debes iniciar sesión para comprar. <Link to="/login" className="underline">Ir a login</Link>
        </p>
      )}

      {buySuccess && (
        <p className="text-sm text-green-600 mb-4">
          ¡Compra realizada con éxito! 🎉
        </p>
      )}

      {buyError && (
        <p className="text-sm text-red-500 mb-4">
          {buyError}
        </p>
      )}

      <button
        onClick={handleBuy}
        disabled={!isLoggedIn || buying || buySuccess}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buying ? "Comprando..." : buySuccess ? "Comprado ✓" : "Comprar"}
      </button>
    </div>
  );
}

export default ExpansionDetailPage;