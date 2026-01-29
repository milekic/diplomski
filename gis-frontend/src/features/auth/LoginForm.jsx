import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./authApi";

import { 
  Container, 
  Form, 
  Button, 
  Alert, 
  Card 
} from "react-bootstrap";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    

    try {
      const result = await login({
        userName: username,
        password: password
      });

      // čuvanje tokena
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);

      // redirect po roli
      if (result.role === "ADMIN") {
        navigate("/adminDashboard");
      } else {
        navigate("/userDashboard");
      }

    } catch (err) {
        console.log("Axios error:", err);
  console.log("Status:", err?.response?.status);
  console.log("Response data:", err?.response?.data);
  console.log("Message:", err?.message);
      setError("Pogrešan username ili lozinka");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container style={{ maxWidth: "400px" }}>
        <Card className="shadow-sm p-4">

          <h4 className="text-center mb-4">Login</h4>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100"
            >
              Login
            </Button>

          </Form>

        </Card>
      </Container>
    </div>
  );
}
