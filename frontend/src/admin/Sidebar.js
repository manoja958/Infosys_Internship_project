import React from "react";

function Sidebar({ setActiveSection, logout }) {

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <p onClick={() => setActiveSection("dashboard")}>Dashboard</p>
      <p onClick={() => setActiveSection("users")}>Users</p>
      <p onClick={() => setActiveSection("products")}>Products</p>
     <p onClick={() => setActiveSection("userRequests")}>User Requests</p>
<p onClick={() => setActiveSection("stockRequests")}>Stock Requests</p>
          <p onClick={() => setActiveSection("audit")}>Audit</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Sidebar;