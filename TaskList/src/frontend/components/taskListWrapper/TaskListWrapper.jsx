import React from "react";
import { Box, Text } from "@forge/react";
import TaskList from "./taskList/TaskList";

const TaskListWrapper = ({ groupedTasks, loading, tasks, canExport, canSearch }) => {
  if (loading) {
    return (
      <Box marginTop="space.200">
        <Text>Procesando lotes... Esto puede tardar unos segundos</Text>
      </Box>
    );
  }

  if (!loading && tasks.length === 0 && !canExport && canSearch) {
    return (
      <Box marginTop="space.200">
        <Text>No se encontraron tareas con worklogs en el mes seleccionado.</Text>
      </Box>
    );
  }

  return <TaskList groupedTasks={groupedTasks} />;
};

export default TaskListWrapper;