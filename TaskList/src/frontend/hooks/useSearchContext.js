import { invoke } from "@forge/bridge";
import { useSearchContext } from "../context/SearchContext";

const useSearchTasks = () => {
  const {
    project,
    selectedMonth,
    setTasks,
    setLoading,
  } = useSearchContext();

  const search = async () => {
    if (!project || !selectedMonth) return;

    setTasks([]);
    setLoading(true);

    try {
      let startAt = 0;
      const batchSize = 50;

      while (true) {
        const result = await invoke("getIssuesWithRecentWorklogsBatch", {
          projectKey: project,
          year: selectedMonth.year,
          month: selectedMonth.month,
          startAt,
          batchSize,
        });

        setTasks(prev => [...prev, ...result.issues]);

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
