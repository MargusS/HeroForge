import api, { route } from "@forge/api";

/**
 * Recupera todos los worklogs actualizados entre fromDate y toDate (en milisegundos UNIX epoch).
 */
export const getWorklogsInDateRange = async ({ fromDate, toDate }) => {

  const collectedIds = [];
  let nextSince = fromDate;
  let keepFetching = true;

  while (keepFetching) {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/worklog/updated?since=${nextSince}`);

    const data = await response.json();

    if (!data?.values) break;

    for (const entry of data.values) {
      const { worklogId, updatedTime } = entry;

      if (updatedTime > toDate) {
        keepFetching = false;
        break;
      }

      collectedIds.push(worklogId);
    }

    if (data.lastPage || !data.nextPage) break;

    const url = new URL(data.nextPage);
    nextSince = url.searchParams.get("since");
  }

  console.log("✅ Worklog IDs totales:", collectedIds.length);
  return collectedIds;
};
