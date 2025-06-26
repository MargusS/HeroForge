import React, { useEffect, useState } from "react";
import { Box, Label, Select } from "@forge/react";
import { invoke } from "@forge/bridge";
import { useSearchContext } from "../../../context/SearchContext";

const SowSelector = () => {
  const { project, selectedSow, setSelectedSow } = useSearchContext();
  const [sows, setSows] = useState([]);

  useEffect(() => {
    const fetchSows = async () => {
      if (project) {
        const result = await invoke("getSowsByProject", project);
        setSows(result);
      } else {
        setSows([]);
      }
    };

    fetchSows();
  }, [project]);

  const options = sows.map((sow) => ({
    label: `${sow.key} - ${sow.summary}`,
    value: sow.key,
  }));

  return (
    <Box paddingBlockEnd="space.200">
      <Label labelFor="sow-select">SOW</Label>
      <Select
        id="sow-select"
        isDisabled={!project}
        options={options}
        onChange={(e) => setSelectedSow(e)}
        value={selectedSow}
        placeholder={
          !project ? "Selecciona primero un proyecto" : "Selecciona un SOW"
        }
      />
    </Box>
  );
};

export default SowSelector;
