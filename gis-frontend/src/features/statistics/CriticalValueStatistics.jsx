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
          setError("Ne mogu učitati statistike.");
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
  const totalCritical = rows.reduce((sum, row) => sum + row.criticalCount, 0);
  const totalNormal = rows.reduce((sum, row) => sum + row.normalCount, 0);
  const chartMinWidth = `${Math.max(640, bars.length * 112)}px`;

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <h1 className="h4 mb-0">Statistika po oblastima</h1>

          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 small">
              <span className="critical-chart__legend-dot critical-chart__legend-dot--critical" />
              Kritične vrijednosti
            </div>
            <div className="d-flex align-items-center gap-2 small">
              <span className="critical-chart__legend-dot critical-chart__legend-dot--normal" />
              Vrijednosti u granicama normale
            </div>
          
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
            <div className="critical-chart__plot" style={{ minWidth: chartMinWidth }}>
              {bars.map((bar) => (
                <div className="critical-chart__group" key={bar.areaId}>
                  <div className="critical-chart__value">{bar.totalCount}</div>
                  <div
                    className={`critical-chart__bar ${
                      bar.hasData ? "" : "critical-chart__bar--empty"
                    }`}
                  >
                    {bar.hasData ? (
                      <>
                        <div
                          className="critical-chart__normal"
                          style={{ height: `${bar.normalHeight}px` }}
                          title={`Oblast: ${bar.areaName} | Broj mjerenja u granicama normale: ${bar.normalCount}`}
                        />
                        <div
                          className="critical-chart__critical"
                          style={{ height: `${bar.criticalHeight}px` }}
                          title={`Oblast: ${bar.areaName} | Broj kriticnih mjerenja: ${bar.criticalCount}`}
                        />
                      </>
                    ) : (
                      <div className="critical-chart__empty-segment" />
                    )}
                  </div>
                  <div className="critical-chart__label" title={bar.areaName}>
                    {bar.areaName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
