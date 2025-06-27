import React from "react";
import { Box, Select, Label, Inline } from "@forge/react";
import MonthSelector from "./MonthSelector";
import SowSelector from "./SowSelector";
import BillingTypeSelector from "./BillingTypeSelector";
const FiltersPanel = ({ monthOptions, onMonthChange }) => {
  return (
    <Inline grow="fill" space="space.200">
      <MonthSelector options={monthOptions} onChange={onMonthChange} />
      <SowSelector />
      <BillingTypeSelector />
      <Box paddingBlockEnd="space.200">
        <Label labelFor="team-select">Equipo</Label>
        <Select id="team-select" placeholder="Selecciona un equipo" />
      </Box>
    </Inline>
  );
};

export default FiltersPanel;
