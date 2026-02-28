import React, { useState } from "react";
import RequestStockSection from "./RequestStockSection";
import MyRequestsSection from "./MyRequestsSection";
import { useNavigate } from "react-router-dom";

function UserDashboard() {

  const [active, setActive] = useState("request");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-layout">

      <div className="sidebar">
        <h2>User Panel</h2>
        <p onClick={() => setActive("request")}>Request Stock</p>
        <p onClick={() => setActive("history")}>My Requests</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="main-content">
        {active === "request" && <RequestStockSection />}
        {active === "history" && <MyRequestsSection />}
      </div>

    </div>
  );
}

export default UserDashboard;