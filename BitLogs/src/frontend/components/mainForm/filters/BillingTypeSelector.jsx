import React, { useEffect, useState } from "react";
import { Select, Option, Box, Label } from "@forge/react";
import { invoke } from "@forge/bridge";
import { useSearchContext } from "../../../context/SearchContext";

const BillingTypeSelector = () => {
  const { project, billingType, setBillingType } = useSearchContext();
  const [billingTypes, setBillingTypes] = useState([]);

  useEffect(() => {
    const fetchBillingTypes = async () => {
      const result = await invoke("getBillingTypes");
      if (Array.isArray(result)) {
        const clean = result.filter((opt) => opt && opt.id && opt.value);
        setBillingTypes(clean);
      } else {
        console.warn("Opciones de billingType no válidas:", result);
      }
    };

    fetchBillingTypes();
  }, []);

  const options = [
    { label: "Ninguno", value: null }, // Resetear selección
    ...billingTypes.map((opt) => ({
      label: opt.value,
      value: opt.id,
    })),
  ];

  return (
    <Box paddingBlockEnd="space.200" xcss={{ width: "100%" }}>
      <Label labelFor="billing-type-select">Facturación</Label>
      <Select
        id="billing-type-select"
        isDisabled={!project}
        options={options}
        placeholder={
          !project ? "Selecciona un proyecto" : "Selecciona una opción"
        }
        onChange={(e) => setBillingType(e?.value)}
        value={billingType}
      />
    </Box>
  );
};

export default BillingTypeSelector;
