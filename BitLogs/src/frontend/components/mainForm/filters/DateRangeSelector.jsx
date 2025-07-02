import React from "react";
import {
  Box,
  DatePicker,
  Inline,
  Label,
  ButtonGroup,
  Button,
  xcss,
} from "@forge/react";
import { useSearchContext } from "../../../context/SearchContext";

const DateRangeSelector = () => {
  const { fromDate, setFromDate, toDate, setToDate } = useSearchContext();

  const setThisMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  const setLastMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    setFromDate(first.toISOString().split("T")[0]);
    setToDate(last.toISOString().split("T")[0]);
  };

  return (
    <Box paddingBlockEnd="space.200">
      <Inline space="space.200" alignBlock="center">
        <Box paddingBlockEnd="space.200" xcss={{ width: "180px" }}>
          <Label labelFor="from-date">Desde</Label>
          <DatePicker
            id="from-date"
            value={fromDate}
            onChange={(val) => setFromDate(val)}
            placeholder="Selecciona fecha"
          />
        </Box>
        <Box paddingBlockEnd="space.200" xcss={{ width: "180px" }}>
          <Label labelFor="to-date">Hasta</Label>
          <DatePicker
            id="to-date"
            value={toDate}
            onChange={(val) => setToDate(val)}
            placeholder="Selecciona fecha"
          />
        </Box>
      </Inline>
      <ButtonGroup>
        <Button onClick={setThisMonth}>Mes actual</Button>
        <Button onClick={setLastMonth}>Mes anterior</Button>
      </ButtonGroup>
    </Box>
  );
};

export default DateRangeSelector;
