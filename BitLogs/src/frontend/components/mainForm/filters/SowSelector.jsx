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

  const options = [
    { label: "Ninguno", value: null }, // opción para restablecer
    ...sows.map((sow) => ({
      label: `${sow.key} - ${sow.summary}`,
      value: sow.key,
      sow: sow.key, // compatibilidad con backend
    })),
  ];

  return (
    <Box paddingBlockEnd="space.200" xcss={{ width: "100%" }}>
      <Label labelFor="sow-select">SOW</Label>
      <Select
        id="sow-select"
        isDisabled={!project}
        options={options}
        onChange={(e) => setSelectedSow(e)}
        value={selectedSow}
        placeholder={!project ? "Selecciona un proyecto" : "Selecciona un SOW"}
      />
    </Box>
  );
};

export default SowSelector;
