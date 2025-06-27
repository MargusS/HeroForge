import { invoke } from "@forge/bridge";
import { useSearchContext } from "../context/SearchContext";

const useSearchTasks = () => {
  const { project, fromDate, toDate, billingType, setTasks, setLoading } =
    useSearchContext();

  const search = async () => {
    if (!project || !fromDate || !toDate) return;

    setTasks([]);
    setLoading(true);

    try {
      let startAt = 0;
      const batchSize = 50;

      while (true) {
        const result = await invoke("getIssuesWithRecentWorklogsBatch", {
          projectKey: project,
          fromDate,
          toDate,
          startAt,
          billingType,
          batchSize,
        });

        setTasks((prev) => [...prev, ...result.issues]);

        if (result.isLastBatch) break;
        startAt += batchSize;
      }
    } catch (err) {
      console.error("Error al buscar tareas:", err);
    }

    setLoading(false);
  };

  return search;
};

export default useSearchTasks;
