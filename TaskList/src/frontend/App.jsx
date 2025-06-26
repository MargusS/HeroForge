import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import MainForm from "./components/mainForm/MainForm";
import TaskListWrapper from "./components/taskListWrapper/TaskListWrapper";
import useMonthOptions from "./hooks/useMonthOptions";
import { useSearchContext } from "./context/SearchContext";
import useSearchTasks from "./hooks/useSearchContext";
import { sortWorklogsByDay } from "./utils/workLogSorter";

const App = () => {
  const [projects, setProjects] = useState([]);
  const { tasks } = useSearchContext();
  const groupedTasks = sortWorklogsByDay(tasks);
  const monthOptions = useMonthOptions();
  const onSearch = useSearchTasks();

  useEffect(() => {
    invoke("getProjects").then(setProjects);
  }, []);

  return (
    <>
      <MainForm
        projects={projects}
        monthOptions={monthOptions}
        onSearch={onSearch}
      />
      <TaskListWrapper groupedTasks={groupedTasks} />
    </>
  );
};

export default App;
