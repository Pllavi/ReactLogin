import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import SIgn_img from "./SIgn_img";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:3001/api/reset",
        { email, password } 
      );

      if (response.data.message === "Password reset successfully.") {
        setMessage("Password reset successfully.");
        navigate('/login')
      } else {
        setMessage("Password reset failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="container mt-3">
      <section className="d-flex justify-content-between">
      <div className="left_data mt-3 p-3" style={{ width: "100%" }}>
      <h3 className="text-center">Reset Password</h3>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <Button type="submit" style={{ background: "rgb(173,216,230)" }}>Reset Password</Button>
      </form>
      {message && <div className="mt-3">{message}</div>}
      </div>
      <SIgn_img />
      </section>
    </div>
   
  );
};

export default ResetPassword;
