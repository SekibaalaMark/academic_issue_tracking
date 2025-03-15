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
    if(filterType && issue.type !== filterType) {
      return false;
    }

    if(filterStatus && issue.status !== filterStatus) {
      return false;
    }

    if(filterLecturer && issue.lecturer !== filterLecturer) {
      return false;
    }

    return true;
  }
  return <h1>Welcome to the Academic Tracking System</h1>;
}

export default AcademicRegistrar;
