import React from "react";
import { Box, Select } from "@forge/react";

const ISSUE_TYPE_OPTIONS = [
  { label: "Todos", value: "ALL" },
  { label: "Epic", value: "Epic" },
  { label: "Service Request", value: "Service Request" },
  { label: "Support", value: "Support" },
];

const SummaryFilters = ({ filterType, setFilterType }) => {
  const selectedOption = ISSUE_TYPE_OPTIONS.find(opt => opt.value === filterType);

  return (
    <Box
      xcss={{
        width: "20%",
        paddingBlock: "space.300",
      }}
    >
      <Select
        label="Filtrar por tipo de issue"
        options={ISSUE_TYPE_OPTIONS}
        onChange={(e) => setFilterType(e.value)}
        value={selectedOption}
      />
    </Box>
  );
};

export default SummaryFilters;
