import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ProjectDetail({ projects }) {
  const { projectId } = useParams();
  const project = projects.find((p) => p.id === parseInt(projectId));
  const [editedProject, setEditedProject] = useState(project || {});
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const state = location.state || {};

  const  userId = state.email;

  const handleEditClick = () => {
    setIsEditing(true);
  };
  

  const handleSaveClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/save-project",

        {
          id: editedProject.id,

          client_name: editedProject.client_name,

          project_description: editedProject.project_description,

          started_date: new Date(
            editedProject.started_date
          ).toLocaleDateString(),

          ending_date: new Date(editedProject.ending_date).toLocaleDateString(),

          title: editedProject.title,
        }
      );

      if (response.data.status === "Success") {
        setIsEditing(false);
      } else {
        console.log(
          "Error occurred while saving project data:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditedProject((prevProject) => ({
      ...prevProject,

      [name]: value,
    }));
  };

  return (
    <div>
      {project ? (
        <>
          <h2>{project.title}</h2>
          <p>
            Client Name:{" "}
            {isEditing ? (
              <input
                type="text"
                name="client_name"
                value={editedProject.client_name}
                onChange={handleInputChange}
              />
            ) : (
              project.client_name
            )}
          </p>
          <p>
            Description:{" "}
            {isEditing ? (
              <textarea
                name="project_description"
                value={editedProject.project_description}
                onChange={handleInputChange}
              />
            ) : (
              project.project_description
            )}
          </p>
          <p>
            Project Started:{" "}
            {isEditing ? (
              <input
                type="text"
                name="started_date"
                value={new Date(
                  editedProject.started_date
                ).toLocaleDateString()}
                onChange={handleInputChange}
              />
            ) : (
              new Date(project.started_date).toLocaleDateString()
            )}
          </p>
          <p>
            Project Ended:{" "}
            {isEditing ? (
              <input
                type="text"
                name="ending_date"
                value={new Date(editedProject.ending_date).toLocaleDateString()}
                onChange={handleInputChange}
              />
            ) : (
              new Date(project.ending_date).toLocaleDateString()
            )}
          </p>

          {isEditing ? (
            <>
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={handleEditClick}>Edit</button>
          )}
        </>
      ) : (
        <p>Project not found</p>
      )}
     
    </div>
  );
}

export default ProjectDetail;
