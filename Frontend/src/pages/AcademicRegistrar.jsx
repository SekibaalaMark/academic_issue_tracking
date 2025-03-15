import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

//Styled components for the table and controls
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

const FilterContainer = styled.div`
  margin-top: 1rem;
`;

const Button = styled.button`
  margin: 0 0.5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

function AcademicRegistrar() {
  const[issues, setIssues] = useState([]);
  const[filterType, setFilterType] = useState("");
  const[filterStatus, setFilterStatus] = useState("");
  const[filterLecturer, setFilterLecturer] = useState("");

  //Fetch all issues on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/issues")
      .then((res => {
         setIssues(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err => {
        console.error("Error fetching issues:", err);
        setIssues([]);    
      });
  }, []);

  //compute filtered issues based on selected filters
  const filteredIssues = issues.filter(issue => {
    const matchType = filterType ? issue.type === filterType : true;
    const matchStatus = filterStatus ? issue.status === filterStatus : true;
    const matchLecturer = filterLecturer
    ? issue.assignedLecturer &&
      issue.assignedLecturer.toLowerCase().includes(filterLecturer.toLowerCase()) : true;
    return matchType && matchStatus && matchLecturer;
  });  

  // Handle assigning an issue to a lecturer (or reassigning)
  const handleAssign = (issueId) => {
    const lecturer = prompt("Enter lecturer's name to assign:");
    if (lecturer) {
      axios
        .patch(`/api/issues/${issueId}`, { assignedLecturer: lecturer })
        .then((res) => {
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.id === issueId ? { ...issue, assignedLecturer: lecturer } : issue
            )
          );
          alert(`Issue assigned to ${lecturer}`);
        })
        .catch((err) => {
          console.error("Error assigning issue:", err);
          alert("Error assigning issue.");
        });
    }
  };

  // Handle resolving an issue
  const handleResolve = (issueId) => {
    if (window.confirm("Are you sure you want to mark this issue as resolved?")) {
      axios
        .patch(`/api/issues/${issueId}`, { status: "resolved" })
        .then((res) => {
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.id === issueId ? { ...issue, status: "resolved" } : issue
            )
          );
          // Trigger a notification: here, a simple alert and console log
          alert("Issue marked as resolved. Notification sent.");
          console.log("Email notification sent for resolved issue.");
        })
        .catch((err) => {
          console.error("Error resolving issue:", err);
          alert("Error resolving issue.");
        });
    }
  };

return (
  <><div style={{ padding: "1rem" }} /><h1>Academic Registrar</h1></>
   {/* Filtering Controls */}
   <FilterContainer>
   <label>
     Filter by Issue Type:&nbsp;
     <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
       <option value="">All</option>
       <option value="missing marks">Missing Marks</option>
       <option value="appeals">Appeals</option>
       <option value="corrections">Corrections</option>
     </select>
   </label>
   <label style={{ marginLeft: "1rem" }}>
     Filter by Status:&nbsp;
     <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
       <option value="">All</option>
       <option value="pending">Pending</option>
       <option value="in progress">In Progress</option>
       <option value="resolved">Resolved</option>
     </select>
   </label>
   <label style={{ marginLeft: "1rem" }}>
     Filter by Assigned Lecturer:&nbsp;
     <input
       type="text"
       value={filterLecturer}
       onChange={(e) => setFilterLecturer(e.target.value)}
       placeholder="Lecturer's name"
     />
   </label>
 </FilterContainer>
)
    

   
export default AcademicRegistrar;
