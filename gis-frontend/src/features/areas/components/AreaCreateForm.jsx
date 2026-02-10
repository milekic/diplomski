import { useState } from "react";
import PolygonDrawMap from "./PolygonDrawMap";

export default function AreaCreateForm({
  onSubmit = async () => {},
  onCancel = () => {},
  loading = false,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [isMonitored, setIsMonitored] = useState(true);

  const [geomGeoJson, setGeomGeoJson] = useState("");
  const [error, setError] = useState(null);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Naziv je obavezan.");
    if (!geomGeoJson.trim()) return setError("Morate nacrtati poligon na mapi.");

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        isGlobal,
        isMonitored,
        geomGeoJson,
      });
    } catch (err) {
      setError(err?.message ?? "Greška pri čuvanju.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3">
        {/* Lijevo: forma */}
        <div className="col-12 col-lg-5">
          <div className="mb-2">
            <label className="form-label">Naziv</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              placeholder="npr. Kritična zona - Vrbas"
              disabled={loading}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Opis</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              placeholder="Opcionalno..."
              disabled={loading}
            />
          </div>

          <div className="form-check mb-2">
            <input
              id="isGlobal"
              className="form-check-input"
              type="checkbox"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="isGlobal">
              Globalna oblast (vidljiva drugim korisnicima)
            </label>
          </div>

          <div className="form-check mb-2">
            <input
              id="isMonitored"
              className="form-check-input"
              type="checkbox"
              checked={isMonitored}
              onChange={(e) => setIsMonitored(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="isMonitored">
              Praćenje uključeno
            </label>
          </div>

          <div className="small text-muted mt-2">
            {geomGeoJson ? "Poligon je postavljen ✅" : "Nema poligona ❌"}
          </div>
        </div>

        {/* Desno: mapa */}
        <div className="col-12 col-lg-7">
          <PolygonDrawMap
            height={320}
            onGeoJsonChange={setGeomGeoJson}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Otkaži
        </button>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Čuvanje..." : "Sačuvaj"}
        </button>
      </div>
    </form>
  );
}
