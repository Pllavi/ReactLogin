import { useState, useEffect } from "react";
import React from "react";
import "./Profile.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const location = useLocation();
  const email = location.state?.email || "";
  const contactnumber = location.state?.contactnumber || "";
  const [showModal, setShowModal] = useState(false);
  const [enteredContactNumber, setEnteredContactNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newaddress, setNewAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModdal, setShowModdal] = useState(false);
  const navigate = useNavigate("");
  const [userData, setUserData] = useState({
    name: "",
    email: email,
    contactNumber: contactnumber,
    address: "",
    profileImage:
      "https://w7.pngwing.com/pngs/306/70/png-transparent-computer-icons-management-admin-silhouette-black-and-white-neck-thumbnail.png",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/get-user-data", {
        params: { email: userData.email },
      })
      .then((response) => {
        setUserData((prevData) => ({
          ...prevData,
          name: response.data.name,
          address: response.data.address,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handlePasswordChange = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleaddressChange = () => {
    setShowModdal(true);
  };

  const handleSaveChanges = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/change-password",
          {
            email,
            ContactNumber: userData.contactNumber,
            newPassword: newPassword,
          }
        );

        if (response.data.status === "Success") {
          alert("Password changed successfully!");
          setShowModal(false);
        } else {
          alert("Failed to change password. Please try again.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while changing password.");
      }
    } else {
      alert("Passwords do not match.");
    }
  };

  const handleaddressSaveChanges = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/change-address",
        {
          email,
          newaddress: newaddress,
        }
      );

      if (response.data.status === "Success") {
        alert("Address changed successfully!");
        userData.address = newaddress;
        setShowModdal(false);
      } else {
        alert("Failed to change Address. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while changing Address.");
    }
  };
  const handlelogout = () => {
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userData.profileImage}
          alt="Profile"
          className="profile-image"
        />
        <p>
          <strong>Name:</strong>
          {userData.name}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Contact Number:</strong> {userData.contactNumber}
        </p>
        <p>
          <strong>Address:</strong> {userData.address}
        </p>
      </div>
      <button className="password-change-button" onClick={handlePasswordChange}>
        Change Password
      </button>
      <button className="address-change-button" onClick={handleaddressChange}>
        Change Address
      </button>
      <button className="logout-button" onClick={handlelogout}>
        Log Out
      </button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="password"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Contact Number"
            value={enteredContactNumber}
            onChange={(e) => setEnteredContactNumber(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModdal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            id="newaddress"
            placeholder="New Address"
            value={newaddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleaddressSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
