const cors = require("cors");
const express = require("express");
const app = express();

const {
  signup,
  loginUser,
  handleFailedLoginAttempts,
  submitCardDetails,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  changeAddress,
  getdata,
  saveProject,
  Project,
  assign,
  getUser,
  getSavedUsers,
  saveNewProject,
  getUserProjects,
  updateAssignedUser,
  getUserProjectsTitle,
  saveTimesheet,
} = require("./controllers/userController");
app.use(cors());

app.use(express.json());

app.post("/api/signup", signup);
app.post("/api/login", handleFailedLoginAttempts, loginUser);
app.post("/api/forgot-password", forgotPassword);
app.post("/api/verify-otp", verifyOtp);
app.post("/api/reset", resetPassword);
app.post("/api/submit-card-details", submitCardDetails);
app.post("/api/change-password", changePassword);
app.post("/api/change-address", changeAddress);
app.get("/api/get-user-data", getdata);
app.get("/api/projects", Project);
app.post("/api/save-project", saveProject);
app.post("/api/assign", assign);
app.get("/api/users", getUser);
app.get("/api/userss", getSavedUsers);
app.get("/api/user-projects", getUserProjects);
app.get("/api/getprojecttitle", getUserProjectsTitle);
app.put("/api/updateAssignedUser", updateAssignedUser);
app.post("/api/timesheet", saveTimesheet);

app.post("/api/saveProject", saveNewProject);

app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});
