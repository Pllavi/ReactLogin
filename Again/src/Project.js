import React, { useEffect } from "react";
import "./ProjectsPage.css";
import Modal from "react-bootstrap/Modal";
import ProjectCard from "./ProjectCard";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import ProjectDetail from "./ProjectDetail";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ProjectsPage() {
  const { projectId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredProjects, setFilteredProjects] = useState([]);

  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 5;
  const location = useLocation("");
  const email = location.state?.email || "";
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [userProjects, setUserProjects] = useState([]);

  const [allSavedUsers, setAllSavedUsers] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/user-projects", {
        params: { email: email },
      })
      .then((response) => {
        const fetchedUserProjects = response.data;
      console.log(fetchedUserProjects); 
      setUserProjects(fetchedUserProjects);
      })
      .catch((error) => {
        console.error("Error fetching user projects:", error);
      });
    }, [email]);
  const [newProjectData, setNewProjectData] = useState({
    title: "",

    client_name: "",

    project_description: "",

    started_date: "",

    ending_date: "",
  });

  useEffect(() => {
    axios

      .get("http://localhost:3001/api/users")

      .then((response) => {
        const fetchedUsers = response.data;

        setUsers(fetchedUsers);
      })

      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/projects")

      .then((response) => {
        const fetchedProjects = response.data;
        console.log(fetchedProjects);

        setProjects(fetchedProjects);

        setFilteredProjects(fetchedProjects);
      })

      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  useEffect(() => {
    filterProjects(searchTerm);
  }, [searchTerm]);

  const filterProjects = (term) => {
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(term.toLowerCase()) ||
        project.project_description
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        project.client_name.toLowerCase().includes(term.toLowerCase())
    );

    const sorted = filtered.slice().sort((a, b) => {
      const compareValue = sortDirection === "asc" ? 1 : -1;

      return a.title.localeCompare(b.title) * compareValue;
    });

    setFilteredProjects(sorted);
  };
  const refreshProjects = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/projects");

      const fetchedProjects = response.data;

      setProjects(fetchedProjects);

      setFilteredProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);
  const handleSearchChange = (selected) => {
    if (selected.length > 0) {
      setSearchTerm(selected[0]);
    } else {
      setSearchTerm("");
    }
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filterProjects(searchTerm);
    navigate(`/projects/search/${encodeURIComponent(searchTerm)}`);
  };

  const openAAssignModal = async (project) => {
    try {
      setSelectedProjectId(project);

      const response = await axios.get("http://localhost:3001/api/userss");

      const fetchedUsers = response.data;

      setAllSavedUsers(fetchedUsers);

      setShowAssignModal(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const addNewProject = async (projectData) => {
    try {
      await axios.post("http://localhost:3001/api/saveProject", projectData);

      await refreshProjects();

      setShowAddProjectModal(false);
    } catch (error) {
      console.error("Error adding new project:", error);
    }
  };

  const assignUserToProject = async (selectedProject) => {
    try {
      if (selectedUser) {
        await axios.post("http://localhost:3001/api/assign", {
          user: selectedUser.name,
          projectId: selectedProjectId,
        });
  
        await axios.put("http://localhost:3001/api/updateAssignedUser", {
          projectId: selectedProjectId,
          userEmail: selectedUser.email, 
        });
  
        setShowAssignModal(false);
      }
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };
  

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = userProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalProjects = userProjects.length;
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  return (
    <div>
      <Navbar className="bg-body-tertiary justify-content-between">
        <h1>Projects</h1>

        <Button onClick={() => setShowAddProjectModal(true)}>
          Add New Project
        </Button>
        <Form inline onSubmit={handleSubmit}>
          <Row>
            <Col xs="auto">
              <InputGroup>
                <Typeahead
                  id="project-search"
                  labelKey="title"
                  options={projects.map((project) => project.title)}
                  placeholder="Search"
                  onChange={handleSearchChange}
                />
                <Button type="submit">Submit</Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>
      </Navbar>
      <div className="project-grid">
        {userProjects.map((project) => (
          <ProjectCard key={project.id} project={project} userProjects={userProjects}>
            <Link to={`/projects/${project.id}`}>View Details</Link>
            {parseInt(projectId) === project.id && (
              <ProjectDetail project={project} />
            )}
          </ProjectCard>
        ))}
      </div>
      <Modal
        show={showAddProjectModal}
        onHide={() => setShowAddProjectModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="newProjectTitle">
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                value={newProjectData.title}
                onChange={(e) =>
                  setNewProjectData({
                    ...newProjectData,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="newProjectClientName">
              <Form.Label>Client Name</Form.Label>

              <Form.Control
                type="text"
                value={newProjectData.client_name}
                onChange={(e) =>
                  setNewProjectData({
                    ...newProjectData,
                    client_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="newProjectDescription">
              <Form.Label>Project Description</Form.Label>

              <Form.Control
                type="text"
                value={newProjectData.project_description}
                onChange={(e) =>
                  setNewProjectData({
                    ...newProjectData,
                    project_description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="newProjectStartDate">
              <Form.Label>Start Date</Form.Label>

              <Form.Control
                type="text"
                value={newProjectData.started_date}
                onChange={(e) =>
                  setNewProjectData({
                    ...newProjectData,
                    started_date: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="newProjectEndDate">
              <Form.Label>End Date</Form.Label>

              <Form.Control
                type="text"
                value={newProjectData.ending_date}
                onChange={(e) =>
                  setNewProjectData({
                    ...newProjectData,
                    ending_date: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddProjectModal(false)}
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={() => addNewProject(newProjectData)}
          >
            Add Project
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="user-list">
        <h2>User List</h2>

        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>Name:</strong>
              {"  "}
              {user.name} <strong>Project_Assigned:</strong>
              {"  "}
              {user.project}
              <button onClick={() => openAAssignModal(user.project)}>
                Assign to another user
              </button>
              {user === selectedUser && (
                <span>{selectedUser.name} selected</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="pagination">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentProjects.length < projectsPerPage ||
            currentPage >= totalPages
          }
        >
          Next
        </Button>
      </div>

      {showAssignModal && (
        <div className="assign-modal">
          <h3>Select a User to Assign</h3>

          <ul>
            {allSavedUsers.map((user) => (
              <li key={user.id}>
                {user.name}{" "}
                <button onClick={() => setSelectedUser(user)}>Select</button>
              </li>
            ))}
          </ul>

          <button onClick={assignUserToProject}>Assign</button>

          <button onClick={() => setShowAssignModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
