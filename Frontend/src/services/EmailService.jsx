import emailjs from "emailjs-com";

const sendEmailNotification = (recipientEmail, issueDetails) => {
  const templateParams = {
    to_email: recipientEmail,
    issue_details: issueDetails,
  };

  emailjs
    .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams, "YOUR_USER_ID")
    .then((response) => {
      console.log("Email sent successfully!", response.status, response.text);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

export default sendEmailNotification;
