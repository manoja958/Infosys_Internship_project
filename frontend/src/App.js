

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AdminSignup from "./AdminSignup";
import UserRequest from "./UserRequest";

import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";

/* ======================================
   PRIVATE ROUTE (CHECK TOKEN)
====================================== */

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

/* ======================================
   ADMIN ROUTE (CHECK ROLE)
====================================== */

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return token && role === "ADMIN"
    ? children
    : <Navigate to="/" />;
}

/* ======================================
   USER ROUTE (CHECK ROLE)
====================================== */

function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return token && role === "USER"
    ? children
    : <Navigate to="/" />;
}

/* ======================================
   APP ROUTER
====================================== */

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/request-account" element={<UserRequest />} />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* User Protected */}
        <Route
          path="/user"
          element={
            <UserRoute>
              <UserDashboard />
            </UserRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./Login";
// import ForgotPassword from "./ForgotPassword";
// import Dashboard from "./Dashboard";
// import AdminDashboard from "./admin/AdminDashboard";
// import AdminSignup from "./AdminSignup";
// import UserRequest from "./UserRequest";
// import UserDashboard from "./user/UserDashboard";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/" />;
// }

// function AdminRoute({ children }) {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   return token && role === "ADMIN"
//     ? children
//     : <Navigate to="/" />;
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//        <Route path="/admin" element={<AdminDashboard />} />
// <Route path="/user" element={<UserDashboard />} />
//         <Route path="/" element={<Login />} />
//         <Route path="/forgot" element={<ForgotPassword />} />

//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/admin-dashboard"
//           element={
//             <AdminRoute>
//               <AdminDashboard />
//             </AdminRoute>
//           }
//         />
//        <Route path="/admin-signup"
//         element={<AdminSignup />} />
//         <Route path="/request-account" element={<UserRequest />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
