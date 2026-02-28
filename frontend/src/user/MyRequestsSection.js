import React, { useState, useEffect } from "react";
import axios from "axios";

function MyRequestsSection() {

  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9090/product/my-requests", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRequests(res.data));
  }, []);

  return (
    <>
      <h2>My Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.productName}</td>
              <td>{r.quantity}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default MyRequestsSection;