
import React, { useEffect, useState } from 'react';

import { axiosInstance } from "../axios";


const logRules = [
    { keywords: ['/api/login', '/logout', '/change-password', '/send-password-reset-link', '/auth'], file: 'auth' },
    { keywords: ['/get-all-configurations', '/get-configuration', '/update-configuration'], file: 'config' },
    { keywords: ['/check-if-session-is-valid'], file: 'session' },
    { keywords: ['/get-all-parameters', '/get-polygon-parameters', '/add-parameter', '/update-parameter', '/delete-selected-parameters', '/get-unique-values-for-string-parameters'], file: 'parameters' },
    { keywords: ['/get-all-polygons', '/get-allowed-polygons-for-user', '/update-polygon-access'], file: 'polygon' },
    { keywords: ['/get-all-users', '/get-user-email-and-status', '/add-user', '/update-user-profile', '/update-user', '/delete-selected-users'], file: 'users' },
    { keywords: ['/monte-carlo-simulation'], file: 'calculations' },
    { keywords: ['/update-data'], file: 'point-data' },
    { keywords: ['/get-all-point-data'], file: 'data-update' },
];

export default function LogViewer() {
    const [logs, setLogs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    useEffect(() => {
         axiosInstance.get('/api/read-log')
            .then(res => {
                setLogs(res.data.logs || []);
            })
            .catch(err => console.error('Error fetching logs:', err));
    }, [selectedFile]);

    useEffect(() => {
        if (selectedFile === 'all') {
            setFilteredLogs(logs);
            return;
        }

        if (!selectedFile) {
            setFilteredLogs([]);
            return;
        }

        const rule = logRules.find(r => r.file === selectedFile);
        if (!rule) {
            setFilteredLogs([]);
            return;
        }

        const keywords = rule.keywords;
        const filtered = logs.filter(log =>
            keywords.some(kw => log.route?.includes(kw))
        );

        setFilteredLogs(filtered);
    }, [selectedFile, logs]);

    return (
        <div style={{ display: 'flex', padding: '20px' }}>
            {/* Sidebar */}
            <div style={{ width: '200px', marginRight: '20px' }}>
                <h3
                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                    Logs {sidebarExpanded ? '▲' : '▼'}
                </h3>

                {sidebarExpanded && (
                    <>
                        <button
                            onClick={() => setSelectedFile('all')}
                            style={{
                                display: 'block',
                                marginBottom: '10px',
                                padding: '10px',
                                width: '100%',
                                backgroundColor: selectedFile === 'all' ? '#007BFF' : '#eee',
                                color: selectedFile === 'all' ? '#fff' : '#000',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            all
                        </button>

                        {logRules.map(rule => (
                            <button
                                key={rule.file}
                                style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    width: '100%',
                                    backgroundColor: selectedFile === rule.file ? '#007BFF' : '#eee',
                                    color: selectedFile === rule.file ? '#fff' : '#000',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedFile(rule.file)}
                            >
                                {rule.file}
                            </button>
                        ))}
                    </>
                )}
            </div>

            {/* Logs Display */}
            <div
                style={{
                    flex: 1,
                    height: '90vh',
                    overflowY: 'auto',
                    backgroundColor: '#000',
                    color: '#fff',
                    fontFamily: 'monospace',
                    padding: '15px',
                    borderRadius: '8px',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {!selectedFile && (
                    <h2 style={{ textAlign: 'center' }}>Welcome to log dashboard</h2>
                )}

                {selectedFile && filteredLogs.length === 0 ? (
                    <p>No logs available for this category.</p>
                ) : (
                    filteredLogs.map((log, idx) => (
                        <div
                            key={idx}
                            style={{
                                borderBottom: '1px solid #444',
                                paddingBottom: '5px',
                                marginBottom: '10px',
                            }}
                        >
                            [{new Date(log.timestamp).toLocaleString()}] {log.message} | Route: {log.route || 'N/A'}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
