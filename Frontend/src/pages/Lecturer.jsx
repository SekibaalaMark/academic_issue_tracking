import React, { useState } from 'react';
import { FaHome, FaBell, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Lecturer = () => {
  const [issues, setIssues] = useState([
    { id: 1, title: 'Missing marks', status: 'Pending', resolution: '' },
    { id: 2, title: 'request for appeal', status: 'Pending', resolution: '' },
    { id: 3, title: 'Corrections', status: 'In Progress', resolution: '' },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Count issues by status
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(issue => issue.status === 'Pending').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'In Progress').length;
  const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length;

  const handleResolutionChange = (id, resolution) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, resolution } : issue
      )
    );
  };

  const handleStatusUpdate = (id, newStatus) => {
    if (newStatus === 'Resolved' && !window.confirm('Are you sure you want to mark this issue as resolved?')) {
      return;
    }
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '200px' : '60px',
        background: '#004080',
        color: 'white',
        height: '100vh',
        padding: '10px',
        transition: 'width 0.3s ease',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}>
          <FaBars />
        </button>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
            <FaHome size={20} />
            {sidebarOpen && <span style={{ marginLeft: '10px' }}>Home</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
            <FaBell size={20} />
            {sidebarOpen && <span style={{ marginLeft: '10px' }}>Notifications</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
            <FaSignOutAlt size={20} />
            {sidebarOpen && <span style={{ marginLeft: '10px' }}>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarOpen ? '200px' : '60px', width: '100%', transition: 'margin-left 0.3s ease' }}>
        {/* Navigation Bar */}
        <nav style={{
          background: '#004080',
          padding: '10px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          <span><strong>Total Issues:</strong> {totalIssues}</span>
          <span><strong>Pending:</strong> {pendingIssues}</span>
          <span><strong>In Progress:</strong> {inProgressIssues}</span>
          <span><strong>Resolved:</strong> {resolvedIssues}</span>
        </nav>

        <div style={{ padding: '20px' }}>
          <header style={{ marginBottom: '20px' }}>
            <h1>Lecturer Dashboard</h1>
          </header>
          <main>
            <p>Manage course issues and student concerns.</p>
            <div style={{ marginTop: '20px' }}>
              <h2>Assigned Issues</h2>
              {issues.length > 0 ? (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Resolution</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue.id}>
                        <td>{issue.title}</td>
                        <td>
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                            style={{ padding: '5px', fontSize: '14px' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td>
                          <textarea
                            placeholder="Enter resolution..."
                            value={issue.resolution}
                            onChange={(e) => handleResolutionChange(issue.id, e.target.value)}
                            style={{ width: '100%', height: '60px' }}
                          />
                        </td>
                        <td>
                          <button
                            onClick={() => handleStatusUpdate(issue.id, 'Resolved')}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: issue.status === 'Resolved' ? 'gray' : 'green',
                              color: 'white',
                              border: 'none',
                              cursor: issue.status === 'Resolved' ? 'default' : 'pointer',
                              opacity: issue.status === 'Resolved' ? 0.6 : 1,
                            }}
                            disabled={issue.status === 'Resolved'}
                          >
                            {issue.status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No issues assigned.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Lecturer;
