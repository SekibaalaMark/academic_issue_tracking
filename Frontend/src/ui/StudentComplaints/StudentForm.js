import { useState, useEffect } from "react";

const StudentForm = () => {
  const [issue, setIssue] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log("Selected Issue:", issue);
  }, [issue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted successfully!");
  };

  return {
    issue,
    setIssue,
    file,
    setFile,
    comment,
    setComment,
    handleSubmit,
  };
};

export default StudentForm;
