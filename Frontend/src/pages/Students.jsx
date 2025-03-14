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

  // Fetch issues and notifications on mount
  useEffect(() => {
    axios
      .get("/api/issues?role=student")
      .then((res) => setIssues(res.data))
      .catch((err) => console.error(err));
    axios
      .get("/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);


function Students() {
  return <h1>Welcome to the Academic Tracking System</h1>;
}

export default Students;
