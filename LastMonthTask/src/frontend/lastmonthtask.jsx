import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke } from '@forge/bridge';

const LastMonthTaskApp = () => {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    invoke('getProjects').then(setProjects);
  }, []);

  const loadTasks = async () => {
    if (!selected) {
      setTasks([]);
      return;
    }
    const items = await invoke('getTasks', { projectKey: selected });
    setTasks(items);
  };

  return (
    <div>
      <h1>Last Month Task</h1>
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="" disabled>Select a project</option>
        {projects.map((p) => (
          <option key={p.key} value={p.key}>{p.name}</option>
        ))}
      </select>
      <button onClick={loadTasks}>Load tasks</button>
      <ul>
        {tasks.map((issue) => (
          <li key={issue.key}>{issue.key} - {issue.summary}</li>
        ))}
      </ul>
    </div>
  );
};

ForgeReconciler.render(<LastMonthTaskApp />);
