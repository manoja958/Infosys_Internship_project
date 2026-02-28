import React from "react";

function UserRequestsSection({ requests, approve, reject }) {

  return (
    <>
      <h2>Pending User Account Requests</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="4">No Pending Requests</td>
            </tr>
          ) : (
            requests.map(r => (
              <tr key={r.id}>
                <td>{r.username}</td>
                <td>{r.email}</td>
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

export default UserRequestsSection;