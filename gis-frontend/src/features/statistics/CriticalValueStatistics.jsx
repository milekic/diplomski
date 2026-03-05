import { useEffect, useState } from "react";
import apiClient from "../../shared/api/apiClient";
import {
  buildStackedBars,
  normalizeStatisticsRows,
} from "./criticalValueStatisticsHelpers";
import "./CriticalValueStatistics.css";

export default function CriticalValueStatistics() {
  const [rawRows, setRawRows] = useState([]);
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
          setRawRows(data);
        }
      } catch {
        if (!cancelled) {
          setRawRows([]);
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

  const rows = normalizeStatisticsRows(rawRows);
  const bars = buildStackedBars(rows, 340);

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <h1 className="h4 mb-3">Statistike po oblastima</h1>

        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="d-flex align-items-center gap-2 small">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#ff0000",
              }}
            />
            Kriticne vrijednosti
          </div>
          <div className="d-flex align-items-center gap-2 small">
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#0000ff",
              }}
            />
            Vrijednosti u granicama normale
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-muted">Ucitavanje...</div>
        ) : bars.length === 0 ? (
          <div className="text-muted">Nema podataka za prikaz.</div>
        ) : (
          <div className="critical-chart">
            <div className="critical-chart__plot">
              {bars.map((bar) => (
                <div className="critical-chart__group" key={bar.areaId}>
                  <div
                    className="critical-chart__bar"
                    title={`Oblast: ${bar.areaName} | Kriticno: ${bar.criticalCount} | Normalno: ${bar.normalCount}`}
                  >
                    <div
                      className="critical-chart__normal"
                      style={{ height: `${bar.normalHeight}px` }}
                    />
                    <div
                      className="critical-chart__critical"
                      style={{ height: `${bar.criticalHeight}px` }}
                    />
                  </div>
                  <div className="critical-chart__label">{bar.areaName}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
