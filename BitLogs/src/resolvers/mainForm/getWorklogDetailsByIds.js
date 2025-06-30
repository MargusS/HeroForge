import api, { route } from "@forge/api";

/**
 * Dado un array de IDs, devuelve los detalles de los worklogs.
 */
export const getWorklogDetailsByIds = async ({ ids }) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.warn("⛔ Lista de IDs vacía");
    return [];
  }

  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/worklog/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("⚠️ Formato inesperado:", data);
      return [];
    }

    console.log(`📦 Detalles de ${data.length} logs recibidos`);
    return data;
  } catch (error) {
    console.error("❌ Error al recuperar detalles de logs:", error);
    return [];
  }
};
