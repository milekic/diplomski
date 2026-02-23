export default function UserDashboardAreaDetailsPanel({ area }) {
  const areaName = area?.name ?? area?.Name ?? "-";

  return (
    <div className="border rounded h-100 p-3 bg-light">
      <h6 className="mb-3">Detalji oblasti</h6>

      {!area ? (
        <div className="text-muted text-center mt-5">
          Nema selektovane oblasti
        </div>
      ) : (
        <div className="mb-2">
          <strong>Naziv:</strong> {areaName}
        </div>
      )}
    </div>
  );
}
