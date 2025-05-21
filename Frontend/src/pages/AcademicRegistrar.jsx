import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./AcademicRegistrar.css";

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const PageTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;

  .label {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .value {
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: 500;
  }

  select, input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f7f9fc;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary && `
    background-color: #3498db;
    color: white;
    
    &:hover {
      background-color: #2980b9;
    }
  `}

  ${props => props.danger && `
    background-color: #e74c3c;
    color: white;
    
    &:hover {
      background-color: #c0392b;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;

  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background-color: #fff3cd; color: #856404;';
      case 'in progress':
        return 'background-color: #cce5ff; color: #004085;';
      case 'resolved':
        return 'background-color: #d4edda; color: #155724;';
      default:
        return 'background-color: #f8f9fa; color: #383d41;';
    }
  }}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem;
  
  button {
    min-width: 40px;
  }
`;

const LogoutButton = styled(ActionButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #e74c3c;
  color: white;
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
  border-radius: 4px;
  min-width: auto;
  
  &:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }

  &:active {
    transform: translateY(0);
  }
`;

// API Endpoints
const ENDPOINTS = {
  issues: "https://academic-issue-tracking-now.onrender.com/api/registrar-issues-management/",
  lecturers: "https://academic-issue-tracking-now.onrender.com/api/lecturers/usernames/",
  users: "https://academic-issue-tracking-now.onrender.com/api/users/",
  assign: "https://academic-issue-tracking-now.onrender.com/api/assignlecturer/",
  resolve: "https://academic-issue-tracking-now.onrender.com/api/resolve-issue/",
};

const AcademicRegistrar = () => {
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssigning, setIsAssigning] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLecturer, setFilterLecturer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const createAuthAxios = () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("authToken");
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  };

  const fetchIssues = async () => {
    const authAxios = createAuthAxios();
    try {
      const issuesResponse = await authAxios.get(ENDPOINTS.issues);
      const issuesData = Array.isArray(issuesResponse.data) ? issuesResponse.data : [];
      localStorage.setItem("cachedIssues", JSON.stringify(issuesData));
      setIssues(issuesData);
      return issuesData;
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  };

  const fetchLecturers = async () => {
    const authAxios = createAuthAxios();
    try {
      const lecturersResponse = await authAxios.get(ENDPOINTS.lecturers);
      if (Array.isArray(lecturersResponse.data) && lecturersResponse.data.length > 0) {
        const formattedLecturers = lecturersResponse.data.map((lecturer) => ({
          id: lecturer.id || Math.random().toString(36).substr(2, 9),
          name: lecturer.first_name && lecturer.last_name
            ? `${lecturer.first_name} ${lecturer.last_name}`
            : lecturer.username || "Unknown",
          username: lecturer.username || "",
        }));
        localStorage.setItem("cachedLecturers", JSON.stringify(formattedLecturers));
        setLecturers(formattedLecturers);
        return formattedLecturers;
      }
      throw new Error("No lecturers found");
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      const fallbackLecturers = [
        { id: 1, name: "Isaaq", username: "isaaq" },
        { id: 2, name: "Prechard", username: "prechard" },
      ];
      setLecturers(fallbackLecturers);
      return fallbackLecturers;
    }
  };

  const handleAssign = async (issueId, lecturerId) => {
    if (!lecturerId) {
      alert("Please select a lecturer to assign");
      return;
    }

    try {
      setIsAssigning(true);
      const lecturer = lecturers.find((l) => l.id === lecturerId);
      
      if (!lecturer?.username) {
        throw new Error("Invalid lecturer selected");
      }

      const authAxios = createAuthAxios();
      await authAxios.patch(`${ENDPOINTS.assign}${issueId}/`, {
        lecturer: lecturer.username,
      });

      // Update local state
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? { ...issue, assignedLecturer: lecturer.name, status: "in progress" }
            : issue
        )
      );

      alert("Issue assigned successfully!");
    } catch (error) {
      console.error("Error assigning issue:", error);
      alert(`Failed to assign issue: ${error.message}`);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleResolve = async (issueId) => {
    if (!window.confirm("Are you sure you want to mark this issue as resolved?")) {
      return;
    }

    try {
      const authAxios = createAuthAxios();
      await authAxios.patch(`${ENDPOINTS.resolve}${issueId}/`, {
        status: "resolved"
      });

      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId
            ? { ...issue, status: "resolved" }
            : issue
        )
      );

      alert("Issue marked as resolved successfully!");
    } catch (error) {
      console.error("Error resolving issue:", error);
      alert(`Failed to resolve issue: ${error.message}`);
    }
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      await fetchIssues();
      await fetchLecturers();
      setOfflineMode(false);
      setError(null);
    } catch (error) {
      setError("Failed to reconnect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // First clear all auth-related data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      
      // Call the auth context logout if available
      if (logout) {
        await logout();
      }

      // Force navigation to login page
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even if there's an error
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchIssues();
        await fetchLecturers();
        setOfflineMode(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        const cachedIssues = localStorage.getItem("cachedIssues");
        const cachedLecturers = localStorage.getItem("cachedLecturers");

        if (cachedIssues && cachedLecturers) {
          setIssues(JSON.parse(cachedIssues));
          setLecturers(JSON.parse(cachedLecturers));
          setOfflineMode(true);
        } else {
          setError(`Failed to load data: ${err.message || "Unknown error"}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesType = !filterType || issue.issueCategory === filterType;
    const matchesStatus = !filterStatus || issue.status === filterStatus;
    const matchesLecturer = !filterLecturer || 
      (issue.assignedLecturer && 
       issue.assignedLecturer.toLowerCase().includes(filterLecturer.toLowerCase()));
    return matchesType && matchesStatus && matchesLecturer;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  // Statistics
  const totalIssues = issues.length;
  const pendingIssues = issues.filter((issue) => issue.status === "pending").length;
  const inProgressIssues = issues.filter((issue) => issue.status === "in progress").length;
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved").length;

  if (loading) {
    return (
      <DashboardContainer>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Academic Registrar Dashboard...</p>
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <ActionButton primary onClick={handleRetry}>Retry</ActionButton>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {offlineMode && (
        <div className="offline-banner">
          <p>Working in offline mode. Some changes may not be saved to the server.</p>
          <ActionButton primary onClick={handleRetry}>Try to reconnect</ActionButton>
        </div>
      )}

      <HeaderSection>
        <PageTitle>Academic Registrar Dashboard</PageTitle>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </HeaderSection>

      <SummaryGrid>
        <SummaryCard>
          <div className="label">Total Issues</div>
          <div className="value">{totalIssues}</div>
        </SummaryCard>
        <SummaryCard>
          <div className="label">Pending</div>
          <div className="value">{pendingIssues}</div>
        </SummaryCard>
        <SummaryCard>
          <div className="label">In Progress</div>
          <div className="value">{inProgressIssues}</div>
        </SummaryCard>
        <SummaryCard>
          <div className="label">Resolved</div>
          <div className="value">{resolvedIssues}</div>
        </SummaryCard>
      </SummaryGrid>

      <FilterContainer>
        <label>
          Issue Category
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Missing_Marks">Missing Marks</option>
            <option value="wrong grading">Wrong Grading</option>
            <option value="wrong marks">Wrong Marks</option>
            <option value="other">Other</option>
          </Select>
        </label>

        <label>
          Status
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </Select>
        </label>

        <label>
          Lecturer
          <input
            type="text"
            value={filterLecturer}
            onChange={(e) => setFilterLecturer(e.target.value)}
            placeholder="Search by lecturer name"
          />
        </label>
      </FilterContainer>

      {currentIssues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No issues found matching your filters</h3>
        </div>
      ) : (
        <>
          <Table>
            <thead>
              <Tr>
                <Th>ID</Th>
                <Th>Course Code</Th>
                <Th>Issue Category</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Assigned Lecturer</Th>
                <Th>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {currentIssues.map((issue) => (
                <Tr key={issue.id}>
                  <Td>{issue.id}</Td>
                  <Td>{issue.courseCode}</Td>
                  <Td>{issue.issueCategory}</Td>
                  <Td>{issue.description}</Td>
                  <Td>
                    <StatusBadge status={issue.status}>
                      {issue.status}
                    </StatusBadge>
                  </Td>
                  <Td>{issue.assignedLecturer || "Not Assigned"}</Td>
                  <Td>
                    {isAssigning && issue.id === localStorage.getItem("currentlyAssigningIssue") ? (
                      <div className="mini-spinner"></div>
                    ) : (
                      <>
                        {issue.status !== "resolved" && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Select
                              onChange={(e) => {
                                localStorage.setItem("currentlyAssigningIssue", issue.id);
                                handleAssign(issue.id, e.target.value);
                              }}
                              value=""
                              disabled={issue.status === "resolved"}
                            >
                              <option value="">Assign Lecturer</option>
                              {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id}>
                                  {lecturer.name}
                                </option>
                              ))}
                            </Select>
                            <ActionButton
                              primary
                              onClick={() => handleResolve(issue.id)}
                              disabled={issue.status === "resolved"}
                            >
                              Resolve
                            </ActionButton>
                          </div>
                        )}
                        {issue.status === "resolved" && (
                          <StatusBadge status="resolved">Resolved</StatusBadge>
                        )}
                      </>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <ActionButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </ActionButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <ActionButton
                key={page}
                onClick={() => setCurrentPage(page)}
                primary={currentPage === page}
              >
                {page}
              </ActionButton>
            ))}
            <ActionButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </ActionButton>
          </Pagination>
        </>
      )}
    </DashboardContainer>
  );
};

export default AcademicRegistrar;
