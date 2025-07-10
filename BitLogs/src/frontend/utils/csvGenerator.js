import { parseTimeSpentToDecimal } from "./timeSpentFormatter.js";
import { getReferenceKeyAndSummary } from "./epicReferenceFormatter.js";
import * as XLSX from "xlsx";

const safe = (val) => {
  const str = val ? String(val) : "";
  const needsQuotes =
    str.includes(",") || str.includes('"') || str.includes("\n");
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
};

export const exportDetailedWorklogsAsCSV = (tasks, fromDate, toDate) => {
  if (!tasks || tasks.length === 0) return;

  const headers = [
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
  ];

  const issueMap = new Map();
  tasks.forEach((log) => {
    if (log.issue?.id) {
      issueMap.set(log.issue.id, log.issue);
    }
  });

  const rows = tasks.map((log) => {
    const issue = log.issue || {};
    const fields = issue.fields || {};
    const { key: keyReference, summary: summaryReference } =
      getReferenceKeyAndSummary(issue, issueMap);

    return [
      parseTimeSpentToDecimal(log.timeSpent),
      log.started?.split("T")[0],
      log.author?.displayName,
      log.author?.accountId,
      fields?.project?.name,
      keyReference || issue.key,
      summaryReference || fields?.summary,
      fields?.issuetype?.name,
      fields?.customfield_10882, // Billing Type
      fields?.customfield_10386, // Helpdesk
      fields?.customfield_10221, // Requesting project
      fields?.customfield_10154?.value, // SOW Number
    ];
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Worklogs");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const formattedFrom = new Date(fromDate).toISOString().split("T")[0];
  const formattedTo = new Date(toDate).toISOString().split("T")[0];
  link.href = url;
  link.download = `worklogs_${formattedFrom}_to_${formattedTo}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
