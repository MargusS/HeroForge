// src/frontend/context/SearchContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";

const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [project, setProject] = useState("");
  const [selectedSow, setSelectedSow] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [billingType, setBillingType] = useState("ALL");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const canSearch = !!project && !!selectedMonth && !loading;
  const canExport = tasks.length > 0 && !loading;

  const value = useMemo(
    () => ({
      project,
      setProject,
      selectedSow,
      setSelectedSow,
      selectedMonth,
      setSelectedMonth,
      billingType,
      setBillingType,
      tasks,
      setTasks,
      loading,
      setLoading,
      canSearch,
      canExport,
    }),
    [project, selectedSow, selectedMonth, billingType, tasks, loading]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
