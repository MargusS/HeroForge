import api, { route } from "@forge/api";

const buildJqlFromFilters = ({ ids, project, sowKey, billingType }) => {
  if (!ids || ids.length === 0) return "";

  const conditions = [`id in (${ids.join(",")})`]; // usamos IDs directamente

  if (project) {
    conditions.push(`project = "${project.value}"`);
  }

  //   if (sowKey) {
  //     // Reemplaza por el campo real si usas customfield
  //     conditions.push(`"SOW[Dropdown]" = "${sowKey}"`);
  //   }

  //   if (billingType && billingType !== "ALL") {
  //     conditions.push(`"Billing Type" = "${billingType}"`);
  //   }

  return conditions.join(" AND ");
};

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const getFilteredIssuesByIds = async ({
  ids,
  project,
  sowKey,
  billingType,
}) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    console.warn("⚠️ No se pasaron IDs");
    return [];
  }

  const fields = [
    "summary",
    "issuetype",
    "project",
    "parent",
    "customfield_10154", // SOW
    "customfield_10882", // Billing Type
    "customfield_10386", // Equipo
    "customfield_10221",
  ];

  const chunks = chunkArray(ids, 250);
  const allIssues = [];

  for (const chunk of chunks) {
    const jql = buildJqlFromFilters({
      ids: chunk,
      project,
      sowKey,
      billingType,
    });
    console.log("🔍 JQL generado:", jql);

    try {
      const response = await api
        .asUser()
        .requestJira(route`/rest/api/3/search/jql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jql,
            fields,
            maxResults: 250, 
          }),
        });

      const data = await response.json();

      if (Array.isArray(data.issues)) {
        allIssues.push(...data.issues);
      } else {
        console.error("❌ Respuesta inesperada:", data);
      }
    } catch (err) {
      console.error("❌ Error en chunk JQL:", err);
    }
  }

  return allIssues;
};
