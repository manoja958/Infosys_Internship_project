// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Signup() {

//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "USER"
//   });

//   const handleChange = (e) => {
//     setForm({...form, [e.target.name]: e.target.value});
//   };

//   const handleSignup = async () => {
//     try {
//   const response = await axios.post(
//     "http://localhost:9090/auth/signup",
//     { username, email, password, role }
//   );

//   setMessage(response.data);

// } catch (error) {
//   setMessage(error.response.data);
// }

//     // try {
//     //   await axios.post("http://localhost:9090/auth/signup", form);
//     //   alert("Signup successful!");
//     //   navigate("/");
//     // } catch {
//     //   alert("Signup failed!");
//     // }
//   };

//   return (
//     <div className="login-card">
//       <h2>Create Account</h2>

//       <input className="input-field" name="username" placeholder="Username" onChange={handleChange}/>
//       <input className="input-field" name="email" placeholder="Email" onChange={handleChange}/>
//       <input className="input-field" name="password" type="password" placeholder="Password" onChange={handleChange}/>

//       <select className="input-field" name="role" onChange={handleChange}>
//         <option value="USER">User</option>
//         <option value="ADMIN">Admin</option>
//       </select>

//       <button className="login-btn" onClick={handleSignup}>Signup</button>

//       <p onClick={() => navigate("/")}>Back to Login</p>
//     </div>
//   );
// }

// export default Signup;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9090/auth/signup",
        { username, email, password, role }
      );

      setMessage(response.data);

      if (response.data === "Signup successful") {
        setTimeout(() => navigate("/"), 1500);
      }

    } catch (error) {
      setMessage(error.response?.data || "Signup failed");
    }
  };

  return (
    <div className="login-card">
      
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input-field"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="input-field"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button className="login-btn" onClick={handleSignup}>
        Sign Up
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <p onClick={() => navigate("/")}>Back to Login</p>
    </div>
  );
}

export default Signup;
