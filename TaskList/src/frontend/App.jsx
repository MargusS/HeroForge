import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import MainForm from "./components/mainForm/MainForm";
import TaskListWrapper from "./components/taskListWrapper/TaskListWrapper";
import { exportDetailedWorklogsAsCSV } from "./utils/csvGenerator";
import { sortWorklogsByDay } from "./utils/workLogSorter";
import useMonthOptions from "./hooks/useMonthOptions";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const monthOptions = useMonthOptions();
  const grouped = sortWorklogsByDay(tasks);
  const canSearch = !!project && !!selectedMonth && !loading;
  const canExport = tasks.length > 0 && !loading;

  useEffect(() => {
    invoke("getProjects").then(setProjects);
  }, []);

  const onSearch = async () => {
    if (!project || !selectedMonth) return;
    setTasks([]);
    setLoading(true);
    try {
      let startAt = 0;
      const batchSize = 50;
      while (true) {
        const result = await invoke("getIssuesWithRecentWorklogsBatch", {
          projectKey: project,
          year: selectedMonth.year,
          month: selectedMonth.month,
          startAt,
          batchSize,
        });
        setTasks((prev) => [...prev, ...result.issues]);
        if (result.isLastBatch) break;
        startAt += batchSize;
      }
    } catch (err) {
      console.error("Error al buscar tareas:", err);
    }
    setLoading(false);
  };

  return (
    <>
      <MainForm
        projects={projects}
        project={project}
        onProjectChange={(value) => {
          setProject(value);
          setTasks([]);
        }}
        monthOptions={monthOptions}
        onMonthChange={setSelectedMonth}
        onSearch={onSearch}
        onExport={() => exportDetailedWorklogsAsCSV(tasks)}
        loading={loading}
        canSearch={canSearch}
        canExport={canExport}
      />

      <TaskListWrapper
        groupedTasks={grouped}
        loading={loading}
        tasks={tasks}
        canExport={canExport}
        canSearch={canSearch}
      />
    </>
  );
};

export default App;
