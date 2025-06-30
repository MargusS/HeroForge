import React from "react";
import { Box, Text, Select } from "@forge/react";

const ProjectSelector = ({ projects, onChange }) => {
  return (
    <>
      <Text weight="bold" size="medium">Proyecto</Text>
      <Box paddingBlockEnd="space.100" paddingBlockStart="space.100">
        <Select
          id="project-select"
          options={projects.map((p) => ({ label: p.name, value: p.key }))}
          onChange={onChange}
          placeholder="Selecciona un proyecto"
        />
      </Box>
    </>
  );
};

export default ProjectSelector;
