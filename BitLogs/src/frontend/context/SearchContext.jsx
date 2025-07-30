// src/frontend/context/SearchContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";

const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
	const [projects, setProjects] = useState([]);
	const [selectedSow, setSelectedSow] = useState({ label: "Ninguno", value: null });
	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [billingType, setBillingType] = useState({ label: "Ninguno", value: null });
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);

	const canSearch = projects.length > 0 && !!fromDate && !!toDate && !loading;
	const canExport = tasks.length > 0 && !loading;

	const value = useMemo(
		() => ({
			projects,
			setProjects,
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
		[projects, selectedSow, fromDate, toDate, billingType, tasks, loading]
	);

	return (
		<SearchContext.Provider value={value}>{children}</SearchContext.Provider>
	);
};
