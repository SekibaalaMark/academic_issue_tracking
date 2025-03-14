import React,{useState,useEffect} from "react";
import axios from 'axios';
import styled from "styled-components"

const Students = () => {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    courseCode:"",
    issueType:"missing marks",
    description:"",
  })
  const [alertMessage, setAlertMessage] = useState("");
  


function Students() {
  return <h1>Welcome to the Academic Tracking System</h1>;
}

export default Students;
