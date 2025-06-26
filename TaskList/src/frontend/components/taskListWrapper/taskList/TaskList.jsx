import React from "react";
import { Box } from "@forge/react";
import TaskGroup from "./TaskGroup";

const TaskList = ({ groupedTasks }) => (
  <Box>
    {Object.entries(groupedTasks)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, entries]) => (
        <TaskGroup key={date} date={date} entries={entries} />
      ))}
  </Box>
);

export default TaskList;
