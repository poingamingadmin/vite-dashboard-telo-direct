import { useState } from "react";
import { Alert, Button, Card, Form, FormLabel, Spinner } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (!username || !password) {
      setError("Username and Password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://n-api.ug888.xyz/api/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("auth_admin", JSON.stringify(response.data.admin));
        localStorage.setItem("auth_menu", JSON.stringify(response.data.menu));
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Login failed");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card
        className="p-5 shadow-sm rounded-1"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="mb-3">
          <FormLabel>Username</FormLabel>
          <Form.Control
            type="text"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <FormLabel>Password</FormLabel>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid">
          <Button
            size="lg"
            className="rounded-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            )}{" "}
            Login
          </Button>
        </div>
        {error && (
          <Alert className="mt-3" variant="danger">
            {error}
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default Login;
