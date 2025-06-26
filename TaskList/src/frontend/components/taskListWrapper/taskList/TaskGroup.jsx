import React from "react";
import { Box, Lozenge } from "@forge/react";
import TaskEntry from "./TaskEntry";

const TaskGroup = ({ date, entries }) => (
  <Box paddingBlockEnd="space.150" borderWidth="1">
    <Box paddingBlockEnd="space.050">
      <Lozenge appearance="new" isBold>
        {date}
      </Lozenge>
    </Box>
    {entries.map((entry, index) => (
      <TaskEntry key={index} entry={entry} />
    ))}
  </Box>
);

export default TaskGroup;
