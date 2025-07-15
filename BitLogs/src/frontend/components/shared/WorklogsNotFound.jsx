import React from "react";
import { Box, Text } from "@forge/react";
const WorklogsNotFound = () => {
  return (
    <Box padding="space.300">
      <Text>No se encontraron tareas con worklogs en el la fecha seleccionada.</Text>
    </Box>
  );
};

export default WorklogsNotFound;
