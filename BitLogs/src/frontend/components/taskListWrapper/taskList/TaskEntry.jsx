import React from "react";
import { Box, Inline, Text, Heading } from "@forge/react";

const TaskEntry = ({ entry }) => (
  <Box
    xcss={{
      borderRadius: "border.radius",
      marginBlockEnd: "space.050",
      paddingInline: "space.150",
    }}
    backgroundColor="color.background.neutral"
  >
    <Inline
      space="space.100"
      alignInline="start"
      alignBlock="center"
      spread="space-between"
    >
      <Heading size="small">{`${entry.key} - ${entry.summary}`}</Heading>
      <Inline separator="•" space="space.150" alignBlock="center">
        <Text size="small">{entry.user}</Text>
        <Box padding="space.050">
          <Heading
            size="medium"
            xcss={{ width: "space.300" }}
          >
            {entry.time}
          </Heading>
        </Box>
      </Inline>
    </Inline>
  </Box>
);

export default TaskEntry;
