import { getReferenceKeyAndSummary } from "../utils/epicReferenceFormatter";

// Agrupar worklogs por issue (Epic, Support, Service Request, etc.)
export const generateSummaryEntries = (tasks, issueMap) => {
  const summaryMap = {};

  for (const log of tasks) {
    const issue = log.issue;
    const time = log.timeSpentSeconds || 0;

    if (!issue) continue;

    const { key, summary, type } = getReferenceKeyAndSummary(issue, issueMap);

    if (!summaryMap[key]) {
      summaryMap[key] = { summary, totalSeconds: 0, type };
    }

    summaryMap[key].totalSeconds += time;
  }

  return Object.entries(summaryMap).map(([key, { summary, totalSeconds, type }]) => ({
    key,
    summary,
    type,
    totalHours: (totalSeconds / 3600).toFixed(2).replace(".", ","),
  }));
};

// Filtrar entradas por tipo de issue
export const filterEntriesByType = (entries, filterType) => {
  if (filterType === "ALL") return entries;
  return entries.filter((entry) => entry.type === filterType);
};
