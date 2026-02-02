import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./authApi";

import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({
        userName: username,
        password: password,
      });

      
      const token = result.token ?? result.Token;
      const role = result.role ?? result.Role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "ADMIN") navigate("/adminDashboard");
      else navigate("/userDashboard");
    } catch (err) {
      const msg = err?.response?.data?.message;

      if (err?.response?.status === 403) {
        setError(msg || "Nalog je suspendovan.");
      } else if (err?.response?.status === 401) {
        setError(msg || "Pogrešan username ili lozinka.");
      } else {
        setError("Greška. Pokušaj ponovo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "radial-gradient(1200px circle at 20% 10%, #dbeafe 0%, transparent 45%), radial-gradient(1000px circle at 80% 30%, #e0e7ff 0%, transparent 45%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <Container style={{ maxWidth: "520px" }}>
        <Card
          className="shadow-lg border-0"
          style={{ borderRadius: "18px" }}
        >
          <Card.Body className="p-4 p-md-5">
            
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                GIS
              </div>

              <h2 className="fw-bold mb-1">Prijava na sistem</h2>
             
            </div>

            {error && (
              <Alert variant="danger" className="py-2">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Korisničko ime</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="npr. ognjen"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="fw-semibold">Lozinka</Form.Label>
                <Form.Control
                  size="lg"
                  type={showPass ? "text" : "password"}
                  placeholder="Unesi lozinku"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Form.Group>

              <div className="d-flex align-items-center justify-content-between mb-4">
                <Form.Check
                  type="checkbox"
                  id="showPass"
                  label="Prikaži lozinku"
                  checked={showPass}
                  onChange={(e) => setShowPass(e.target.checked)}
                />
                
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-2 fw-semibold"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Prijavljivanje...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">Nemaš nalog?</span>{" "}
              <Link className="text-decoration-none fw-semibold" to="/register">
                Registruj se
              </Link>
            </div>

            
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
