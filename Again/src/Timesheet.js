import "./TimesheetPage.css";
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// function TimesheetPage() {
//   const [userProjects, setUserProjects] = useState([]);

//   const [timeEntries, setTimeEntries] = useState([]);
//   const location = useLocation("");
//   const email = location.state?.email || "";

//   const [selectedProject, setSelectedProject] = useState("");

//   const [date, setDate] = useState("");

//   const [hours, setHours] = useState("");
//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/getprojecttitle", {
//         params: { email: email },
//       })
//       .then((response) => {
//         const fetchedUserProjects = response.data;
//         console.log(fetchedUserProjects);
//         setUserProjects(fetchedUserProjects);
//       })
//       .catch((error) => {
//         console.error("Error fetching user projects:", error);
//       });
//   }, [email]);

//   const addTimeEntry = () => {
//     if (selectedProject && date && hours) {
//       const newEntry = {
//         project: selectedProject,

//         date,

//         hours: parseFloat(hours),
//       };

//       setTimeEntries([...timeEntries, newEntry]);

//       setSelectedProject("");

//       setDate("");

//       setHours("");
//     }
//   };
//   return (
//     <div className="timesheet-container">
//       <h1>Timesheet</h1>

//       <div className="entry-form">
//         <select
//           className="project-select"
//           value={selectedProject}
//           onChange={(e) => setSelectedProject(e.target.value)}
//         >
//           <option value="">Select a project</option>

//           {userProjects.map((project, index) => (
//             <option key={index} value={project.title}>
//               {project.title}
//             </option>
//           ))}
//         </select>

//         <input
//           type="date"
//           className="date-input"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <input
//           type="number"
//           className="hours-input"
//           placeholder="Hours"
//           value={hours}
//           onChange={(e) => setHours(e.target.value)}
//         />

//         <button className="add-button" onClick={addTimeEntry}>
//           Add Entry
//         </button>
//       </div>

//       <div className="time-entries">
//         <h2>Time Entries</h2>

//         <ul>
//           {timeEntries.map((entry, index) => (
//             <li key={index}>
//               {entry.project} - {entry.date} - {entry.hours} hours
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default TimesheetPage;

function TimesheetPage() {
  const [userProjects, setUserProjects] = useState([]);

  const [timeEntries, setTimeEntries] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");

  const [date, setDate] = useState("");

  const [hours, setHours] = useState("");

  const location = useLocation("");
  const email = location.state?.email || "";

  useEffect(() => {
    axios

      .get("http://localhost:3001/api/getprojecttitle", {
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

  const addTimeEntry = () => {
    if (selectedProject && date && hours) {
      const newEntry = {
        project: selectedProject,

        date,

        hours: parseFloat(hours),
      };

      axios

        .post("http://localhost:3001/api/timesheet", newEntry)

        .then((response) => {
          console.log(response.data);
        })

        .catch((error) => {
          console.error("Error saving to timesheet:", error);
        });

      setTimeEntries([...timeEntries, newEntry]);

      setSelectedProject("");

      setDate("");

      setHours("");
    }
  };

  const deleteTimeEntry = (index) => {
    const updatedTimeEntries = [...timeEntries];

    updatedTimeEntries.splice(index, 1);

    setTimeEntries(updatedTimeEntries);
  };

  return (
    <div className="timesheet-container">
      <h1>Timesheet</h1>

      <div className="entry-form">
        <select
          className="project-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select a project</option>

          {userProjects.map((project, index) => (
            <option key={index} value={project.title}>
              {project.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="number"
          className="hours-input"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <button className="add-button" onClick={addTimeEntry}>
          Add Entry
        </button>
      </div>

      <div className="time-entries">
        <h2>Time Entries</h2>

        <ul>
          {timeEntries.map((entry, index) => (
            <li key={index}>
              {entry.project} - {entry.date} - {entry.hours} hours
              <button
                className="delete-button"
                onClick={() => deleteTimeEntry(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TimesheetPage;
