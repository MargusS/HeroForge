import api, { route } from "@forge/api";

/**
 * Dado un array de IDs, devuelve los detalles de los worklogs.
 */
export const getWorklogDetailsByIds = async ({ ids }) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.warn("⛔ Lista de IDs vacía");
    return [];
  }

  const batchSize = 200;
  const allResults = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);

    try {
      const response = await api
        .asUser()
        .requestJira(route`/rest/api/3/worklog/list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: batch }),
        });

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("⚠️ Formato inesperado en batch:", data);
        continue;
      }

      allResults.push(...data);
    } catch (error) {
      console.error(`❌ Error en batch ${i / batchSize + 1}:`, error);
    }
  }

  console.log(`✅ Total de logs recibidos: ${allResults.length}`);
  return allResults;
};
