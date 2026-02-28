// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function AdminSignup() {

//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSignup = async () => {

//     if (!username || !email || !password) {
//       setMessage("All fields are required ❌");
//       return;
//     }

//     try {

//       const response = await axios.post(
//         "http://localhost:9090/auth/admin-signup",
//         {
//           username,
//           email,
//           password,
//           role: "ADMIN"
//         }
//       );

//       setMessage(response.data);

//       if (response.data === "Signup successful") {
//         setTimeout(() => navigate("/"), 1500);
//       }

//     } catch (error) {
//       setMessage(error.response?.data || "Signup failed ❌");
//     }
//   };

//   return (
//     <div className="login-card">

//       <h2 className="login-title">Admin Signup</h2>

//       <input
//         className="input-field"
//         type="text"
//         placeholder="Username"
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <input
//         className="input-field"
//         type="email"
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         className="input-field"
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button className="login-btn" onClick={handleSignup}>
//         Create Admin
//       </button>

//       {message && <p className="error-msg">{message}</p>}

//       <p className="link-text" onClick={() => navigate("/")}>
//         Back to Login
//       </p>

//     </div>
//   );
// }

// export default AdminSignup;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function AdminSignup() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();   // ✅ Prevent page refresh

    if (!username || !email || !password) {
      setMessage("All fields are required ❌");
      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:9090/auth/admin-signup",
        {
          username,
          email,
          password,
          role: "ADMIN"
        }
      );

      setMessage(response.data);

      if (response.data === "Signup successful") {
        setTimeout(() => navigate("/"), 1500);
      }

    } catch (error) {
      setMessage(error.response?.data || "Signup failed ❌");
    }
  };

  return (
    <div className="login-card">

      <h2 className="login-title">Admin Signup</h2>

      <form onSubmit={handleSignup}>

        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-btn">
          Create Admin
        </button>

      </form>

      {message && <p className="error-msg">{message}</p>}

      <p className="link-text" onClick={() => navigate("/")}>
        Back to Login
      </p>

    </div>
  );
}

export default AdminSignup;