import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Text,
  Select,
  Button,
  Box,
  Inline,
  Label,
  LoadingButton,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    invoke("getProjects").then(setProjects);
  }, []);

  const safe = (val) => {
    const str = val ? String(val) : "";
    const needsQuotes =
      str.includes(",") || str.includes('"') || str.includes("\n");
    const escaped = str.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const groupWorklogsByDay = (tasks) => {
    const result = {};
    tasks.forEach((task) => {
      task.worklogs.forEach((log) => {
        const date = log.started.split("T")[0];
        if (!result[date]) result[date] = [];
        result[date].push({
          key: task.key,
          summary: task.summary,
          user: log.author?.displayName || "Desconocido",
          time: log.timeSpent,
        });
      });
    });
    return result;
  };

  const exportDetailedWorklogsAsCSV = (tasks) => {
    if (tasks.length === 0 || loading) return;
    const rows = [
      [
        "Time Spent",
        "Start Date",
        "Author",
        "Author's Account Id",
        "Project Name",
        "Task Key",
        "Task Summary",
        "Issue Type",
        "Billing Type",
        "Helpdesk",
        "Requesting project",
        "SOW Number",
      ],
    ];
    tasks.forEach((task) => {
      const { key, fields, worklogs } = task;
      worklogs.forEach((log) => {
        rows.push([
          safe(log.timeSpent),
          safe(log.started?.split("T")[0]),
          safe(log.author?.displayName),
          safe(log.author?.accountId),
          safe(fields?.project?.name),
          safe(key),
          safe(fields?.summary),
          safe(fields?.issuetype?.name),
          safe(fields?.customfield_10154?.value),
          safe(fields?.customfield_10882),
          safe(fields?.customfield_10386),
          safe(fields?.customfield_10221),
        ]);
      });
    });
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `worklogs_detailed_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSearch = async () => {
    if (!project || !selectedMonth) return;
    setTasks([]);
    setLoading(true);
    try {
      let startAt = 0;
      const batchSize = 50;
      while (true) {
        const result = await invoke("getIssuesWithRecentWorklogsBatch", {
          projectKey: project,
          year: selectedMonth.year,
          month: selectedMonth.month,
          startAt,
          batchSize,
        });
        setTasks((prev) => [...prev, ...result.issues]);
        if (result.isLastBatch) break;
        startAt += batchSize;
      }
    } catch (err) {
      console.error("Error al buscar tareas:", err);
    }
    setLoading(false);
  };

  const monthOptions = (() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const options = [];
    for (let y = currentYear - 1; y <= currentYear; y++) {
      const startMonth = 0;
      const endMonth = y === currentYear ? currentMonth : 11;
      for (let m = startMonth; m <= endMonth; m++) {
        const date = new Date(Date.UTC(y, m, 1));
        const label = date.toLocaleString("es-ES", { month: "long" });
        options.push({
          label: `${label.charAt(0).toUpperCase() + label.slice(1)} ${y}`,
          value: `${y}-${(m + 1).toString().padStart(2, "0")}`,
        });
      }
    }
    return options.reverse();
  })();

  const grouped = groupWorklogsByDay(tasks);
  const canSearch = !!project && !!selectedMonth && !loading;
  const canExport = tasks.length > 0 && !loading;

  return (
    <>
      <Box backgroundColor="neutral.subtle">
        <Text weight="bold" size="medium">
          Filtros
        </Text>

        <Box paddingBlockEnd="space.200">
          <Label labelFor="project-select">Proyecto</Label>
          <Select
            id="project-select"
            options={projects.map((p) => ({ label: p.name, value: p.key }))}
            onChange={(value) => {
              setProject(value);
              setTasks([]);
            }}
            placeholder="Selecciona un proyecto"
          />
        </Box>

        <Box paddingBlockEnd="space.200">
          <Label labelFor="month-select">Mes</Label>
          <Select
            id="month-select"
            options={monthOptions}
            onChange={({ value }) => {
              const [year, month] = value.split("-").map(Number);
              setSelectedMonth({ year, month });
            }}
            placeholder="Selecciona un mes"
          />
        </Box>

        <Inline space="space.100" alignBlock="center" alignInline="end">
          {!loading && (
            <Button
              padding="space.200"
              isDisabled={!canSearch}
              appearance={canSearch ? "primary" : "default"}
              onClick={onSearch}
            >
              Buscar tareas
            </Button>
          )}
          {loading && (
            <LoadingButton appearance="primary" isLoading>
              Loading button
            </LoadingButton>
          )}
          <Button
            paddingTop="space.200"
            isDisabled={!canExport}
            appearance={canExport ? "primary" : "default"}
            onClick={() => exportDetailedWorklogsAsCSV(tasks)}
          >
            Exportar a CSV
          </Button>
        </Inline>
      </Box>

      {loading && (
        <Box marginTop="space.200">
          <Text>Procesando lotes... Esto puede tardar unos segundos</Text>
        </Box>
      )}

      {!loading && tasks.length === 0 && selectedMonth && project && (
        <Box marginTop="space.200">
          <Text>
            No se encontraron tareas con worklogs en el mes seleccionado.
          </Text>
        </Box>
      )}

      <Box marginTop="space.300">
        {Object.entries(grouped)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .map(([date, entries]) => (
            <Box
              key={date}
              marginBottom="space.150"
              borderWidth="1"
              borderColor="neutral"
              borderRadius="medium"
              backgroundColor="neutral.subtle"
            >
              <Text weight="bold">{date}</Text>
              {entries.map((entry, index) => (
                <Text key={index} size="small" style={{ marginLeft: 12 }}>
                  {`${entry.key} - ${entry.summary} | ${entry.user} | ${entry.time}`}
                </Text>
              ))}
            </Box>
          ))}
      </Box>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
