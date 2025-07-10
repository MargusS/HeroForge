// src/frontend/context/SearchContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";

const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [project, setProject] = useState("");
  const [selectedSow, setSelectedSow] = useState({ label: "Ninguno", value: null });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [billingType, setBillingType] = useState({ label: "Ninguno", value: null });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const canSearch = !!project && !!fromDate && !!toDate && !loading;
  const canExport = tasks.length > 0 && !loading;

  const value = useMemo(
    () => ({
      project,
      setProject,
      selectedSow,
      setSelectedSow,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      billingType,
      setBillingType,
      tasks,
      setTasks,
      loading,
      setLoading,
      canSearch,
      canExport,
    }),
    [project, selectedSow, fromDate, toDate, billingType, tasks, loading]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
