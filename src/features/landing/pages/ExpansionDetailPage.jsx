import { useParams } from "react-router-dom";
import { expansionPacks } from "../../../data/expansionPacks";

function ExpansionDetailPage() {
  const { id } = useParams();
  const pack = expansionPacks.find((p) => p.id === id);

  if (!pack) {
    return <p>Expansión no encontrada.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
    <img
      src={pack.image}
      alt={pack.name}
      className="w-full rounded-xl mb-6 object-cover"
    />

    <h1 className="text-3xl font-bold">{pack.name}</h1>
    <p className="text-gray-500 mb-4">{pack.category}</p>
    <p className="text-2xl font-semibold mb-6">
      ${pack.price.toLocaleString("es-CO")}
    </p>

    <p className="mb-8">{pack.description}</p>
  </div>
  );
}

export default ExpansionDetailPage;