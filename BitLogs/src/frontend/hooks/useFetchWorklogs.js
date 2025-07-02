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
      const worklogIds = await invoke("getWorklogsInDateRange", {
        fromDate: Date.parse(fromDate),
        toDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 5
        ).getTime(), // +5 days
      });

      if (worklogIds.length === 0) {
        console.log("🟡 No se encontraron worklogs");
        setTasks([]);
        return;
      }

      // Paso 2: obtener detalles de esos logs
      const worklogs = await invoke("getWorklogDetailsByIds", {
        ids: worklogIds,
      });

      const endOfDay = new Date(Date.parse(toDate));
      endOfDay.setHours(23, 59, 59, 999);
      // Paso 3: filtrar logs por campo 'started' entre fromDate y toDate
      const filteredWorklogs = worklogs.filter((log) => {
        const started = new Date(log.started).getTime();
        return started >= Date.parse(fromDate) && started <= endOfDay.getTime();
      });

      // Paso 4: extraer IDs únicos de issues
      const issueIds = [
        ...new Set(filteredWorklogs.map((log) => log.issueId).filter(Boolean)),
      ];

	  console.log(selectedSow);
      // Paso 5: aplicar filtros adicionales vía JQL en el backend
      const filteredIssues = await invoke("getFilteredIssuesByIds", {
        ids: issueIds,
        project,
        sowKey: selectedSow?.key || null,
        billingType,
      });

      // Paso 6: mapear las issues a sus logs
      const issueMap = new Map(filteredIssues.map((i) => [i.id, i]));

      const enrichedWorklogs = filteredWorklogs
        .filter((log) => issueMap.has(log.issueId)) // solo logs con issue válida
        .map((log) => ({
          ...log,
          issue: issueMap.get(log.issueId),
        }));

      console.log(enrichedWorklogs);

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
