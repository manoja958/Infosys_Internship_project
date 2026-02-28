import React from "react";

function DashboardHome({ totalUsers, lockedUsers, totalProducts }) {

  return (
    <>
      <h1>Dashboard Overview</h1>

      <div className="cards">
        <div className="card">Total Users: {totalUsers}</div>
        <div className="card">Locked Users: {lockedUsers}</div>
        <div className="card">Total Products: {totalProducts}</div>
      </div>
    </>
  );
}

export default DashboardHome;