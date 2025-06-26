import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

// Obtener lista de proyectos disponibles para el usuario
resolver.define("getProjects", async () => {
  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/project/search`);
    const data = await response.json();
    return data.values.map(({ id, key, name }) => ({ id, key, name }));
  } catch (error) {
    return [];
  }
});

// Devuelve el primer y último día del mes especificado
function getDateRangeForMonth(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return { firstDay, lastDay };
}

// Devuelve el primer día del mes anterior en formato ISO
function getStartDateForPreviousMonth(year, month) {
  const fromDate = new Date(
    Date.UTC(month === 1 ? year - 1 : year, month === 1 ? 11 : month - 2, 1)
  );
  return fromDate.toISOString().split("T")[0];
}

// Recupera tareas con worklogs en el mes seleccionado, por lotes
resolver.define("getIssuesWithRecentWorklogsBatch", async ({ payload }) => {
  const { projectKey, startAt, batchSize, month, year } = payload;
  const { value } = projectKey;

  if (!value) return [];

  const fromDate = getStartDateForPreviousMonth(year, month);

  const jql = `project = "${value}" AND created >= "${fromDate}" ORDER BY key DESC`;
  const fields = [
    "summary",
    "project",
    "issuetype",
	"parent",
    "customfield_10154",
    "customfield_10882",
    "customfield_10386",
    "customfield_10221",
  ];

  const response = await api.asUser().requestJira(route`/rest/api/3/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jql, startAt, maxResults: batchSize, fields }),
  });

  const data = await response.json();
  const issues = data.issues || [];

  const { firstDay, lastDay } = getDateRangeForMonth(year, month);
  const filteredIssues = [];

  for (const issue of issues) {
    try {
      const res = await api
        .asUser()
        .requestJira(route`/rest/api/3/issue/${issue.key}/worklog`);
      const worklogData = await res.json();

      const recentLogs = worklogData.worklogs.filter((log) => {
        const logDate = new Date(log.started);
        return logDate >= firstDay && logDate <= lastDay;
      });

      if (recentLogs.length > 0) {
        filteredIssues.push({
          key: issue.key,
          summary: issue.fields.summary,
          fields: issue.fields,
          worklogs: recentLogs,
        });
      }
    } catch (err) {
      console.error(`Error fetching worklog for ${issue.key}:`, err);
    }
  }

  return {
    issues: filteredIssues,
    total: data.total,
    isLastBatch: startAt >= data.total,
  };
});

export const handler = resolver.getDefinitions();
