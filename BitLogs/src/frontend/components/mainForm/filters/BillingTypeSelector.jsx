import React, { useEffect, useState } from "react";
import { Select, Option, Box, Label } from "@forge/react";
import { invoke } from "@forge/bridge";
import { useSearchContext } from "../../../context/SearchContext";

const BillingTypeSelector = () => {
  const { project, billingType, setBillingType } = useSearchContext();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    invoke("getBillingTypes").then((opts) => {
      if (Array.isArray(opts)) {
        const clean = opts.filter((opt) => opt && opt.id && opt.value);
        setOptions(clean);
      } else {
        console.warn("Opciones de billingType no válidas:", opts);
      }
    });
  }, []);

  const handleChange = (value) => {
    setBillingType(value);
  };

  return (
    <Box paddingBlockEnd="space.200" xcss={{ width: "100%" }}>
      <Label labelFor="billing-type-select">Facturación</Label>
      <Select
        id="billing-type-select"
        label="Tipo de facturación"
        isDisabled={!project}
        placeholder={
          !project ? "Selecciona un proyecto" : "Selecciona una opción"
        }
        onChange={handleChange}
        value={billingType}
      >
        {options
          .filter((opt) => opt && opt.id && opt.value)
          .map((opt) => (
            <Option key={opt.id} label={opt.value} value={opt.value} />
          ))}
      </Select>
    </Box>
  );
};

export default BillingTypeSelector;
