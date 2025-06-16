import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Select, Option, Button, Box } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    invoke('getProjects').then(setProjects);
  }, []);

  const onSearch = () => {
    invoke('searchTasks', { projectKey: project }).then(setTasks);
  };

  return (
    <>
      <Select
        label="Proyecto"
        name="project"
        onChange={(value) => setProject(value)}
      >
        {projects.map((p) => (
          <Option label={p.name} value={p.key} key={p.id} />
        ))}
      </Select>
      <Button text="Search tasks" disabled={!project} onClick={onSearch} />
      <Box>
        {tasks.map((t) => (
          <Text key={t.key}>{`${t.key}: ${t.summary}`}</Text>
        ))}
      </Box>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
