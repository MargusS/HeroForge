import { parseTimeSpentToDecimal } from "./timeSpentFormatter.js";
import { getReferenceKeyAndSummary } from "./epicReferenceFormatter.js";

const safe = (val) => {
  const str = val ? String(val) : "";
  const needsQuotes =
    str.includes(",") || str.includes('"') || str.includes("\n");
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

export const exportDetailedWorklogsAsCSV = (tasks, fromDate, toDate) => {
  if (!tasks || tasks.length === 0) return;

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

  const issueMap = new Map();
  tasks.forEach((log) => {
    if (log.issue?.id) {
      issueMap.set(log.issue.id, log.issue);
    }
  });

  tasks.forEach((log) => {
    const issue = log.issue || {};
    const fields = issue.fields || {};

    const { key: keyReference, summary: summaryReference } =
      getReferenceKeyAndSummary(issue, issueMap);

    rows.push([
      safe(parseTimeSpentToDecimal(log.timeSpent)),
      safe(log.started?.split("T")[0]),
      safe(log.author?.displayName),
      safe(log.author?.accountId),
      safe(fields?.project?.name),
      safe(keyReference || issue.key),
      safe(summaryReference || fields?.summary),
      safe(fields?.issuetype?.name),
      safe(fields?.customfield_10154?.value), // SOW
      safe(fields?.customfield_10882), // Billing Type
      safe(fields?.customfield_10386), // Helpdesk
      safe(fields?.customfield_10221), // Requesting project
    ]);
  });

  const csvContent = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const formattedFrom = new Date(fromDate).toISOString().split("T")[0];
  const formattedTo = new Date(toDate).toISOString().split("T")[0];
  link.download = `worklogs_${formattedFrom}_to_${formattedTo}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
