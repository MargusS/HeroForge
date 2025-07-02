import { useCallback } from "react";
import { invoke } from "@forge/bridge";
import { useSearchContext } from "../context/SearchContext";

const useFetchWorklogs = () => {
  const {
    fromDate,
    toDate,
    project,
    selectedSow,
    billingType,
    setLoading,
    setTasks,
  } = useSearchContext();

  const fetchWorklogs = useCallback(async () => {
    if (!fromDate || !toDate) {
      console.warn("❗ Fechas no definidas");
      return;
    }

    try {
      setLoading(true);

      const now = new Date();
      // Paso 1: obtener IDs de logs entre las fechas
      const { batches } = await invoke("getWorklogsInDateRange", {
        fromDate: Date.parse(fromDate),
        toDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5
        ).getTime(), // +5 days
      });

      if (!batches || batches.length === 0) {
        console.log("🟡 No se encontraron worklogs");
        setTasks([]);
        return;
      }

      const endOfDay = new Date(Date.parse(toDate));
      endOfDay.setHours(23, 59, 59, 999);

      const allWorklogs = [];

      // Paso 2: procesar batch por batch
      for (const batch of batches) {
        const details = await invoke("getWorklogDetailsByIds", { ids: batch });

        const filtered = details.filter((log) => {
          const started = new Date(log.started).getTime();
          return (
            started >= Date.parse(fromDate) && started <= endOfDay.getTime()
          );
        });

        allWorklogs.push(...filtered);
      }

      // Paso 3: extraer IDs únicos de issues
      const issueIds = [
        ...new Set(allWorklogs.map((log) => log.issueId).filter(Boolean)),
      ];

      // Paso 4: aplicar filtros adicionales vía JQL en el backend
      const filteredIssues = await invoke("getFilteredIssuesByIds", {
        ids: issueIds,
        project,
        sow: selectedSow?.sow || null,
        billingType,
      });

      // Paso 5: mapear las issues a sus logs
      const issueMap = new Map(filteredIssues.map((i) => [i.id, i]));

      const enrichedWorklogs = allWorklogs
        .filter((log) => issueMap.has(log.issueId))
        .map((log) => ({
          ...log,
          issue: issueMap.get(log.issueId),
        }));

      setTasks(enrichedWorklogs);
    } catch (err) {
      console.error("❌ Error durante búsqueda de worklogs:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [
    fromDate,
    toDate,
    project,
    selectedSow,
    billingType,
    setLoading,
    setTasks,
  ]);

  return fetchWorklogs;
};

export default useFetchWorklogs;
