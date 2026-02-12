import { useState,useEffect } from "react";
import PolygonDrawMap from "./PolygonDrawMap";

export default function AreaCreateForm({
  onSubmit = async () => {},
  onCancel = () => {},
  loading = false,
  initialData = null,
  isEditMode = false,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [isMonitored, setIsMonitored] = useState(true);

  const [geomGeoJson, setGeomGeoJson] = useState("");
  const [error, setError] = useState(null);

  const [touched, setTouched] = useState({
    name: false,
    geom: false,
  });


  const nameValid = name.trim().length > 0;
  const geomValid = geomGeoJson.trim().length > 0;
  const isFormValid = nameValid && geomValid;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setDescription(initialData.description ?? "");
      setIsGlobal(initialData.isGlobal ?? false);
      setIsMonitored(initialData.isMonitored ?? true);
      setGeomGeoJson(initialData.geomGeoJson ?? "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    setTouched((t) => ({ ...t, name: true, geom: true }));

    if (!isFormValid) return;

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
  <form onSubmit={handleSubmit} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    {error && (
      <div className="alert alert-danger py-2" role="alert">
        {error}
      </div>
    )}

    {/* KLJUČNO: ovaj dio raste */}
    <div className="row g-3 flex-grow-1" style={{ minHeight: 0 }}>
      {/* Lijevo: forma */}
      <div className="col-12 col-lg-5">
        {/* ... tvoj postojeći kod lijevo ostaje isti ... */}

        <div className="mb-2">
          <label className="form-label">
            Naziv <span className="text-danger">*</span>
          </label>
          <input
            className={`form-control ${touched.name && !nameValid ? "is-invalid" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            maxLength={150}
            placeholder="npr. Krajina"
            disabled={loading}
          />
          {touched.name && !nameValid && (
            <div className="invalid-feedback">Naziv je obavezan.</div>
          )}
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
            Oblast je podrazumjvano vidljiva
          </label>
        </div>
      </div>

      {/* Desno: mapa - KLJUČNO: flex i minHeight:0 */}
      <div className="col-12 col-lg-7 d-flex flex-column" style={{ minHeight: 0 }}>
        <PolygonDrawMap
          height="100%"  // umjesto 320
          initialGeoJson={geomGeoJson}
          onGeoJsonChange={(value) => {
            setGeomGeoJson(value);
            if (!touched.geom) setTouched((t) => ({ ...t, geom: true }));
          }}
        />
      </div>
    </div>

    {/* Footer dugmad ostaju dole */}
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
        disabled={loading || !isFormValid}
      >
        {loading ? "Čuvanje..." : "Sačuvaj"}
      </button>
    </div>
  </form>
);


}
