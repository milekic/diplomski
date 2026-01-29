import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7007/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Greška pri učitavanju korisnika");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-4 text-gray-600">Učitavanje...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Lista korisnika</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 border">{u.id}</td>
                <td className="p-3 border font-medium">{u.username}</td>
                <td className="p-3 border">{u.email}</td>
                <td className="p-3 border">{u.role}</td>
                <td className="p-3 border">
                  {u.isSuspended ? (
                    <span className="text-red-600 font-semibold">
                      Suspendovan
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Aktivan
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
