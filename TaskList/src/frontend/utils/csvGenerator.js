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

  tasks.forEach((task) => {
    const { key: keyReference, summary: summaryReference } =
      getReferenceKeyAndSummary(task, tasks);
    const fields = task.fields || {};
    const worklogs = task.worklogs || [];
    console.log("Processing task:", task);
    console.log("Fields:", fields);
    worklogs.forEach((log) => {
      rows.push([
        safe(parseTimeSpentToDecimal(log.timeSpent)),
        safe(log.started?.split("T")[0]),
        safe(log.author?.displayName),
        safe(log.author?.accountId),
        safe(fields?.project?.name),
        safe(keyReference),
        safe(summaryReference),
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
  const formattedFrom = new Date(fromDate).toISOString().split("T")[0];
  const formattedTo = new Date(toDate).toISOString().split("T")[0];
  link.download = `worklogs_${formattedFrom}_to_${formattedTo}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
