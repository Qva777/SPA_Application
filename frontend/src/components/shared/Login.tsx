import React, { useState } from "react";
import { axiosConfig } from "@/configs/axiosConfig";
import { routes } from "@/routes";
import "../../index.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Changed to string | null
  const [loading, setLoading] = useState<boolean>(false); // Added loading state
  const [token, setToken] = useState<{ access: string; refresh: string }>({
    access: "",
    refresh: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosConfig.post(`${routes.GET_TOKEN}`, {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setToken({ access, refresh });
      setError(null);

    } catch (err: any) {
      setError(err.response?.data?.detail || "Incorrect data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="header">Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label className="label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="formGroup">
            <label className="label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {token.access && (
          <div className="tokenContainer">
            <p>Successful login</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
