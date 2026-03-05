import { useEffect, useState } from "react";
import apiClient from "../../shared/api/apiClient";

export default function CriticalValueStatistics() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiClient.get("/areas/my/measurements-summary");
        const data = Array.isArray(response.data) ? response.data : [];

        if (!cancelled) {
          setRows(data);
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setError("Ne mogu ucitati statistike.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <h1 className="h4 mb-3">Statistike po oblastima</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-muted">Ucitavanje...</div>
        ) : rows.length === 0 ? (
          <div className="text-muted">Nema podataka za prikaz.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Oblast</th>
                  <th>Kriticna mjerenja</th>
                  <th>Mjerenja u granicama normale</th>
                  <th>Ukupno mjerenja</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.areaId ?? row.AreaId ?? `row-${index}`}>
                    <td>{row.areaName ?? row.AreaName ?? "-"}</td>
                    <td>{row.criticalCount ?? row.CriticalCount ?? 0}</td>
                    <td>{row.normalCount ?? row.NormalCount ?? 0}</td>
                    <td>{row.totalCount ?? row.TotalCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
