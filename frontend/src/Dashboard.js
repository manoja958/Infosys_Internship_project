import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Dashboard() {

  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    setRole(decoded.role);
    setUsername(decoded.sub);

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome {username}</h2>
      <p>Role: {role}</p>

      {role === "ADMIN" && (
        <button onClick={() => navigate("/admin-dashboard")}>
          Go To Admin Panel
        </button>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
// import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function Dashboard() {

//   const navigate = useNavigate();
//   const [role, setRole] = useState("");
//   const [username, setUsername] = useState("");

//   useEffect(() => {

//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/");
//       return;
//     }

//     const decoded = jwtDecode(token);
//     setRole(decoded.role);
//     setUsername(decoded.sub);

//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div className="dashboard-container">

//       <h2>Welcome {username} ({role})</h2>

//       {role === "ADMIN" && (
//         <div>
//           <button onClick={() => navigate("/admin")}>
//             Go To Admin Panel
//           </button>
//         </div>
//       )}

//       <button onClick={handleLogout}>Logout</button>

//     </div>
//   );
// }

// export default Dashboard;
