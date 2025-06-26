import React from "react";
import { Box, Select, Label } from "@forge/react";

const MonthSelector = ({ options, onChange }) => {
  return (
    <Box paddingBlockEnd="space.200">
      <Label labelFor="month-select">Mes</Label>
      <Select
        id="month-select"
        options={options}
        onChange={({ value }) => {
          const [year, month] = value.split("-").map(Number);
          onChange({ year, month });
        }}
        placeholder="Selecciona un mes"
      />
    </Box>
  );
};

export default MonthSelector;
