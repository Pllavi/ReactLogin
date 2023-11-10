import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { isValidAadhaar, isValidPAN } from "./ValidationUtils";
import { useNavigate } from "react-router-dom";
import SIgn_img from "./SIgn_img";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [lockoutMessage, setLockoutMessage] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate("");

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    // event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/api/login",
        values
      );

      if (response.data.status === "Success") {
        setLockoutMessage("");
        handleSuccessfulLogin();
      } else if (response.data.status === "Error") {
        if (response.data.message === "Account locked") {
          alert("Account is locked. Please try again after some time.");
        } else {
          alert("Invalid email or password");
        }
      }
    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Account locked"
      ) {
        alert("Account is locked. Please try again after some time.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleCardDetailsSubmit = async (event) => {
    event.preventDefault();
    if (!isValidPAN(panNumber)) {
      alert("Invalid PAN Card Number");
      return;
    }

    if (!isValidAadhaar(aadharNumber)) {
      alert("Invalid Aadhaar Card Number");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/submit-card-details",
        {
          email: values.email,
          aadharNumber,
          ContactNumber,
          panNumber,
        }
      );

      if (response.data.status === "Success") {
        setShowModal(false);

        alert("Aadhar and PAN details submitted successfully.");
        navigate("/landing", {
          state: { email: values.email, contactnumber: ContactNumber },
        });
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSuccessfulLogin = () => {
    setShowModal(true);
  };

  return (
    <div className="container mt-3">
      <section className="d-flex justify-content-between">
        <div className="left_data mt-3 p-3" style={{ width: "100%" }}>
          <h3 className="text-center col-lg-6">Login</h3>
          <Form>
            <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
              <FormControl
                type="email"
                name="email"
                onChange={handleInput}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3 col-lg-6" controlId="formBasicPassword">
              <FormControl
                type="password"
                name="password"
                onChange={handleInput}
                placeholder="Password"
              />
            </Form.Group>
            <Button
              variant="primary"
              className="col-lg-6"
              onClick={handleSubmit}
              style={{ background: "rgb(173,216,230)" }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
          <p className="mt-3">
            Forgot Password ?{" "}
            <span>
              <NavLink to="/forgot-password">Reset Password</NavLink>
            </span>{" "}
          </p>
          <p className="mt-3">
            Create Account{" "}
            <span>
              <NavLink to="/">Sign Up</NavLink>
            </span>{" "}
          </p>
          {lockoutMessage && <div className="mt-3">{lockoutMessage}</div>}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Enter Aadhar and PAN Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCardDetailsSubmit}>
                <FormControl
                  type="text"
                  placeholder="Aadhar Card Number"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  required
                />
                <FormControl
                  type="text"
                  placeholder="Enter Contact Number"
                  value={ContactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
                <FormControl
                  type="text"
                  placeholder="PAN Card Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
        <SIgn_img />
      </section>
    </div>
  );
}

export default Login;
