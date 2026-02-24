export default function AdminUserStats({
  totalUsers = 0,
  activeUsers = 0,
  suspendedUsers = 0,
}) {
  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h6>Ukupno korisnika</h6>
            <h3>{totalUsers}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h6>Aktivni korisnici</h6>
            <h3>{activeUsers}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h6>Suspendovani korisnici</h6>
            <h3>{suspendedUsers}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
