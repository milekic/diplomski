import { useEffect, useState } from "react";
import AreasTable from "../features/areas/components/AreasTable";
import AreaDetailsPanel from "../features/areas/components/AreaDetailsPanel";
import { getMyAreas } from "../features/areas/components/areasApi";
import usePagination from "../shared/hooks/usePagination";

export default function AreasPage() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    currentPage,
    totalPages,
    pagedItems: pagedAreas,
    next,
    prev,
    reset,
  } = usePagination(areas, 10);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await getMyAreas();
      setAreas(data);
      reset(); 
      setSelectedArea(null);
    } catch (err) {
      console.error("Greška pri učitavanju oblasti:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid h-100">
      <div className="row h-100 p-3">
        <div className="col-8 d-flex flex-column">
          {loading ? (
            <div className="text-center mt-5 text-muted">Učitavanje podataka...</div>
          ) : (
            <AreasTable
              items={pagedAreas}
              selectedId={selectedArea?.id ?? null}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => {
                prev();
                setSelectedArea(null);
              }}
              onNext={() => {
                next();
                setSelectedArea(null);
              }}
              onSelect={setSelectedArea}
              //ovu su privremeni ispisi
              onAdd={() => console.log("Dodaj")}
              onEdit={(id) => console.log("Edit", id)}
              onDelete={(id) => console.log("Obriši", id)}
              onViewDetails={() => console.log("Pregled detalja")}
            />
          )}
        </div>

        <div className="col-4">
          <AreaDetailsPanel area={selectedArea} />
        </div>
      </div>
    </div>
  );
}
