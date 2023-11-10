import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import SIgn_img from "./SIgn_img";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [enteredOtp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/forgot-password",
        { email }
      );
      if (response.data.status === "Success") {
        setIsEmailVerified(true);
        setMessage("");
      } else {
        setMessage("Email not found. Please try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleotpSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/verify-otp",
        {
          email: email, // Ensure this is correctly set
          otp: enteredOtp, // Ensure this is correctly set
        }
      );
      if (response.data.status === "Success") {
        console.log("OTP matched!");
        navigate("/reset", { state: { email: email } });
      } else {
        console.log("OTP does not match!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="container mt-3">
      <section className="d-flex justify-content-between">
        <div className="left_data mt-3 p-3" style={{ width: "100%" }}>
          <h3 className="text-center col-lg-6">Forgot Password</h3>
          {!isEmailVerified ? (
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter email"
              />
              <Button type="submit" name="emailsubmit"  style={{ background: "rgb(173,216,230)" }}>
                Submit
              </Button>
              {message && <div>{message}</div>}
            </form>
          ) : (
            <form onSubmit={handleotpSubmit}>
              <label>Enter OTP:</label>
              <input
                type="text"
                value={enteredOtp}
                onChange={handleOtpChange}
                placeholder="Enter OTP here"
                required
              />
              <Button type="submit" name="otp"  style={{ background: "rgb(173,216,230)" }}>
                Verify OTP
              </Button>
              {message && <div>{message}</div>}
            </form>
          )}
        </div>
        <SIgn_img />
      </section>
    </div>
  );
};

export default ForgotPassword;
