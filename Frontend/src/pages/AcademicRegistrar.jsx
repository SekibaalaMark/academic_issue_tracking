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
  return <h1>Welcome to the Academic Tracking System</h1>;
}

export default AcademicRegistrar;
