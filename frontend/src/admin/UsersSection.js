// import React from "react";

// function UsersSection({ users }) {

//   return (
//     <>
//       <h2>User Management</h2>

//       <table>
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.length === 0 ? (
//             <tr><td colSpan="4">No Users Found</td></tr>
//           ) : (
//             users.map(u => (
//               <tr key={u.id}>
//                 <td>{u.username}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>{u.accountLocked ? "Locked" : "Active"}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </>
//   );
// }

// export default UsersSection;



import React, { useState } from "react";
import axios from "axios";

function UsersSection({ users, fetchData, token }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUser, setLoadingUser] = useState(null);

  /* ========================= */
  /* FILTER USERS */
  /* ========================= */

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ========================= */
  /* LOCK USER */
  /* ========================= */

  const handleLock = async (username) => {
    try {
      setLoadingUser(username);

      await axios.post(
        `http://localhost:9090/admin/lock?username=${username}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();

    } catch (error) {
      alert(error.response?.data || "Failed to lock user");
    } finally {
      setLoadingUser(null);
    }
  };

  /* ========================= */
  /* UNLOCK USER */
  /* ========================= */

  const handleUnlock = async (username) => {
    try {
      setLoadingUser(username);

      await axios.post(
        `http://localhost:9090/admin/unlock?username=${username}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();

    } catch (error) {
      alert(error.response?.data || "Failed to unlock user");
    } finally {
      setLoadingUser(null);
    }
  };

  /* ========================= */
  /* DELETE USER */
  /* ========================= */

  const handleDelete = async (user) => {

    if (user.role === "ADMIN") {
      alert("Admin accounts cannot be deleted ❌");
      return;
    }

    if (!window.confirm(`Delete user ${user.username}?`)) return;

    try {
      setLoadingUser(user.username);

      await axios.delete(
        `http://localhost:9090/admin/delete-user?username=${user.username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData();

    } catch (error) {
      alert(error.response?.data || "Failed to delete user");
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <div className="users-section">

      <h2>User Management</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by username or email..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5">No Users Found</td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id}>

                <td>{user.username}</td>
                <td>{user.email}</td>

                <td>
                  <span className={
                    user.role === "ADMIN"
                      ? "admin"
                      : "user"
                  }>
                    {user.role}
                  </span>
                </td>

                <td>
                  {user.accountLocked ? (
                    <span className="locked-status">Locked</span>
                  ) : (
                    <span className="active-status">Active</span>
                  )}
                </td>

                <td>

                  {user.role !== "ADMIN" && (
                    user.accountLocked ? (
                      <button
                        className="unlock-btn"
                        disabled={loadingUser === user.username}
                        onClick={() => handleUnlock(user.username)}
                      >
                        Unlock
                      </button>
                    ) : (
                      <button
                        className="lock-btn"
                        disabled={loadingUser === user.username}
                        onClick={() => handleLock(user.username)}
                      >
                        Lock
                      </button>
                    )
                  )}

                  {user.role !== "ADMIN" ? (
                    <button
                      className="delete-btn"
                      disabled={loadingUser === user.username}
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </button>
                  ) : (
                    <span className="protected-text">Protected</span>
                  )}

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersSection;
