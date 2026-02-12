import { useEffect, useState } from "react";
import AreasTable from "../features/areas/components/AreasTable";
import AreaDetailsPanel from "../features/areas/components/AreaDetailsPanel";
import { getMyAreas, deleteArea, createArea, updateArea } from "../features/areas/components/areasApi";
import usePagination from "../shared/hooks/usePagination";
import ConfirmModal from "../shared/ui/ConfirmModal";
import AreaCreateModal from "../features/areas/components/AreaCreateModal";
import AreaEditModal from "../features/areas/components/AreaEditModal";






export default function AreasPage() {
  const PAGE_SIZE = 10;

  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const {
    currentPage,
    totalPages,
    pagedItems: pagedAreas,
    next,
    prev,
    reset,
    setCurrentPage,
  } = usePagination(areas, PAGE_SIZE);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await getMyAreas();
    setAreas(data);
    reset();
    setSelectedArea(null);
  } catch (err) {
    setError("Došlo je do greške pri učitavanju oblasti. Pokušajte ponovo.");
  } finally {
    setLoading(false);
  }

 



};


  // klik na dugme za brisanje 
  const onAskDelete = () => {
    if (!selectedArea) return;
    setShowDeleteModal(true);
  };

  const showSuccess = (msg) => {
  setSuccess(msg);
  setTimeout(() => setSuccess(null), 3000);
 };


  // OK u modalu 
  const onConfirmDelete = async () => {
    if (!selectedArea) return;

    try {
      setDeleting(true);
      await deleteArea(selectedArea.id);

      const nextAreas = areas.filter((a) => a.id !== selectedArea.id);
      setAreas(nextAreas);

      const newTotalPages = Math.max(1, Math.ceil(nextAreas.length / PAGE_SIZE));

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
   
      setSelectedArea(null);
      setShowDeleteModal(false);

      setError(null);
      showSuccess("Oblast je uspješno obrisana ✅");

    } catch (err) {
      setError("Došlo je do greške pri brisanju oblasti. Pokušajte ponovo.");
    } finally {
      setDeleting(false);
}

  };

  const onCreateArea = async (payload) => {
  try {
    setCreating(true);
    setError(null);
    setSuccess(null);

    await createArea(payload);
    await loadAreas();

    setShowCreateModal(false);
    showSuccess("Nova oblast je uspješno dodata ✅");
  } catch (err) {
    setError("Došlo je do greške pri dodavanju oblasti.");
    throw err;
  } finally {
    setCreating(false);
  }
};



  return (
    <div className="container-fluid h-100">
      <div className="row h-100 p-3">

      {error && (
        <div className="col-12">
        <div className="alert alert-danger" role="alert">
        {error}
        </div>
        </div>
      )}

      {success && (
        <div className="col-12">
        <div className="alert alert-success d-flex justify-content-between align-items-center" role="alert">
         <span>{success}</span>
        <button
         type="button"
         className="btn-close"
         aria-label="Zatvori"
         onClick={() => setSuccess(null)}
        />
        </div>
      </div>
      )}



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
              onAdd={() =>{ 
                setError(null);
                setSuccess(null);
                setShowCreateModal(true);
              }}

              onEdit={() => {
                 setError(null);
                 setSuccess(null);
                 setShowEditModal(true);
                }}

              onDelete={onAskDelete}
              onViewDetails={() => console.log("Pregled detalja")}
            />
          )}
        </div>

        <div className="col-4">
          <AreaDetailsPanel area={selectedArea} />
        </div>
      </div>

      <ConfirmModal
        show={showDeleteModal}
        title="Brisanje oblasti"
        message={
          selectedArea
            ? `Da li ste sigurni da želite obrisati oblast: "${selectedArea.name}"?`
            : "Da li ste sigurni?"
        }
        confirmText="Obriši"
        cancelText="Otkaži"
        loading={deleting}
        onClose={() => !deleting && setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
      />

         <AreaCreateModal
            show={showCreateModal}
            loading={creating}
            onClose={() => !creating && setShowCreateModal(false)}
            onCreate={onCreateArea}
          />

          {/*Izbrisati ispis na konzolu */}
          <AreaEditModal
            show={showEditModal}
            area={selectedArea}
            loading={editing}
            onClose={() => !editing && setShowEditModal(false)}
            onEdit={async (payload) => {
                try {
                setEditing(true);
                setError(null);
                setSuccess(null);

                await updateArea(selectedArea.id, payload);
                await loadAreas();

                setShowEditModal(false);
                showSuccess("Oblast je uspješno izmijenjena ✅");
                } catch (err) {
                setError("Došlo je do greške pri izmjeni oblasti.");
                throw err;
                } finally {
                 setEditing(false);
                }
            }}

          />



    </div>
  );
}
