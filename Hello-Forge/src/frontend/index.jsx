import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    invoke('getProjects').then(setProjects);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      invoke('getIssues', { projectKey: selectedProject }).then(setIssues);
    } else {
      setIssues([]);
    }
  }, [selectedProject]);

  return (
    <>
      <label htmlFor="project-select">Select project:</label>{' '}
      <select
        id="project-select"
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">--Choose a project--</option>
        {projects.map((p) => (
          <option key={p.key} value={p.key}>
            {p.name}
          </option>
        ))}
      </select>
      <div>
        {selectedProject && issues.length === 0 && (
          <Text>No issues found in the last 30 days.</Text>
        )}
        {issues.length > 0 && (
          <ul>
            {issues.map((i) => (
              <li key={i.key}>
                {i.key}: {i.summary}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
