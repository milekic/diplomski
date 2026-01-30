import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "./authApi";

import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    setLoading(true);
    try {
      await register({
        userName: username,
        email: email,
        password: password,
      });

      setSuccess("Registracija uspješna. Preusmjeravam na login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const msg = err?.response?.data?.message;

      if (err?.response?.status === 400) {
        setError(msg || "Registracija nije uspjela.");
      } else {
        setError("Greška na serveru. Pokušaj ponovo.");
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
      <Container style={{ maxWidth: "560px" }}>
        <Card className="shadow-lg border-0" style={{ borderRadius: "18px" }}>
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

              <h2 className="fw-bold mb-1">Kreiraj nalog</h2>
              <div className="text-muted">
                Registruj se da bi mogao koristiti sistem.
              </div>
            </div>

            {error && <Alert variant="danger" className="py-2">{error}</Alert>}
            {success && <Alert variant="success" className="py-2">{success}</Alert>}

            
            <Form onSubmit={handleSubmit} autoComplete="off">
              <input
                type="text"
                name="fakeuser"
                style={{ display: "none" }}
                autoComplete="off"
              />
              <input
                type="password"
                name="fakepass"
                style={{ display: "none" }}
                autoComplete="off"
              />

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Korisničko ime</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  size="lg"
                  type="email"        
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="fw-semibold">Lozinka</Form.Label>
                <Form.Control
                  size="lg"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                  autoComplete="new-password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="fw-semibold">Potvrdi lozinku</Form.Label>
                <Form.Control
                  size="lg"
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </Form.Group>

              <div className="d-flex align-items-center justify-content-between mb-4">
               
                
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
                    Registrujem...
                  </>
                ) : (
                  "Registruj se"
                )}
              </Button>

              <div className="text-center mt-4">
                <span className="text-muted">Već imaš nalog?</span>{" "}
                <Link className="text-decoration-none fw-semibold" to="/login">
                  Prijavi se
                </Link>
              </div>

              <div className="text-center text-muted mt-4" style={{ fontSize: 12 }}>
                © {new Date().getFullYear()} GIS Sistem • Sigurna registracija
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
