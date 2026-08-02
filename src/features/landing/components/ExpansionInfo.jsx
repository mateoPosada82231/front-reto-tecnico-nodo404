function ExpansionInfo({ pack }) {
  return (
    <>
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
    </>
  );
}

export default ExpansionInfo;