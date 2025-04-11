  import emailjs from "@emailjs/browser";

const fetchRecipientEmail = async (userId) => {
  // Simulate fetching email from a database or API
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipient email");
  }
  const data = await response.json();
  return data.email;
};

const sendEmailNotification = async (userId, issueDetails) => {
  try {
    const recipientEmail = await fetchRecipientEmail(userId);
    const templateParams = {
      to_email: recipientEmail,
      issue_details: issueDetails,
    };

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_USER_ID"
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  } catch (error) {
    console.error("Error fetching recipient email:", error);
  }
};

export default sendEmailNotification;
