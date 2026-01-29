import UsersList from "../features/admin/components/UsersList";

export default function UsersTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold p-6 text-center">
        Test Front ↔ Back konekcije
      </h1>

       <div className="p-5">
      <button className="btn btn-primary">
        Bootstrap test
      </button>
    </div>

      <div>
        Zdravo svijete
      </div>

      <UsersList />
    </div>
  );
}
