import React from "react";
import { Box, Button, Inline, LoadingButton } from "@forge/react";
import ProjectSelector from "./filters/ProjectSelector";
import FiltersPanel from "./filters/FiltersPanel";
import { useSearchContext } from "../../context/SearchContext";
import { exportDetailedWorklogsAsCSV } from "../../utils/excelGenerator";
import useFetchWorklogs from "../../hooks/useFetchWorklogs";

const MainForm = ({ projects, monthOptions }) => {
  const { setProject, fromDate, toDate, tasks, loading, canSearch, canExport } =
    useSearchContext();

  const fetchWorklogs = useFetchWorklogs();

  return (
    <Box backgroundColor="neutral.subtle">
      <ProjectSelector
        projects={projects}
        onChange={setProject}
      />

      <FiltersPanel monthOptions={monthOptions} />

      <Inline space="space.100" alignBlock="center" alignInline="start">
        <Box paddingBlockEnd="space.300" paddingBlockStart="space.300">
          {!loading ? (
            <Button
              padding="space.200"
              isDisabled={!canSearch}
              appearance={canSearch ? "primary" : "default"}
              onClick={async () => {
                const result = await fetchWorklogs();
              }}
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
            Exportar Excel
          </Button>
        </Box>
      </Inline>
    </Box>
  );
};

export default MainForm;
