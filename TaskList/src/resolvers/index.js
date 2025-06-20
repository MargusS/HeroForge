import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

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

function isWithinLast30Days(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  return date >= thirtyDaysAgo;
}

async function fetchAllIssues(jql, fields) {
  const maxResults = 100;
  let startAt = 0;
  let total = 0;
  const allIssues = [];

  do {
    const response = await api.asUser().requestJira(route`/rest/api/3/search`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jql,
        startAt,
        maxResults,
        fields,
      }),
    });

    const data = await response.json();
    const issues = data.issues || [];

    allIssues.push(...issues);
    startAt += maxResults;
    total = data.total;
  } while (startAt < total);

  return allIssues;
}

resolver.define("getIssuesWithRecentWorklogsBatch", async ({ payload }) => {
  try {
    const { projectKey, startAt = 0, batchSize = 50 } = payload;
    const { value } = projectKey;
    if (!projectKey) return [];

    const jql = `project = "${value}" ORDER BY updated DESC`;

    const fields = [
      "summary",
      "parent",
      "issuetype",
      "project",
      "subtasks",
      "customfield_10154", // Billing Type
      "customfield_10882", // Helpdesk
      "customfield_10386", // Requesting project
      "customfield_10221", // SOW Number
    ];

    const response = await api.asUser().requestJira(route`/rest/api/3/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        jql,
        startAt,
        maxResults: batchSize,
        fields,
      }),
    });

    const data = await response.json();
    const issues = data.issues || [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filteredIssues = [];

    for (const issue of issues) {
      try {
        const res = await api
          .asUser()
          .requestJira(route`/rest/api/3/issue/${issue.key}/worklog`);
        const worklogData = await res.json();

        const recentLogs = worklogData.worklogs.filter(
          (log) => new Date(log.started) >= thirtyDaysAgo
        );

        if (recentLogs.length > 0) {
          filteredIssues.push({
            key: issue.key,
			fields: issue.fields,
            worklogs: recentLogs,
          });
        }
      } catch (err) {
        console.error(`Error getting worklogs for ${issue.key}`, err);
      }
    }

    return {
      issues: filteredIssues,
      total: data.total,
      nextStartAt: startAt + batchSize,
      isLastBatch: startAt + batchSize >= data.total,
    };
  } catch (error) {
    console.error("Error in searchTasks resolver:", error);
    return [];
  }
});

export const handler = resolver.getDefinitions();
