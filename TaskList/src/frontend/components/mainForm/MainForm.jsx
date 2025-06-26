import React from "react";
import { Box, Button, Inline, LoadingButton } from "@forge/react";
import ProjectSelector from "./filters/ProjectSelector";
import FiltersPanel from "./filters/FiltersPanel";

const MainForm = ({
  projects,
  project,
  onProjectChange,
  monthOptions,
  onMonthChange,
  onSearch,
  onExport,
  loading,
  canSearch,
  canExport,
}) => (
  <Box backgroundColor="neutral.subtle">
    <ProjectSelector projects={projects} onChange={onProjectChange} />
    <FiltersPanel monthOptions={monthOptions} onMonthChange={onMonthChange} />

    <Inline space="space.100" alignBlock="center" alignInline="end">
      {!loading ? (
        <Button
          padding="space.200"
          isDisabled={!canSearch}
          appearance={canSearch ? "primary" : "default"}
          onClick={onSearch}
        >
          Buscar tareas
        </Button>
      ) : (
        <LoadingButton appearance="primary" isLoading>
          Cargando
        </LoadingButton>
      )}
      <Button
        paddingTop="space.200"
        isDisabled={!canExport}
        appearance={canExport ? "primary" : "default"}
        onClick={onExport}
      >
        Exportar a CSV
      </Button>
    </Inline>
  </Box>
);

export default MainForm;
