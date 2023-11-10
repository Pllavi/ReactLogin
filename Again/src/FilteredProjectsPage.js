import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import Navbar from "react-bootstrap/Navbar";
import "./ProjectsPage.css";
import axios from "axios";

function FilteredProjectsPage() {
  const { searchTerm,projectId } = useParams();


  const [filteredProjects, setFilteredProjects] = useState([]);
  const [sortDirection, setSortDirection] = useState("asc");

  const filterProjects = (term, fetchedProjects) => {
    if (!fetchedProjects) {
      return; // Exit early if fetchedProjects is undefined
    }

    console.log("Filtering projects with term:", term);

    const filtered = fetchedProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(term.toLowerCase()) ||
        project.description.toLowerCase().includes(term.toLowerCase()) ||
        project.clientname.toLowerCase().includes(term.toLowerCase())
    );

    console.log("Filtered projects:", filtered);

    const sorted = filtered.slice().sort((a, b) => {
      const compareValue = sortDirection === "asc" ? 1 : -1;
      return a.title.localeCompare(b.title) * compareValue;
    });

    setFilteredProjects(sorted);
  };

  useEffect(() => {
    axios.get("http://localhost:3001/api/projects")
      .then((response) => {
        const fetchedProjects = response.data;
        filterProjects(searchTerm, fetchedProjects);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [searchTerm]);

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
        <h1>Filtered Projects</h1>
      </Navbar>

      <div className="project grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export default FilteredProjectsPage;
