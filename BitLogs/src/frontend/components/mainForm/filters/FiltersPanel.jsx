import React from "react";
import { Box, Select, Label, Inline } from "@forge/react";
import SowSelector from "./SowSelector";
import BillingTypeSelector from "./BillingTypeSelector";
import DateRangeSelector from "./DateRangeSelector";
const FiltersPanel = () => {
  return (
    <Inline grow="fill" space="space.200">
      <DateRangeSelector />
      {/* <Box paddingBlockEnd="space.200" xcss={{ width: "100%" }}>
        <Label labelFor="team-select">Equipo</Label>
        <Select id="team-select" placeholder="Selecciona un equipo" />
      </Box> */}
      <SowSelector />
      <BillingTypeSelector />
    </Inline>
  );
};

export default FiltersPanel;
