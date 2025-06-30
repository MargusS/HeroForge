import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import MainForm from "./components/mainForm/MainForm";
import TaskListWrapper from "./components/taskListWrapper/TaskListWrapper";
import useMonthOptions from "./hooks/useMonthOptions";
import { useSearchContext } from "./context/SearchContext";
import { sortWorklogsByDay } from "./utils/workLogSorter";

const App = () => {
  const [projects, setProjects] = useState([]);
  const { tasks } = useSearchContext();
  const groupedTasks = sortWorklogsByDay(tasks);
  const monthOptions = useMonthOptions();

  useEffect(() => {
    invoke("getProjects").then(setProjects);
  }, []);

  return (
    <>
      <MainForm projects={projects} monthOptions={monthOptions} />
      <TaskListWrapper groupedTasks={groupedTasks} />
    </>
  );
};

export default App;
