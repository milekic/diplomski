export default function AppFooter() {
  return (
    <footer className="bg-light border-top py-3">
      <div className="container-fluid text-center small text-muted">

        <div className="mb-1">
          GIS sistem za detekciju opasnosti
        </div>

        <div>
          © {new Date().getFullYear()} ETF Banja Luka
        </div>

      </div>
    </footer>
  );
}
