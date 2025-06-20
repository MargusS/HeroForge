import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Text,
  Select,
  Option,
  Button,
  Box,
  Label,
  Spinner,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const batchSize = 50;

const App = () => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [startAt, setStartAt] = useState(0);
  const [hasMore, setHasMore] = useState(false);
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

	console.log(tasks)

    tasks.forEach((task) => {
      task.worklogs.forEach((log) => {
        const date = log.started.split("T")[0]; // "YYYY-MM-DD"
        if (!result[date]) result[date] = [];

        result[date].push({
          key: task.key,
          summary: task.fields.summary,
          user: log.author?.displayName || "Desconocido",
          time: log.timeSpent,
        });
      });
    });

    return result;
  };

  const exportDetailedWorklogsAsCSV = (tasks) => {
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
      const { key, summary, fields, worklogs } = task;

      worklogs.forEach((log) => {
        rows.push([
          safe(log.timeSpent),
          safe(log.started?.split("T")[0]),
          safe(log.author?.displayName),
          safe(log.author?.accountId),
          safe(fields?.project?.name),
          safe(key),
          safe(summary),
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
  const loadNextBatch = async () => {
    if (!project) return;

    setLoading(true);

    try {
      const result = await invoke("getIssuesWithRecentWorklogsBatch", {
        projectKey: project,
        startAt,
        batchSize,
      });
	  console.log("Result:", result);

      setTasks((prev) => [...prev, ...result.issues]);
      setStartAt(result.nextStartAt);
      setHasMore(!result.isLastBatch);
    } catch (err) {
      console.error("Error al buscar tareas:", err);
    }

    setLoading(false);
  };

  const onSearch = () => {
    setTasks([]);
    setStartAt(0);
    setHasMore(false);
    loadNextBatch();
  };

  const grouped = groupWorklogsByDay(tasks);

  return (
    <>
      {console.log(tasks)}
      <Label labelFor="project-select">Proyecto</Label>
      <Select
        id="project-select"
        options={projects.map((p) => ({ label: p.name, value: p.key }))}
        onChange={(value) => {
          setProject(value);
          setTasks([]);
          setStartAt(0);
          setHasMore(false);
        }}
        placeholder="Selecciona un proyecto"
      />
      <Button onClick={onSearch} disabled={!project}>
        Buscar tareas
      </Button>
      {tasks.length > 0 && (
        <>
          <Button onClick={() => exportDetailedWorklogsAsCSV(tasks)}>
            Exportar a CSV
          </Button>
          {hasMore && (
            <Button onClick={loadNextBatch} disabled={loading}>
              {loading ? <Spinner size="small" /> : "Cargar más"}
            </Button>
          )}
        </>
      )}
      <Box>
        {Object.entries(grouped)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, entries]) => (
            <Box key={date} style={{ marginBottom: "16px" }}>
              <Text weight="bold">{date}</Text>
              {entries.map((entry, index) => (
                <Box key={index} style={{ paddingLeft: "12px" }}>
                  <Text>{`${entry.key} - ${entry.summary} | ${entry.user} | ${entry.time}`}</Text>
                </Box>
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
