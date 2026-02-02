export default function AdminDashboardPage() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">


      {/* ===== MAIN CONTENT ===== */}
      <div className="row flex-grow-1">

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="col-2 border-end p-3">

          <h6 className="mb-3">Admin meni</h6>

          <ul className="list-group">
            <li className="list-group-item active">
              Korisnici
            </li>
            <li className="list-group-item">
              Izvještaji
            </li>
            <li className="list-group-item">
              Podešavanja
            </li>
          </ul>

        </div>

        {/* ===== MAIN ADMIN AREA ===== */}
        <div className="col-10 p-4">

          <h5 className="mb-4">Upravljanje korisnicima</h5>

          {/* ===== STAT CARDS ===== */}
          <div className="row mb-4">

            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6>Ukupno korisnika</h6>
                  <h3>0</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6>Aktivni korisnici</h6>
                  <h3>0</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center">
                <div className="card-body">
                  <h6>Suspendovani korisnici</h6>
                  <h3>0</h3>
                </div>
              </div>
            </div>

          </div>

          {/* ===== SEARCH + FILTER ===== */}
          <div className="row mb-3">

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pretraži korisnike..."
              />
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>Svi statusi</option>
                <option>Aktivni</option>
                <option>Suspendovani</option>
              </select>
            </div>

          </div>

          {/* ===== USERS TABLE ===== */}
          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-light">
                <tr>
                  <th>Korisničko ime</th>
                  <th>Email</th>
                  <th>Uloga</th>
                  <th>Status</th>
                  <th>Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>marko123</td>
                  <td>marko@mail.com</td>
                  <td>Korisnik</td>
                  <td>Aktivan</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-1">
                      Suspenduj
                    </button>
                    <button className="btn btn-danger btn-sm">
                      Obriši
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>ana456</td>
                  <td>ana@mail.com</td>
                  <td>Korisnik</td>
                  <td>Suspendovan</td>
                  <td>
                    <button className="btn btn-success btn-sm me-1">
                      Aktiviraj
                    </button>
                    <button className="btn btn-danger btn-sm">
                      Obriši
                    </button>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}
