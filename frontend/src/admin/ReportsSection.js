import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

function ReportsSection({ token }) {

  const [productSummary, setProductSummary] = useState({});
  const [userSummary, setUserSummary] = useState({});
  const [alertSummary, setAlertSummary] = useState({});
  const [stockSummary, setStockSummary] = useState({});

  const fetchReports = async () => {
    try {

      const headers = { Authorization: `Bearer ${token}` };

      const productRes = await axios.get("http://localhost:9090/reports/product-summary", { headers });
      const userRes = await axios.get("http://localhost:9090/reports/user-summary", { headers });
      const alertRes = await axios.get("http://localhost:9090/reports/alert-summary", { headers });
      const stockRes = await axios.get("http://localhost:9090/reports/stock-request-summary", { headers });

      setProductSummary(productRes.data);
      setUserSummary(userRes.data);
      setAlertSummary(alertRes.data);
      setStockSummary(stockRes.data);

    } catch (error) {
      console.error("Error loading reports", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const productChartData = [
    { name: "Low Stock", value: productSummary.lowStock || 0 },
    { name: "Out Of Stock", value: productSummary.outOfStock || 0 }
  ];

  const alertChartData = [
    { name: "Active Alerts", value: alertSummary.activeAlerts || 0 },
    { name: "High Severity", value: alertSummary.highSeverityAlerts || 0 }
  ];

  const COLORS = ["#ff9800", "#f44336"];

  return (
    <div>

      <h2>Reports & Analytics</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

        <div className="card">
          <h3>Total Products</h3>
          <p>{productSummary.totalProducts || 0}</p>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <p>{userSummary.totalUsers || 0}</p>
        </div>

        <div className="card">
          <h3>Active Alerts</h3>
          <p>{alertSummary.activeAlerts || 0}</p>
        </div>

        <div className="card">
          <h3>Pending Requests</h3>
          <p>{stockSummary.pendingRequests || 0}</p>
        </div>

      </div>

      {/* ===== BAR CHART ===== */}
      <div style={{ width: "100%", height: 300 }}>
        <h3>Product Stock Overview</h3>

        <ResponsiveContainer>
          <BarChart data={productChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== PIE CHART ===== */}
      <div style={{ width: "100%", height: 300, marginTop: "40px" }}>
        <h3>Alert Overview</h3>

        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={alertChartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {alertChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default ReportsSection;