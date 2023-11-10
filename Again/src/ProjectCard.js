import React from "react";
import Card from 'react-bootstrap/Card';
import { NavLink, useLocation } from "react-router-dom";

function ProjectCard({ project ,userProjects}) {
  const location = useLocation("");
  const email = location.state?.email || "";
  const formatDateString = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString();
  }

    const isAssigned = userProjects.some((userProject) => userProject.id === project.id);

  if (!isAssigned) {
    return null; 
  

  }
  return (
    
    <Card style={{ width: '18rem' }}>
      <Card.Body className="project-card">
        <NavLink to={`/projects/${project.id}`} >
         <Card.Title  >{project.title}</Card.Title></NavLink>
        <Card.Subtitle className="mb-2 text-muted">Client Name: {project.client_name}</Card.Subtitle>
        <Card.Text>
          {project.project_description}
        </Card.Text>
        <Card.Text>
        Project Started:{formatDateString(project.started_date)}
        </Card.Text>
        <Card.Text>
        Project Ended:{formatDateString(project.ending_date)}
        </Card.Text>
        
      </Card.Body>
    </Card>
  
  );
}

export default ProjectCard;



 
