import React from "react";
import { Link,NavLink, useLocation, useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation("");
  const email = location.state?.email||"";
  const contactnumber = location.state?.contactnumber||"";

  const handleproject =()=>{
    navigate("/projects",{
      state: { email: email },
    })
  }

  const handlesettingClick =()=>{
    navigate("/settings")
  }

  const handleTimeSheet = ()=>{
    navigate("/timesheet",{
      state:{email:email},
    })
  }

  const handleProfileClick = () => {
    

    
    navigate("/profile", { state: { email:email ,contactnumber:contactnumber} });
  };

  return (
    <div className="landing-page">
      <h1 className="heading">Welcome</h1>
      <nav className="menu">
        <ul>
        <li>
            <button onClick={handleproject} className="projects-button">Project</button>
          </li>
          <li>
           
            <button onClick={handleProfileClick}className="profile-button" >Profile</button>
          </li>
          <li>
          <button onClick={handlesettingClick}className="setting-button" >setting</button>
          </li>
          <li>
            <button onClick={handleTimeSheet} className="Timesheet">TimeSheet</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LandingPage;
