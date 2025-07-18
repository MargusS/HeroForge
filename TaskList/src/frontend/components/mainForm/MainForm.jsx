import React from "react";
import { Box, Button, Inline, LoadingButton } from "@forge/react";
import ProjectSelector from "./filters/ProjectSelector";
import FiltersPanel from "./filters/FiltersPanel";
import { useSearchContext } from "../../context/SearchContext";
import { exportDetailedWorklogsAsCSV } from "../../utils/csvGenerator";

const MainForm = ({ projects, monthOptions, onSearch }) => {
  const { setProject, fromDate, toDate, tasks, loading, canSearch, canExport } =
    useSearchContext();

  return (
    <Box backgroundColor="neutral.subtle">
      <ProjectSelector
        projects={projects}
        onChange={setProject} // ✅ uso directo desde contexto
      />

      <FiltersPanel monthOptions={monthOptions} />

      <Inline space="space.100" alignBlock="center" alignInline="start">
        <Box paddingBlockEnd="space.300" paddingBlockStart="space.300">
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
        </Box>
        <Box paddingBlockEnd="space.300" paddingBlockStart="space.300"> 
          <Button
            paddingTop="space.200"
            isDisabled={!canExport}
            appearance={canExport ? "primary" : "default"}
            onClick={() => exportDetailedWorklogsAsCSV(tasks, fromDate, toDate)}
          >
            Exportar a CSV
          </Button>
        </Box>
      </Inline>
    </Box>
  );
};

export default MainForm;
