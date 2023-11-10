const mysql = require("mysql2/promise");
const sendOtpEmail = require("./emailService");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bittipagal7898@",
  database: "signup",
});

const getdata = async (req, res) => {
  const { email } = req.query;
  try {
    const [rows] = await pool.query(
      "SELECT name,address FROM users WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      const userData = rows[0];
      res.json(userData);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
const Project = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");

    res.json(rows);
  } catch (error) {
    console.error("Error fetching projects:", error);

    res.status(500).json({ message: "An error occurred" });
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [rows] = await pool.query(
      "INSERT INTO users (email,password,name) VALUES (?,?,?)",
      [email, password, name]
    );
    res.json({ message: "Signup successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const otpGenerator = require("otp-generator");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });

      await pool.query("UPDATE users SET otp = ? WHERE email = ?", [
        otp,
        email,
      ]);

      sendOtpEmail(email, otp);

      return res.json({ status: "Success" });
    } else {
      res.status(404).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (rows.length > 0) {
      await pool.query("UPDATE users SET otp = NULL WHERE email = ?", [email]);
      return res.json({ status: "Success" });
    } else {
      return res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received reset password request:", { email, password });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("Query Result:", rows);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Email not found or OTP not verified." });
    }

    await pool.query("UPDATE users SET password = ? WHERE email = ?", [
      password,
      email,
    ]);
    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_IN_MINUTES = 15;

const handleFailedLoginAttempts = async (req, res, next) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return next();
    }

    const user = rows[0];

    if (user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS) {
      const currentTime = new Date().getTime();
      const lastFailedLoginTime = new Date(user.last_failed_login).getTime();
      const diffInMinutes = Math.floor(
        (currentTime - lastFailedLoginTime) / (1000 * 60)
      );

      if (diffInMinutes < LOCK_TIME_IN_MINUTES) {
        return res
          .status(423)
          .json({ status: "Error", message: "Account locked" });
      } else {
        await pool.query(
          "UPDATE users SET failed_login_attempts = 0, last_failed_login = NULL WHERE email = ?",
          [email]
        );
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "An error occurred" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ status: "Error", message: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS) {
      const currentTime = new Date().getTime();
      const lastFailedLoginTime = new Date(user.last_failed_login).getTime();
      const diffInMinutes = Math.floor(
        (currentTime - lastFailedLoginTime) / (1000 * 60)
      );

      if (diffInMinutes < LOCK_TIME_IN_MINUTES) {
        return res
          .status(423)
          .json({ status: "Error", message: "Account locked" });
      } else {
        await pool.query(
          "UPDATE users SET failed_login_attempts = 0, last_failed_login = NULL WHERE email = ?",
          [email]
        );
      }
    }

    if (user.password === password) {
      await pool.query(
        "UPDATE users SET failed_login_attempts = 0, last_failed_login = NULL WHERE email = ?",
        [email]
      );
      return res.json({ status: "Success" });
    } else {
      await pool.query(
        "UPDATE users SET failed_login_attempts = failed_login_attempts + 1, last_failed_login = NOW() WHERE email = ?",
        [email]
      );
      return res
        .status(401)
        .json({ status: "Error", message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "An error occurred" });
  }
};

const submitCardDetails = async (req, res) => {
  const { email, aadharNumber, ContactNumber, panNumber } = req.body;

  try {
    await pool.query(
      "UPDATE users SET aadhar_number = ?,contact_number = ?, pan_number = ? WHERE email = ?",
      [aadharNumber, ContactNumber, panNumber, email]
    );

    return res.json({
      status: "Success",
      message: "Aadhar and PAN details submitted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while submitting card details.",
    });
  }
};
const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    console.log("Received request to change password for email:", email);

    const [rows] = await pool.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [newPassword, email]
    );

    console.log("Query result:", rows);

    if (rows.affectedRows === 1) {
      res.json({
        status: "Success",
        message: "Password changed successfully.",
      });
    } else {
      res.status(404).json({ status: "Error", message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while changing password.",
    });
  }
};
const changeAddress = async (req, res) => {
  const { email, newaddress } = req.body;

  try {
    console.log("Received request to change address for email:", email);

    const [rows] = await pool.query(
      "UPDATE users SET address = ? WHERE email = ?",
      [newaddress, email]
    );

    console.log("Query result:", rows);

    if (rows.affectedRows === 1) {
      res.json({
        status: "Success",
        message: "Password changed successfully.",
      });
    } else {
      res.status(404).json({ status: "Error", message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while changing password.",
    });
  }
};
const saveNewProject = async (req, res) => {
  const {
    id,
    client_name,
    project_description,
    started_date,
    ending_date,
    title,
  } = req.body;

  try {
    const formattedStartedDate = new Date(started_date);
    const formattedEndingDate = new Date(ending_date);
    console.log("Received project data:", req.body);
    const [projectRows] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    if (projectRows.length === 0) {
      await pool.query(
        "INSERT INTO projects (id, client_name, project_description, started_date, ending_date, title) VALUES (?, ?, ?, ?, ?, ?)",
        [
          id,
          client_name,
          project_description,
          formattedStartedDate,
          formattedEndingDate,
          title,
        ]
      );
      res.json({
        status: "Success",
        message: "Project details inserted successfully",
      });
    } else {
      await pool.query(
        "UPDATE projects SET client_name = ?, project_description = ?, started_date = ?, ending_date = ?, title = ? WHERE id = ?",
        [
          client_name,
          project_description,
          formattedStartedDate,
          formattedEndingDate,
          title,
          id,
        ]
      );
      res.json({
        status: "Success",
        message: "Project details updated successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "An error occurred" });
  }
};

const assign = async (req, res) => {
  const { projectId, user } = req.body;

  try {
    const [userRows] = await pool.query("SELECT * FROM users WHERE name = ?", [
      user,
    ]);

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    await pool.query(
      "UPDATE project_assignment SET name = ? WHERE project = ?",
      [user, projectId]
    );

    res.json({
      status: "Success",
      message: "User assigned to project successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ status: "Error", message: "An error occurred" });
  }
};
const getSavedUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");

    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const getUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM project_assignment");

    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({ message: "An error occurred" });
  }
};
const saveProject = async (req, res) => {
  const {
    id,
    client_name,
    project_description,
    started_date,
    ending_date,
    title,
  } = req.body;

  try {
    const formattedStartedDate = new Date(started_date);

    const formattedEndingDate = new Date(ending_date);

    console.log("Received project data:", req.body);

    // Check if the project already exists

    const [projectRows] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    if (projectRows.length === 0) {
      // Insert a new project

      await pool.query(
        "INSERT INTO projects (id, client_name, project_description, started_date, ending_date, title) VALUES (?, ?, ?, ?, ?, ?)",

        [
          id,
          client_name,
          project_description,
          formattedStartedDate,
          formattedEndingDate,
          title,
        ]
      );

      res.json({
        status: "Success",
        message: "Project details inserted successfully",
      });
    } else {
      await pool.query(
        "UPDATE projects SET client_name = ?, project_description = ?, started_date = ?, ending_date = ?, title = ? WHERE id = ?",

        [
          client_name,
          project_description,
          formattedStartedDate,
          formattedEndingDate,
          title,
          id,
        ]
      );

      res.json({
        status: "Success",
        message: "Project details updated successfully",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ status: "Error", message: "An error occurred" });
  }
};
const getUserProjects = async (req, res) => {
  const { email } = req.query;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects  WHERE assigned_user = ?",
      [email]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
const getUserProjectsTitle = async (req, res) => {
  const { email } = req.query;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects  WHERE assigned_user = ?",
      [email]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const updateAssignedUser = async (req, res) => {
  const { projectId, userEmail } = req.body;

  try {
    const [rows] = await pool.query(
      "UPDATE projects SET assigned_user = ? WHERE title = ?",
      [userEmail, projectId]
    );

    res.json({ message: "Assigned user updated successfully" });
  } catch (error) {
    console.error("Error updating assigned user:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const saveTimesheet = async (req, res) => {
  const { project, date, hours } = req.body;

  try {
    await pool.query(
      "INSERT INTO timesheet (project, date, hours) VALUES (?, ?, ?)",

      [project, date, hours]
    );

    res.json({ message: "Timesheet entry saved successfully" });
  } catch (error) {
    console.error("Error saving timesheet entry:", error);

    res
      .status(500)
      .json({ message: "An error occurred while saving the entry" });
  }
};

module.exports = {
  saveTimesheet,
  updateAssignedUser,
  getUserProjectsTitle,
  getUserProjects,
  saveNewProject,
  getSavedUsers,
  getUser,
  assign,
  signup,
  loginUser,
  submitCardDetails,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  handleFailedLoginAttempts,
  changeAddress,
  getdata,
  saveProject,
  Project,
};
