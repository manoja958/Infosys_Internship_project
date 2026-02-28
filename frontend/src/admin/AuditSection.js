import React from "react";

function AuditSection({ auditLogs }) {

  return (
    <>
      <h2>Audit Logs</h2>

      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Performed By</th>
            <th>Target</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {auditLogs.length === 0 ? (
            <tr><td colSpan="4">No Audit Records</td></tr>
          ) : (
            auditLogs.map(log => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.performedBy}</td>
                <td>{log.target}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default AuditSection;