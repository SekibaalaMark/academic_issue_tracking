const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require("./routes/auth");

app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
