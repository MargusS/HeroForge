import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import MainForm from "./components/mainForm/MainForm";
import TaskListWrapper from "./components/taskListWrapper/TaskListWrapper";
import useMonthOptions from "./hooks/useMonthOptions";
import { useSearchContext } from "./context/SearchContext";
import { sortWorklogsByDay } from "./utils/workLogSorter";
import { Tabs, TabList, Tab, TabPanel, Box, Inline } from "@forge/react";
import SummaryWrapper from "./components/taskSummaryWrapper/SummaryWrapper";

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
      <Tabs>
        <TabList>
          <Tab>Registros Diarios</Tab>
          <Tab>Resumen Total</Tab>
        </TabList>

        <TabPanel>
          <TaskListWrapper groupedTasks={groupedTasks} />
        </TabPanel>

        <TabPanel>
          <SummaryWrapper tasks={tasks} />
        </TabPanel>
      </Tabs>
    </>
  );
};

export default App;
