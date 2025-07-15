import React, { useEffect, useState, useMemo } from "react";
import { Box, Text, Inline, Heading } from "@forge/react";
import SummaryEntry from "./SummaryEntry";
import { getReferenceKeyAndSummary } from "../../utils/epicReferenceFormatter";

const SummaryWrapper = ({ tasks }) => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);

  // Crear el Map de tareas por ID para la función getReferenceKeyAndSummary
  const issueMap = useMemo(() => {
    const map = new Map();
    for (const task of tasks) {
      map.set(task.id, task.issue);
    }
    return map;
  }, [tasks]);

  useEffect(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const summaryMap = {};

    for (const log of safeTasks) {
      const issue = log.issue;
      const time = log.timeSpentSeconds || 0;

      if (!issue) continue;

      const { key, summary } = getReferenceKeyAndSummary(issue, issueMap);

      if (!summaryMap[key]) {
        summaryMap[key] = { summary, totalSeconds: 0 };
      }

      summaryMap[key].totalSeconds += time;
    }

    const result = Object.entries(summaryMap).map(
      ([key, { summary, totalSeconds }]) => ({
        key,
        summary,
        totalHours: (totalSeconds / 3600).toFixed(2).replace(".", ","),
      })
    );

    const totalSum = result.reduce(
      (acc, r) => acc + parseFloat(r.totalHours.replace(",", ".")),
      0
    );

    setEntries(result);
    setTotal(totalSum);
  }, [tasks, issueMap]);

  return (
    <Box
      xcss={{
        width: "70%",
        padding: "space.100",
      }}
    >
      {entries.map((entry, index) => (
        <SummaryEntry entry={entry} index={index} />
      ))}

      <Box
        marginBlockStart="space.200"
        borderTopWidth="1"
        borderColor="color.border"
        backgroundColor="color.background.accent.teal.subtler"
      >
        <Inline
          space="space.100"
          alignInline="start"
          alignBlock="center"
          spread="space-between"
        >
          <Box padding="space.100">
            <Heading size="medium">Total general: </Heading>
          </Box>
          <Box padding="space.100">
            <Heading size="medium">
              {total.toFixed(2).replace(".", ",")} h
            </Heading>
          </Box>
        </Inline>
      </Box>
    </Box>
  );
};

export default SummaryWrapper;
