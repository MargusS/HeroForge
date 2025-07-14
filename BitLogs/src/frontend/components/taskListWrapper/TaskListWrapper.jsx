import React from "react";
import { Box, Text } from "@forge/react";
import TaskList from "./taskList/TaskList";
import { useSearchContext } from "../../context/SearchContext";

const TaskListWrapper = ({ groupedTasks }) => {
  const { loading, tasks, canSearch, canExport } = useSearchContext();
  if (loading) {
    return (
      <Box padding="space.300">
        <Text>Procesando lotes... Esto puede tardar unos segundos</Text>
      </Box>
    );
  }

  if (!loading && tasks.length === 0 && !canExport && canSearch) {
    return (
      <Box padding="space.300">
        <Text>
          No se encontraron tareas con worklogs en el mes seleccionado.
        </Text>
      </Box>
    );
  }

  return <TaskList groupedTasks={groupedTasks} />;
};

export default TaskListWrapper;
