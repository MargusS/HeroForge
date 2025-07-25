import api, { route } from "@forge/api";
import {
  getDateRangeForMonth,
  getStartDateForPreviousMonth,
} from "../utils/datesConverter";

export const getIssuesWithRecentWorklogsBatch = async ({
  projectKey,
  startAt,
  batchSize,
  fromDate,
  toDate,
  billingType,
}) => {
  const { value } = projectKey;
  if (!value) return [];

  let jql = `project = "${value}" AND created >= "${fromDate}" AND created <= "${toDate}" ORDER BY key DESC`;
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

  const filteredIssues = [];

  const formattedFromDate = new Date(fromDate);
  const formattedToDate = new Date(toDate);

  for (const issue of issues) {
    try {
      const res = await api
        .asUser()
        .requestJira(route`/rest/api/3/issue/${issue.key}/worklog`);
      const worklogData = await res.json();

      const recentLogs = worklogData.worklogs.filter((log) => {
        const logDate = new Date(log.started);
        return logDate >= formattedFromDate && logDate <= formattedToDate;
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
};
