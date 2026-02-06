export default function AreaDetailsPanel({ area }) {
  return (
    <div className="border rounded h-100 p-3 bg-light">

      <h6 className="mb-3">Detalji oblasti</h6>

      {!area ? (
        <div className="text-muted text-center mt-5">
          Nema selektovane oblasti
        </div>
      ) : (
        <>
          <div className="mb-2">
            <strong>Naziv:</strong> {area.name}
          </div>

          <div className="mb-2">
            <strong>Opis:</strong> {area.description || "-"}
          </div>

          <div className="mb-2">
            <strong>Globalna:</strong>{" "}
            {area.isGlobal ? "Da" : "Ne"}
          </div>
        </>
      )}

    </div>
  );
}
