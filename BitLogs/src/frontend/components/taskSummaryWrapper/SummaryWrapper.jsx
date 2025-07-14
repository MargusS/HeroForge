import React, { useEffect, useState } from "react";
import { Box, Text, Inline, Heading } from "@forge/react";
import SummaryEntry from "./SummaryEntry";

const SummaryWrapper = ({ tasks }) => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const summaryMap = {};

    for (const task of safeTasks) {
      const key = task.issue.key;
      const summary = task.issue.fields?.summary || "";
      const timeSpent = task.timeSpentSeconds || 0;

      if (!summaryMap[key]) {
        summaryMap[key] = {
          key,
          summary,
          timeSpent,
        };
      } else {
        summaryMap[key].timeSpent += timeSpent;
      }
    }

    console.log("Procesando worklogs para la tarea:", summaryMap);

    const result = Object.values(summaryMap).map(
      ({ key, summary, timeSpent }) => ({
        key,
        summary,
        totalHours: (timeSpent / 3600).toFixed(2).replace(".", ","),
      })
    );

    const totalSum = result.reduce(
      (acc, r) => acc + parseFloat(r.totalHours.replace(",", ".")),
      0
    );

    setEntries(result);
    setTotal(totalSum);
  }, [tasks]);

  if (entries.length === 0) {
    return (
      <Box
        xcss={{
          width: "100%",
          padding: "space.200",
        }}
      >
        <Text>No hay tareas para mostrar en el resumen.</Text>
      </Box>
    );
  }

  return (
    <Box
      xcss={{
        width: "70%",
        padding: "space.200",
      }}
    >
      {entries.map((entry) => (
        <SummaryEntry entry={entry} />
      ))}

      <Box
        padding="space.100"
        marginBlockStart="space.200"
        borderTopWidth="1"
        borderColor="color.border"
        backgroundColor="color.background.brand.subtlest"
      >
        <Inline
          space="space.100"
          alignInline="start"
          alignBlock="center"
          spread="space-between"
        >
          <Box padding="space.100">
            <Heading size="large">Total general: </Heading>
          </Box>
          <Box padding="space.100">
            <Heading size="large">
              {total.toFixed(2).replace(".", ",")} h
            </Heading>
          </Box>
        </Inline>
      </Box>
    </Box>
  );
};

export default SummaryWrapper;
