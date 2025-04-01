import React from "react";
// import emailjs from "@emailjs/browser";
// import { toast } from "react-toastify";

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      issue: "",
      comments: "",
      file: null,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  validateMail = () => {
    // Basic email validation
    const { email } = this.state;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  sendMessage = (event) => {
    event.preventDefault();
    if (!this.validateMail()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const { name, email, issue, comments, file } = this.state;
    const templateParams = {
      from_name: name,
      to_email: email,
      issue_details: {
        issue,
        comments,
        file: file ? file.name : null, // Just the file name for simplicity
      },
    };

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_USER_ID"
      )
      .then(
        (response) => {
          toast.success("Your message has been successfully sent!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          console.log("SUCCESS!", response.status, response.text);
          // Reset form fields
          this.setState({
            name: "",
            email: "",
            issue: "",
            comments: "",
            file: null,
          });
        },
        (err) => {
          toast.error("Your message was not able to be sent");
          console.error("Error sending email:", err);
        }
      );
  };

  render() {
    return (
      <form onSubmit={this.sendMessage}>
        <input
          type="text"
          name="name"
          onChange={this.handleInputChange}
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          onChange={this.handleInputChange}
          placeholder="Your Email"
          required
        />
        <label htmlFor="issueSelect">Select Issue:</label>
        <select name="issue" onChange={this.handleInputChange} required>
          <option value="">--Please choose an option--</option>
          <option value="missing_marks">Missing Marks</option>
          <option value="under_grading">Under Grading</option>
          <option value="misplaced_marks">Misplaced Marks</option>
          <option value="appeal_remarking">Appeal for Remarking</option>
          <option value="others">Others</option>
        </select>
        <label htmlFor="fileUpload">Attachment of Proof:</label>
        <input
          type="file"
          id="fileUpload"
          accept=".pdf, .doc, .docx, .jpg, .png"
          onChange={this.handleFileChange}
        />
        <textarea
          name="comments"
          onChange={this.handleInputChange}
          placeholder="Optional comments..."
        />
        <button type="submit">Send</button>
      </form>
    );
  }
}

export default EmailForm;
