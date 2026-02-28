import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendToken = async () => {
    try {
      await axios.post(
        "http://localhost:9090/auth/forgot",
        null,
        { params: { email } }
      );

      setMessage("Reset link sent to your email 📩");

    } catch (error) {
      setMessage(error.response?.data || "Email not found ❌");
    }
  };

  const handleResetPassword = async () => {
    try {

      await axios.post(
        "http://localhost:9090/auth/reset",
        {
          token,
          password
        }
      );

      setMessage("Password updated successfully 🎉");

      setTimeout(() => navigate("/"), 2000);

    } catch (error) {
      setMessage(error.response?.data || "Invalid or expired token ❌");
    }
  };

  return (
    <div className="login-card">

      <h2 className="login-title">Forgot Password</h2>

      <input
        className="input-field"
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="login-btn" onClick={handleSendToken}>
        Send Reset Link
      </button>

      <br /><br />

      <input
        className="input-field"
        type="text"
        placeholder="Enter token from email"
        onChange={(e) => setToken(e.target.value)}
      />

      <input
        className="input-field"
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleResetPassword}>
        Update Password
      </button>

      {message && <p className="error-msg">{message}</p>}

      <p className="link-text" onClick={() => navigate("/")}>
        Back to Login
      </p>

    </div>
  );
}

export default ForgotPassword;
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [token, setToken] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   // Send token to email
//   const handleSendToken = async () => {
//     try {
//       await axios.post(
//         "http://localhost:9090/auth/forgot",
//         null,
//         { params: { email: email } }
//       );

//       setMessage("Reset token sent to your email 📩");
//     } catch (error) {
//       setMessage("Error sending email ❌");
//     }
//   };

//   // Reset password using token
//   const handleResetPassword = async () => {
//     try {
//       await axios.post(
//         "http://localhost:9090/auth/reset",
//       //  null,
//         {
//         //  params: {
//             token: token,
//             password: password
//          // }
//         }
//       );

//       setMessage("Password updated successfully 🎉");

//       setTimeout(() => {
//         navigate("/");
//       }, 2000);

//     } catch (error) {
//       setMessage("Invalid token or expired ❌");
//     }
//   };

//   return (
//     <div className="login-card">
//       <h2>Forgot Password</h2>

//       <input
//         className="input-field"
//         type="email"
//         placeholder="Enter your email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <button className="login-btn" onClick={handleSendToken}>
//         Send Reset Token
//       </button>

//       <br /><br />

//       <input
//         className="input-field"
//         type="text"
//         placeholder="Enter token from email"
//         onChange={(e) => setToken(e.target.value)}
//       />

//       <input
//         className="input-field"
//         type="password"
//         placeholder="Enter new password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button className="login-btn" onClick={handleResetPassword}>
//         Update Password
//       </button>

//       <p className="message">{message}</p>

//       <p className="link-text" onClick={() => navigate("/")}>
//         Back to Login
//       </p>
//     </div>
//   );
// }

// export default ForgotPassword;
