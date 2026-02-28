// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// function ResetPassword() {

//   const navigate = useNavigate();
//   const location = useLocation();

//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   // Extract token from URL
//   const queryParams = new URLSearchParams(location.search);
//   const token = queryParams.get("token");

//   const handleReset = async () => {
//     try {
//       await axios.post(
//         "http://localhost:9090/auth/reset",
//         null,
//         {
//           params: {
//             token: token,
//             password: password
//           }
//         }
//       );

//       setMessage("Password reset successful 🎉");

//       setTimeout(() => {
//         navigate("/");
//       }, 2000);

//     } catch (error) {
//       setMessage("Invalid or expired token ❌");
//     }
//   };

//   return (
//     <div className="login-card">
//       <h2>Reset Password</h2>

//       <input
//         className="input-field"
//         type="password"
//         placeholder="Enter new password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button className="login-btn" onClick={handleReset}>
//         Reset Password
//       </button>

//       <p className="message">{message}</p>
//     </div>
//   );
// }

// export default ResetPassword;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleReset = async () => {
    try {
      await axios.post(
        "http://localhost:9090/auth/reset",
        null,
        {
          params: {
            token: token,
            password: password
          }
        }
      );

      setMessage("Password reset successful 🎉");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setMessage("Invalid or expired token ❌");
    }
  };

  return (
    <div className="login-card">
      <h2>Reset Password</h2>

      <input
        className="input-field"
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleReset}>
        Reset Password
      </button>

      <p className="message">{message}</p>
    </div>
  );
}

export default ResetPassword;
