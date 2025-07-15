import { Box } from "@forge/react";
import React ,{ useEffect, useMemo, useState } from "react";
import {
	filterEntriesByType,
	generateSummaryEntries,
} from "../../utils/summaryProcessor";
import WorklogsNotFound from "../shared/WorklogsNotFound";
import SummaryFilters from "./SummaryFilters";
import SummaryTable from "./SummaryTable";

const SummaryWrapper = ({ tasks }) => {
  const [filterType, setFilterType] = useState("ALL");
  const [entries, setEntries] = useState([]);

  const issueMap = useMemo(() => {
    const map = new Map();
    for (const task of tasks) {
      map.set(task.id, task.issue);
    }
    return map;
  }, [tasks]);

  useEffect(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const result = generateSummaryEntries(safeTasks, issueMap);
    setEntries(result);
  }, [tasks, issueMap]);

  const filteredEntries = useMemo(
    () => filterEntriesByType(entries, filterType),
    [entries, filterType]
  );

  const total = useMemo(() => {
    return filteredEntries.reduce(
      (acc, r) => acc + parseFloat(r.totalHours.replace(",", ".")),
      0
    );
  }, [filteredEntries]);

  if (!entries || entries.length === 0) {
    return <WorklogsNotFound />;
  }

  return (
    <Box
      xcss={{
        width: "100%",
        padding: "space.100",
      }}
    >
      <SummaryFilters filterType={filterType} setFilterType={setFilterType} />
      <SummaryTable entries={filteredEntries} total={total} />
    </Box>
  );
};

export default SummaryWrapper;
