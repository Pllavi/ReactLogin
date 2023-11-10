import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Header from "./Header";
import "bootstrap/dist/css/bootstrap.min.css";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import LandingPage from "./LandingPage";
import UserProfile from "./UserProfile";
import UserSettings from "./UserSettings";
import UserDashboard from "./UserDashboard";
import "./App.css";
import Project from "./Project";
import FilteredProjectsPage from "./FilteredProjectsPage";
import ProjectDetail from "./ProjectDetail";
import axios from "axios";
import { useState,useEffect } from "react";
import TimesheetPage from "./Timesheet";

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/projects")
      .then((response) => {
        const fetchedProjects = response.data;
        setProjects(fetchedProjects);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/landing" element={<LandingPage />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/settings" element={<UserSettings />}></Route>
        <Route path="/timesheet" element={<TimesheetPage/>}></Route>
        <Route path="/dashboard" element={<UserDashboard />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset" element={<ResetPassword />}></Route>
        <Route path="/projects" element={<Project />}></Route>
        <Route path="/projects/search/:searchTerm/:projectId" element={<FilteredProjectsPage projects={projects}/>} />

        <Route path="/projects/:projectId" element={<ProjectDetail projects={projects}/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
