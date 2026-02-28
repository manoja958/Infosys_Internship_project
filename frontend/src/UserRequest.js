import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function UserRequest() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async () => {

    if (!username || !email) {
      setMessage("All fields required ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:9090/auth/request-user",
        { username, email }
      );

      setMessage(res.data);

    } catch (error) {
      setMessage(error.response?.data || "Request failed ❌");
    }
  };

  return (
    <div className="login-card">

      <h2 className="login-title">User Account Request</h2>

      <input
        className="input-field"
        type="text"
        placeholder="Desired Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="input-field"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="login-btn" onClick={handleRequest}>
        Send Request
      </button>

      {message && <p className="error-msg">{message}</p>}

      <p className="link-text" onClick={() => navigate("/")}>
        Back to Login
      </p>

    </div>
  );
}

export default UserRequest;