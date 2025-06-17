import React, { useState } from "react";
import "./App.css";


const logs = [
  
  "auth",
  "config",
  "session",
  "parameters",
  "polygon",
  "users",
  "calculations",
  "data",
  "data-updateData"
];

function LogViewer() {
  const [showLogs, setShowLogs] = useState(false);

  const toggleLogs = () => setShowLogs(!showLogs);

  return (
    <div className="log-container">
      <button className="log-button" onClick={toggleLogs}>
        Logs
      </button>

      {showLogs && (
        <div className="log-list">
          {logs.map((log, index) => (
            <div key={index} className="log-item">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LogViewer;
