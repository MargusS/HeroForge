import api, { route } from "@forge/api";

/**
 * Recupera todos los worklogs actualizados entre fromDate y toDate (en milisegundos UNIX epoch).
 */

const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
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

  const batches = chunkArray(collectedIds, 500);

  console.log(
    `✅ Total worklogs: ${collectedIds.length}, Batches: ${batches.length}`
  );
  return { batches };
};
