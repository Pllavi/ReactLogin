import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Button onClick={()=>navigate(-1)}>Back</Button>
          <NavLink to="/" className="text-decoration-none text-light mx-2">
            Netlink
          </NavLink>
          <Nav className="me-auto">
            <NavLink to="/" className="text-decoration-none text-light mx-2">
              Home
            </NavLink>
            <NavLink to="/login" className="text-decoration-none text-light">
              Login
            </NavLink>
            <NavLink to="/settings" className="text-decoration-none text-light mx-2">
              Settings
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
