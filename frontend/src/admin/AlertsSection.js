import React, { useEffect, useState } from "react";
import axios from "axios";

function AlertsSection({ token }) {

  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `http://localhost:9090/alerts/filter?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAlerts(response.data);

    } catch (error) {

      console.error("Error fetching alerts", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    if (token) {
      fetchAlerts();
    }
  }, [filter, token]);



  const resolveAlert = async (id) => {

    try {

      await axios.post(
        `http://localhost:9090/alerts/resolve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchAlerts();

    } catch (error) {

      console.error("Error resolving alert", error);

    }
  };



  return (

    <div>

      <h2>Inventory Alerts</h2>

      <div style={{ marginBottom: "15px" }}>

        <select
          className="search-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ACTIVE">Active Alerts</option>
          <option value="RESOLVED">Resolved Alerts</option>
        </select>

      </div>


      {loading ? (

        <p>Loading alerts...</p>

      ) : (

        <table border="1" width="100%" cellPadding="8">

          <thead>
            <tr>
              <th>Product ID</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {alerts.length === 0 ? (

              <tr>
                <td colSpan="6">No Alerts Found</td>
              </tr>

            ) : (

              alerts.map(alert => (

                <tr key={alert.alertId}>

                  <td>{alert.productId}</td>

                  <td>{alert.alertType}</td>

                  <td
                    style={{
                      color: alert.severity === "HIGH" ? "red" : "orange",
                      fontWeight: "bold"
                    }}
                  >
                    {alert.severity}
                  </td>

                  <td>{alert.message}</td>

                  <td>{alert.status}</td>

                  <td>

                    {alert.status === "ACTIVE" && (

                      <button
                        onClick={() => resolveAlert(alert.alertId)}
                      >
                        Resolve
                      </button>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      )}

    </div>

  );
}

export default AlertsSection;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function AlertsSection({ token }) {

//   const [alerts, setAlerts] = useState([]);
//   const [filter, setFilter] = useState("ACTIVE");

//   const fetchAlerts = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:9090/alerts/filter?status=${filter}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       setAlerts(response.data);

//     } catch (error) {
//       console.error("Error fetching alerts", error);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, [filter]);

//   const resolveAlert = async (id) => {
//     try {
//       await axios.post(
//         `http://localhost:9090/alerts/resolve/${id}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       fetchAlerts();

//     } catch (error) {
//       console.error("Error resolving alert", error);
//     }
//   };

//   return (
//     <div>

//       <h2>Inventory Alerts</h2>

//       <div style={{ marginBottom: "15px" }}>
//         <select
//         className="search-input"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="ACTIVE">Active Alerts</option>
//           <option value="RESOLVED">Resolved Alerts</option>
//         </select>
//       </div>

//       <table border="1" width="100%" cellPadding="8">

//         <thead>
//           <tr>
//             <th>Product ID</th>
//             <th>Type</th>
//             <th>Severity</th>
//             <th>Message</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {alerts.length === 0 ? (
//             <tr>
//               <td colSpan="6">No Alerts Found</td>
//             </tr>
//           ) : (
//             alerts.map(alert => (
//               <tr key={alert.alertId}>
//                 <td>{alert.productId}</td>
//                 <td>{alert.alertType}</td>
//                 <td
//                   style={{
//                     color: alert.severity === "HIGH" ? "red" : "orange",
//                     fontWeight: "bold"
//                   }}
//                 >
//                   {alert.severity}
//                 </td>
//                 <td>{alert.message}</td>
//                 <td>{alert.status}</td>
//                 <td>
//                   {alert.status === "ACTIVE" && (
//                     <button
//                       onClick={() => resolveAlert(alert.alertId)}
//                     >
//                       Resolve
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>

//       </table>

//     </div>
//   );
// }

// export default AlertsSection;