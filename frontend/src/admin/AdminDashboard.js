
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "./Sidebar";
import DashboardHome from "./DashBoardHome";
import UsersSection from "./UsersSection";
import ProductsSection from "./ProductsSection";
import UserRequestsSection from "./UserRequestsSection";
import StockRequestsSection from "./StockRequestsSection";
import AuditSection from "./AuditSection";

function AdminDashboard() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [lockedUsers, setLockedUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  /* ========================= */
  /* FETCH DATA */
  /* ========================= */

  const fetchData = useCallback(async () => {
    try {

      const headers = { Authorization: `Bearer ${token}` };

      const usersRes = await axios.get("http://localhost:9090/admin/all-users", { headers });
      const totalRes = await axios.get("http://localhost:9090/admin/total-users", { headers });
      const lockedRes = await axios.get("http://localhost:9090/admin/locked-users", { headers });

      const userReqRes = await axios.get("http://localhost:9090/admin/pending-requests", { headers });
      const stockReqRes = await axios.get("http://localhost:9090/product/pending-requests", { headers });

      const auditRes = await axios.get("http://localhost:9090/admin/audit-logs", { headers });
      const productRes = await axios.get("http://localhost:9090/product/all", { headers });

      setUsers(usersRes.data);
      setProducts(productRes.data);
      setUserRequests(userReqRes.data);
      setStockRequests(stockReqRes.data);
      setAuditLogs(auditRes.data);

      setTotalUsers(totalRes.data.totalUsers);
      setLockedUsers(lockedRes.data.lockedUsers);
      setTotalProducts(productRes.data.length);

    } catch (error) {
      alert("Access Denied ❌");
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) navigate("/");
    else fetchData();
  }, [token, navigate, fetchData]);

  /* ========================= */
  /* USER ACCOUNT REQUEST ACTIONS */
  /* ========================= */

  const approveUser = async (id) => {
    await axios.post(
      `http://localhost:9090/admin/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };

  const rejectUser = async (id) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    await axios.post(
      `http://localhost:9090/admin/reject/${id}?reason=${reason}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };

  /* ========================= */
  /* STOCK REQUEST ACTIONS */
  /* ========================= */

  const approveStock = async (id) => {
    await axios.post(
      `http://localhost:9090/product/approve-stock/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };

  const rejectStock = async (id) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;

    await axios.post(
      `http://localhost:9090/product/reject-stock/${id}?reason=${reason}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchData();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-layout">

      <Sidebar setActiveSection={setActiveSection} logout={logout} />

      <div className="main-content">

        {activeSection === "dashboard" &&
          <DashboardHome
            totalUsers={totalUsers}
            lockedUsers={lockedUsers}
            totalProducts={totalProducts}
          />
        }

        {activeSection === "users" &&
          <UsersSection users={users} fetchData={fetchData} token={token} />
        }

        {activeSection === "products" &&
          <ProductsSection products={products} fetchData={fetchData} token={token} />
        }

        {activeSection === "userRequests" &&
          <UserRequestsSection
            requests={userRequests}
            approve={approveUser}
            reject={rejectUser}
          />
        }

        {activeSection === "stockRequests" &&
          <StockRequestsSection
            requests={stockRequests}
            approve={approveStock}
            reject={rejectStock}
          />
        }

        {activeSection === "audit" &&
          <AuditSection auditLogs={auditLogs} />
        }

      </div>
    </div>
  );
}

export default AdminDashboard;


// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import ProductsSection from "./ProductsSection";
// import Sidebar from "./Sidebar";
// import DashboardHome from "./DashBoardHome";
// import UsersSection from "./UsersSection";
// import RequestsSection from "./RequestsSection";
// import AuditSection from "./AuditSection";

// function AdminDashboard() {

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [products, setProducts] = useState([]);
//   const [activeSection, setActiveSection] = useState("dashboard");

//   const [users, setUsers] = useState([]);
//   //const [requests, setRequests] = useState([]);
//   const [userRequests, setUserRequests] = useState([]);
// const [stockRequests, setStockRequests] = useState([]);
//   const [auditLogs, setAuditLogs] = useState([]);

//   const [totalUsers, setTotalUsers] = useState(0);
//   const [lockedUsers, setLockedUsers] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);

//   /* ============================= */
//   /* FETCH DATA */
//   /* ============================= */

//   const fetchData = useCallback(async () => {
//     try {
//       const headers = { Authorization: `Bearer ${token}` };

//       const usersRes = await axios.get("http://localhost:9090/admin/all-users", { headers });
//       const totalRes = await axios.get("http://localhost:9090/admin/total-users", { headers });
//       const lockedRes = await axios.get("http://localhost:9090/admin/locked-users", { headers });
//     // const requestRes = await axios.get("http://localhost:9090/admin/pending-requests", { headers });
//       const auditRes = await axios.get("http://localhost:9090/admin/audit-logs", { headers });
//       const productRes = await axios.get("http://localhost:9090/product/all", { headers });
// // User account requests
// const userReqRes = await axios.get(
//   "http://localhost:9090/admin/pending-requests",
//   { headers }
// );

// // Stock requests
// const stockReqRes = await axios.get(
//   "http://localhost:9090/product/pending-requests",
//   { headers }
// );

// setUserRequests(userReqRes.data);
// setStockRequests(stockReqRes.data);
//       // const stockReqRes = await axios.get(
// //   "http://localhost:9090/product/pending-requests",
// //   { headers }
// // );

// setRequests(stockReqRes.data);
//       setUsers(usersRes.data);
//       setRequests(requestRes.data);
//       setAuditLogs(auditRes.data);
//       setProducts(productRes.data);

//       setTotalUsers(totalRes.data.totalUsers);
//       setLockedUsers(lockedRes.data.lockedUsers);
//       setTotalProducts(productRes.data.length);

//     } catch (error) {
//       alert("Access Denied");
//       navigate("/");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     } else {
//       fetchData();
//     }
//   }, [token, navigate, fetchData]);

//   /* ============================= */
//   /* REQUEST ACTIONS */
//   /* ============================= */
// // const approve = async (id) => {
// //   const token = localStorage.getItem("token");

// //   await axios.post(
// //     `http://localhost:9090/admin/approve/${id}`,
// //     {},
// //     {
// //       headers: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     }
// //   );

// //   fetchData();
// // };
// // const reject = async (id) => {
// //   const token = localStorage.getItem("token");

// //   const reason = prompt("Enter rejection reason");
// //   if (!reason) return;

// //   await axios.post(
// //     `http://localhost:9090/admin/reject/${id}?reason=${reason}`,
// //     {},
// //     {
// //       headers: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     }
// //   );

// //   fetchData();
// // };


// const approveUser = async (id) => {
//   await axios.post(
//     `http://localhost:9090/admin/approve/${id}`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   fetchData();
// };

// const rejectUser = async (id) => {
//   const reason = prompt("Reason?");
//   if (!reason) return;

//   await axios.post(
//     `http://localhost:9090/admin/reject/${id}?reason=${reason}`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   fetchData();
// };

// const approveStock = async (id) => {
//   await axios.post(
//     `http://localhost:9090/product/approve-stock/${id}`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   fetchData();
// };

// const rejectStock = async (id) => {
//   const reason = prompt("Reason?");
//   if (!reason) return;

//   await axios.post(
//     `http://localhost:9090/product/reject-stock/${id}?reason=${reason}`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   fetchData();
// };


//   // const approve = async (id) => {
//   //   await axios.post(
//   //     `http://localhost:9090/admin/approve/${id}`,
//   //     {},
//   //     { headers: { Authorization: `Bearer ${token}` } }
//   //   );
//   //   fetchData();
//   // };

//   // const reject = async (id) => {
//   //   const reason = prompt("Enter rejection reason");
//   //   if (!reason) return;

//   //   await axios.post(
//   //     `http://localhost:9090/admin/reject/${id}?reason=${reason}`,
//   //     {},
//   //     { headers: { Authorization: `Bearer ${token}` } }
//   //   );

//   //   fetchData();
//   // };

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="admin-layout">

//       <Sidebar setActiveSection={setActiveSection} logout={logout} />

//       <div className="main-content">

//         {activeSection === "dashboard" &&
//           <DashboardHome
//             totalUsers={totalUsers}
//             lockedUsers={lockedUsers}
//             totalProducts={totalProducts}
//           />
//         }

//         {activeSection === "users" &&
//   <UsersSection
//     users={users}
//     fetchData={fetchData}
//     token={token}
//   />
// }

//         {activeSection === "products" &&
//           <ProductsSection
//             products={products}
//             fetchData={fetchData}
//             token={token}
//           />
//         }

//         {activeSection === "userRequests" &&
//   <RequestsSection
//     requests={userRequests}
//     approve={approveUser}
//     reject={rejectUser}
//   />
// }

// {activeSection === "stockRequests" &&
//   <StockRequestsSection
//     requests={stockRequests}
//     approve={approveStock}
//     reject={rejectStock}
//   />
// }

//         {activeSection === "audit" &&
//           <AuditSection auditLogs={auditLogs} />
//         }

//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;












// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import "./App.css";
// import { useNavigate } from "react-router-dom";

// function AdminDashboard() {

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [activeSection, setActiveSection] = useState("dashboard");

//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [auditLogs, setAuditLogs] = useState([]);

//   const [totalUsers, setTotalUsers] = useState(0);
//   const [lockedUsers, setLockedUsers] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [showLowStock, setShowLowStock] = useState(false);

//   const [newProduct, setNewProduct] = useState({
//     sku: "",
//     name: "",
//     category: "",
//     supplier: "",
//     unitPrice: "",
//     stockQuantity: "",
//     minStockLevel: ""
//   });

//   const [editingProduct, setEditingProduct] = useState(null);

//   /* ============================= */
//   /* FETCH DATA (useCallback FIX)  */
//   /* ============================= */

//   const fetchData = useCallback(async () => {
//     try {

//       const headers = { Authorization: `Bearer ${token}` };

//       const usersRes = await axios.get("http://localhost:9090/admin/all-users", { headers });
//       const totalRes = await axios.get("http://localhost:9090/admin/total-users", { headers });
//       const lockedRes = await axios.get("http://localhost:9090/admin/locked-users", { headers });
//       const productRes = await axios.get("http://localhost:9090/product/all", { headers });
//       const requestRes = await axios.get("http://localhost:9090/admin/pending-requests", { headers });
//       const auditRes = await axios.get("http://localhost:9090/admin/audit-logs", { headers });

//       setUsers(usersRes.data);
//       setTotalUsers(totalRes.data.totalUsers);
//       setLockedUsers(lockedRes.data.lockedUsers);
//       setProducts(productRes.data);
//       setRequests(requestRes.data);
//       setAuditLogs(auditRes.data);
//       setTotalProducts(productRes.data.length);

//     } catch (err) {
//       alert("Access Denied");
//       navigate("/");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     } else {
//       fetchData();
//     }
//   }, [token, navigate, fetchData]);

//   /* ============================= */
//   /* PRODUCT ACTIONS               */
//   /* ============================= */

//   const handleAddProduct = async () => {

//     if (!newProduct.sku || !newProduct.name) {
//       alert("SKU and Name are required");
//       return;
//     }

//     await axios.post(
//       "http://localhost:9090/product/add",
//       {
//         ...newProduct,
//         unitPrice: Number(newProduct.unitPrice),
//         stockQuantity: Number(newProduct.stockQuantity),
//         minStockLevel: Number(newProduct.minStockLevel)
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setNewProduct({
//       sku: "",
//       name: "",
//       category: "",
//       supplier: "",
//       unitPrice: "",
//       stockQuantity: "",
//       minStockLevel: ""
//     });

//     fetchData();
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm("Delete this product?")) return;

//     await axios.delete(
//       `http://localhost:9090/product/delete/${id}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchData();
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//   };

//   const handleUpdateProduct = async () => {

//     await axios.put(
//       `http://localhost:9090/product/update/${editingProduct.productId}`,
//       editingProduct,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setEditingProduct(null);
//     fetchData();
//   };

//   const handleStockIn = async (id) => {
//     const qty = prompt("Enter quantity to add");
//     if (!qty || isNaN(qty)) return;

//     await axios.post(
//       `http://localhost:9090/product/stock-in?id=${id}&quantity=${qty}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchData();
//   };

//   const handleStockOut = async (id) => {
//     const qty = prompt("Enter quantity to remove");
//     if (!qty || isNaN(qty)) return;

//     await axios.post(
//       `http://localhost:9090/product/stock-out?id=${id}&quantity=${qty}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchData();
//   };

//   /* ============================= */
//   /* FILTER LOGIC                  */
//   /* ============================= */

//   let filteredProducts = products.filter(p =>
//     p.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (filterCategory) {
//     filteredProducts = filteredProducts.filter(
//       p => p.category?.toLowerCase().includes(filterCategory.toLowerCase())
//     );
//   }

//   if (showLowStock) {
//     filteredProducts = filteredProducts.filter(
//       p => p.stockQuantity <= p.minStockLevel
//     );
//   }

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="admin-layout">

//       <div className="sidebar">
//         <h2>Admin Panel</h2>
//         <p onClick={() => setActiveSection("dashboard")}>Dashboard</p>
//         <p onClick={() => setActiveSection("users")}>Users</p>
//         <p onClick={() => setActiveSection("products")}>Products</p>
//         <p onClick={() => setActiveSection("requests")}>Requests</p>
//         <p onClick={() => setActiveSection("audit")}>Audit</p>
//         <button onClick={logout}>Logout</button>
//       </div>

//       <div className="main-content">

//         {activeSection === "dashboard" && (
//           <>
//             <h1>Dashboard Overview</h1>
//             <div className="cards">
//               <div className="card">Total Users: {totalUsers}</div>
//               <div className="card">Locked Users: {lockedUsers}</div>
//               <div className="card">Total Products: {totalProducts}</div>
//             </div>
//           </>
//         )}

//         {activeSection === "products" && (
//           <>
//             <h2>Product Inventory</h2>

//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="input-field"
//             />

//             <table>
//               <thead>
//                 <tr>
//                   <th>SKU</th>
//                   <th>Name</th>
//                   <th>Price</th>
//                   <th>Stock</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredProducts.map((product) => (
//                   <tr key={product.productId}>
//                     <td>{product.sku}</td>
//                     <td>{product.name}</td>
//                     <td>₹ {product.unitPrice}</td>
//                     <td>{product.stockQuantity}</td>
//                     <td>
//                       {product.stockQuantity <= product.minStockLevel ?
//                         <span className="low-stock">Low</span> :
//                         <span className="in-stock">OK</span>}
//                     </td>
//                     <td>
//                       <button onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </>
//         )}

//       </div>
//     </div>
//   );
// }
















// export default AdminDashboard;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./App.css";

// function AdminDashboard() {

//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [requests, setRequests] = useState([]);

//   const [totalUsers, setTotalUsers] = useState(0);
//   const [lockedUsers, setLockedUsers] = useState(0);
//   const [totalProducts, setTotalProducts] = useState(0);

//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   // ================================
//   // LOAD DASHBOARD DATA
//   // ================================
//   useEffect(() => {

//     if (!token) {
//       navigate("/");
//       return;
//     }

//     fetchDashboard();

//   }, [token]);

//   const fetchDashboard = async () => {

//     try {

//       setLoading(true);

//       const totalRes = await axios.get(
//         "http://localhost:9090/admin/total-users",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const lockedRes = await axios.get(
//         "http://localhost:9090/admin/locked-users",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const usersRes = await axios.get(
//         "http://localhost:9090/admin/all-users",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const productRes = await axios.get(
//         "http://localhost:9090/product/all",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const requestRes = await axios.get(
//         "http://localhost:9090/admin/pending-requests",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setTotalUsers(totalRes.data.totalUsers);
//       setLockedUsers(lockedRes.data.lockedUsers);
//       setUsers(usersRes.data);
//       setProducts(productRes.data);
//       setRequests(requestRes.data);

//       setTotalProducts(productRes.data.length);

//     } catch (error) {
//       alert("Access denied. Admin only.");
//       navigate("/");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================
//   // USER MANAGEMENT
//   // ================================
//   const handleUnlock = async (username) => {

//     await axios.post(
//       `http://localhost:9090/admin/unlock?username=${username}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchDashboard();
//   };

//   const handleDelete = async (username) => {

//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete ${username}?`
//     );

//     if (!confirmDelete) return;

//     await axios.delete(
//       `http://localhost:9090/admin/delete-user?username=${username}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchDashboard();
//   };

//   // ================================
//   // REQUEST APPROVAL
//   // ================================
//   const approveRequest = async (id) => {

//     await axios.post(
//       `http://localhost:9090/admin/approve/${id}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchDashboard();
//   };

//   const rejectRequest = async (id) => {

//     const reason = prompt("Enter rejection reason:");

//     if (!reason) return;

//     await axios.post(
//       `http://localhost:9090/admin/reject/${id}?reason=${reason}`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     fetchDashboard();
//   };

//   // ================================
//   // LOGOUT
//   // ================================
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   if (loading) {
//     return <h2 style={{ textAlign: "center" }}>Loading Dashboard...</h2>;
//   }

//   return (
//     <div className="admin-container">

//       <h2>Admin Dashboard</h2>

//       {/* ================= CARDS ================= */}
//       <div className="card-container">
//         <div className="card">Total Users: {totalUsers}</div>
//         <div className="card">Locked Users: {lockedUsers}</div>
//         <div className="card">Total Products: {totalProducts}</div>
//       </div>

//       {/* ================= USERS TABLE ================= */}
//       <h3>User List</h3>

//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>{user.role}</td>
//               <td>{user.accountLocked ? "Locked" : "Active"}</td>
//               <td>
//                 {user.accountLocked && (
//                   <button onClick={() => handleUnlock(user.username)}>
//                     Unlock
//                   </button>
//                 )}
//                 <button onClick={() => handleDelete(user.username)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ================= PRODUCTS TABLE ================= */}
//       <h3>Product List</h3>

//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>SKU</th>
//             <th>Name</th>
//             <th>Price</th>
//             <th>Stock</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {products.map((product) => (
//             <tr key={product.productId}>
//               <td>{product.sku}</td>
//               <td>{product.name}</td>
//               <td>₹ {product.unitPrice}</td>
//               <td>{product.stockQuantity}</td>
//               <td>
//                 {product.stockQuantity <= product.minStockLevel ? (
//                   <span className="low-stock">Low Stock 🔴</span>
//                 ) : (
//                   <span className="in-stock">In Stock 🟢</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ================= USER REQUESTS ================= */}
//       <h3>Pending User Requests</h3>

//       <table className="user-table">
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {requests.length === 0 ? (
//             <tr>
//               <td colSpan="4">No Pending Requests</td>
//             </tr>
//           ) : (
//             requests.map((req) => (
//               <tr key={req.id}>
//                 <td>{req.username}</td>
//                 <td>{req.email}</td>
//                 <td>{req.status}</td>
//                 <td>
//                   <button onClick={() => approveRequest(req.id)}>
//                     Approve
//                   </button>
//                   <button onClick={() => rejectRequest(req.id)}>
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>

//     </div>
//   );
// }

// export default AdminDashboard;
