import React from "react";
import { Box, Inline, Heading } from "@forge/react";
import SummaryEntry from "./SummaryEntry";

const SummaryTable = ({ entries, total }) => {
  return (
    <Box
      xcss={{
        width: "100%",
      }}
    >
      {entries.map((entry, index) => (
        <SummaryEntry key={entry.key} entry={entry} index={index} />
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

export default SummaryTable;
