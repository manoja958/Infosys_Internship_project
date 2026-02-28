import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("USER");
  const [message, setMessage] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    setMessage("Please enter username and password ❌");
    return;
  }

  try {

    const response = await axios.post(
      "http://localhost:9090/auth/login",
      { username, password }
    );

    let token = response.data;

    // If backend returns object {token: "..."}
    if (typeof token === "object") {
      token = token.token;
    }

    if (typeof token !== "string") {
      setMessage("Invalid credentials ❌");
      return;
    }

    localStorage.setItem("token", token);

    const payload = JSON.parse(atob(token.split(".")[1]));
    let role = payload.role;

    // Normalize role
    if (role.startsWith("ROLE_")) {
      role = role.replace("ROLE_", "");
    }

    localStorage.setItem("role", role);

    if (role !== selectedRole) {
      setMessage("Selected role does not match your account ❌");
      localStorage.clear();
      return;
    }

    if (role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user");
    }

  } catch (error) {
    setMessage("Login failed. Check credentials ❌");
  }
};

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   if (!username || !password) {
  //     setMessage("Please enter username and password ❌");
  //     return;
  //   }

  //   try {

  //     const response = await axios.post(
  //       "http://localhost:9090/auth/login",
  //       { username, password }
  //     );

  //     const result = response.data;

  //     // If backend sends error string
  //     if (
  //       result.startsWith("Invalid") ||
  //       result.startsWith("Account") ||
  //       result.startsWith("Your")
  //     ) {
  //       setMessage(result);
  //       return;
  //     }

  //     // Save token
  //     localStorage.setItem("token", result);

  //     // Decode JWT
  //     const payload = JSON.parse(atob(result.split(".")[1]));
  //     const role = payload.role;

  //     localStorage.setItem("role", role);

  //     // Role check (extra safety)
  //     if (role !== selectedRole) {
  //       setMessage("Selected role does not match your account ❌");
  //       localStorage.clear();
  //       return;
  //     }

  //     setMessage("Login Successful ✅");

  //     // Redirect
  //     if (role === "ADMIN") {
  //       navigate("/admin");
  //     } else {
  //       navigate("/user");
  //     }

  //   } catch (error) {
  //     setMessage("Login failed. Check credentials ❌");
  //   }
  // };

  return (
    <div className="login-card">

      <h2 className="login-title">Inventory Login</h2>

      <form onSubmit={handleLogin}>

        {/* Role Select */}
        <select
          className="input-field"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="USER">User Login</option>
          <option value="ADMIN">Admin Login</option>
        </select>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn" >
          Login
        </button>

      </form>

      {message && <p className="error-msg">{message}</p>}

      {/* Links */}
      <p className="link-text" onClick={() => navigate("/forgot")}>
        Forgot Password?
      </p>

      <p className="link-text" onClick={() => navigate("/request-account")}>
        Request Account
      </p>

      <p className="link-text" onClick={() => navigate("/admin-signup")}>
        Admin Signup
      </p>

    </div>
  );
}

export default Login;




// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function Login() {

//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "http://localhost:9090/auth/login",
//         { username, password }
//       );

//       const result = response.data;

//       // If backend sends error message instead of token
//       if (
//         result.startsWith("Invalid") ||
//         result.startsWith("Account") ||
//         result.startsWith("Your")
//       ) {
//         setError(result);
//         return;
//       }

//       // Save token
//       localStorage.setItem("token", result);

//       // Decode JWT to get role
//       const payload = JSON.parse(atob(result.split(".")[1]));
//       localStorage.setItem("role", payload.role);

//       // Redirect based on role
//       if (payload.role === "ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/user");
//       }

//     } catch (err) {
//       setError("Login failed. Please check your credentials.");
//     }
//   };

//   return (
//     <div className="login-card">

//       <h2 className="login-title">Login</h2>

//       <form onSubmit={handleLogin}>

//         <input
//           type="text"
//           placeholder="Enter Username"
//           className="input-field"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Enter Password"
//           className="input-field"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit" className="login-btn">
//           Login
//         </button>

//       </form>

//       {error && <p className="error-msg">{error}</p>}

//       <p
//         className="link-text"
//         onClick={() => navigate("/forgot")}
//       >
//         Forgot Password?
//       </p>

//       <p
//         className="link-text"
//         onClick={() => navigate("/request-account")}
//       >
//         Request Account
//       </p>

//     </div>
//   );
// }

// export default Login;






// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function Login() {

//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {

//       const response = await axios.post(
//         "http://localhost:9090/auth/login",
//         {
//           username: username,
//           password: password
//         }
//       );

//       const token = response.data;

//       // If backend returns error string
//       if (token.startsWith("Invalid") || token.startsWith("Account") || token.startsWith("Your")) {
//         setMessage(token);
//         return;
//       }

//       // Store token
//       localStorage.setItem("token", token);

//       // Decode JWT to get role
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const role = payload.role;

//       localStorage.setItem("role", role);

//       setMessage("Login Successful");

//       // Redirect based on role
//       if (role === "ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/user");
//       }

//     } catch (error) {
//       setMessage("Login failed. Check credentials.");
//     }
//   };

//   return (
//     <div className="login-card">

//       <h2 className="login-title">Inventory Login</h2>

//       <form onSubmit={handleLogin}>

//         <input
//           type="text"
//           placeholder="Username"
//           className="input-field"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="input-field"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit" className="login-btn">
//           Login
//         </button>

//       </form>

//       {message && <p className="message">{message}</p>}

//       <p
//         className="link-text"
//         onClick={() => navigate("/forgot")}
//       >
//         Forgot Password?
//       </p>

//       <p
//         className="link-text"
//         onClick={() => navigate("/request-account")}
//       >
//         Request New Account
//       </p>

//     </div>
//   );
// }

// export default Login;




// import "./App.css";

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";


// function Login() {

//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("USER");   // 🔹 default role
//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {

//   if (!username || !password) {
//     setMessage("All fields are required ❌");
//     return;
//   }

//   try {

//     const response = await axios.post(
//       "http://localhost:9090/auth/login",
//       {
//         username,
//         password
//       }
//     );

//     const token = response.data.token;

//     if (!token || !token.includes(".")) {
//       setMessage("Invalid login response");
//       return;
//     }

//     // 🔥 Decode JWT
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const userRole = payload.role;

//     // 🔒 Check selected role matches actual role
//     if (userRole !== role) {
//       setMessage("Selected role does not match your account ❌");
//       return;
//     }

//     // ✅ Save
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", userRole);

//     // 🚀 Redirect properly
//     if (userRole === "ADMIN") {
//       navigate("/admin-dashboard");
//     } else {
//       navigate("/dashboard");
//     }

//   } catch (error) {

//     const msg =
//       error.response?.data?.error ||
//       error.response?.data ||
//       "Login failed ❌";

//     setMessage(typeof msg === "string" ? msg : "Login failed ❌");
//   }
// };

//   return (
//     <div className="login-card">
//       <h2 className="login-title">Inventra Login</h2>

//       <select
//         className="input-field"
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//       >
//         <option value="USER">User Login</option>
//         <option value="ADMIN">Admin Login</option>
//       </select>

//       <input
//   className="input-field"
//   type="text"
//   placeholder="Username"
//   onChange={(e) => {
//     setUsername(e.target.value);
//     setMessage("");   // 🔥 clear error when typing
//   }}
// />

//       <input
//   className="input-field"
//   type="password"
//   placeholder="Password"
//   onChange={(e) => {
//     setPassword(e.target.value);
//     setMessage("");   // 🔥 clear error when typing
//   }}
// />
//       <button className="login-btn" onClick={handleLogin}>
//         Login
//       </button>

//       {message && <p className="error-msg">{message}</p>}
// {/* 
//       <p className="link-text" onClick={() => navigate("/signup")}>
//         Create Account
//       </p> */}

//       <p className="link-text" onClick={() => navigate("/forgot")}>
//         Forgot Password?
//       </p>
//       <p className="link-text" onClick={() => navigate("/request-account")}>
//   Request New Account
// </p>
//       <p className="link-text" onClick={() => navigate("/admin-signup")}>
//   Create Admin Account
// </p>
//     </div>
//   );
// }

// export default Login;





// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function Login() {

//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {

//   if (!username || !password) {
//     setMessage("All fields are required ❌");
//     return;
//   }

//   try {
//     const response = await axios.post("http://localhost:9090/auth/login", {
//       username,
//       password
//     });

//     const token = response.data.token;

//     // 🔥 Check if token looks like real JWT
//     if (!token || !token.includes(".")) {
//       setMessage("Invalid Username or Password ❌");
//       return;
//     }

//     localStorage.setItem("token", token);
//     navigate("/dashboard");

//   } catch (error) {
//     setMessage("Invalid Username or Password ❌");
//   }
// };


//   return (
//     <div className="login-card">
//       <h2 className="login-title">Inventra Login</h2>

//       <input
//         className="input-field"
//         type="text"
//         placeholder="Username"
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <input
//         className="input-field"
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button className="login-btn" onClick={handleLogin}>
//         Login
//       </button>

//       <p className="message">{message}</p>

//       <p className="link-text" onClick={() => navigate("/signup")}>
//         Create Account
//       </p>

//       <p className="link-text" onClick={() => navigate("/forgot")}>
//         Forgot Password?
//       </p>
//     </div>
//   );
// }

// export default Login;

