import React from "react";

function StockRequestsSection({ requests, approve, reject }) {

  return (
    <>
      <h2>Pending Stock Requests</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Requested By</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5">No Pending Stock Requests</td>
            </tr>
          ) : (
            requests.map(r => (
              <tr key={r.id}>
                <td>{r.productName}</td>
                <td>{r.requestedBy}</td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>
                <td>
                  <button onClick={() => approve(r.id)}>Approve</button>
                  <button onClick={() => reject(r.id)}>Reject</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default StockRequestsSection;