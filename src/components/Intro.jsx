import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import illustration from "../assets/illustration.jpg";

const Intro = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isRegistering
        ? "https://be-cash-flow-keeper.vercel.app/authentication/register"
        : "https://be-cash-flow-keeper.vercel.app/authentication/login";

      const response = await axios.post(endpoint, { username, password });

      const token = response.data.data.accessToken;
      const id = response.data.data.id;

      // Simpan token ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("id", id);

      // Redirect ke dashboard setelah berhasil login
      // window.location.reload();
      navigate("/dashboard");
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please check your credentials.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://be-cash-flow-keeper.vercel.app/authentication/register",
        {
          username,
          password,
        }
      );

      alert("Registration successful! Please login.");
      setIsRegistering(false);
    } catch (error) {
      console.error("Registration error:", error.response.data.message);
      if (error.response.data.message === "username already exist") {
        alert("You already have an account. Please go back to Login");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="intro">
      <div>
        <h1>Welcome to HALOOOOO</h1>
        <h1 className="accent">Cash Flow Keeper</h1>
        <p>
          Your personal or family financial management assistant. Take control
          of your money with ease.
        </p>

        {isRegistering ? (
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Create a username"
              autoComplete="username"
              style={{ width: "465px", marginBottom: "10px" }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              autoComplete="new-password"
              style={{ width: "465px", marginBottom: "10px" }}
            />
            <button
              type="submit"
              style={{ width: "465px" }}
              className="btn btn--dark"
            >
              <span>Register</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="Username"
              style={{ width: "465px", marginBottom: "10px" }}
              autoComplete="username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{ width: "465px", marginBottom: "10px" }}
              autoComplete="current-password"
            />
            <button
              type="submit"
              style={{ width: "465px" }}
              width={600}
              className="btn btn--dark"
            >
              <span>Login</span>
            </button>
          </form>
        )}
        <p style={{ fontSize: "medium" }}>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}
        </p>
        <button
          className="btn btn--link"
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ width: "465px" }}
        >
          {isRegistering ? "Back to Login" : "Register"}
        </button>
      </div>
      <img src={illustration} alt="Manage Money" width={600} />
    </div>
  );
};

export default Intro;
