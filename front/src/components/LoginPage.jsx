import React, { useState } from "react";
import axios from "axios";
import "./components.css"; 
import 'bootstrap/dist/css/bootstrap.min.css';


const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { user } = response.data;
      setMessage("Login successful!");
      setRole(user.role);
      setUser(user);
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data?.error || error.message));
      setRole("");
      setUser(null);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-success w-100" onClick={handleLogin}>
          Login
        </button>

        {message && (
          <div
            className={`alert mt-3 ${
              message.includes("failed") ? "alert-danger" : "alert-success"
            }`}
          >
            {message}
            {role && (
              <div>
                <strong>Role:</strong> {role}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;