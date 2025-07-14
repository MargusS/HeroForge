import React from "react";
import { Box, Heading, Inline, Text } from "@forge/react";

const SummaryEntry = ({ entry }) => (
  <Box backgroundColor="color.background.neutral">
    <Inline
      space="space.100"
      alignInline="start"
      alignBlock="center"
      spread="space-between"
    >
      <Box padding="space.100" paddingInlineEnd="space.300">
        <Text size="medium">{`${entry.key} - ${entry.summary}`}</Text>
      </Box>
      <Box padding="space.050" paddingInlineEnd="space.300">
        <Text size="large" weight="bold" xcss={{ width: "space.300" }}>
          {entry.totalHours} h
        </Text>
      </Box>
    </Inline>
  </Box>
);

export default SummaryEntry;
