import api, { route } from "@forge/api";

const buildJqlFromFilters = ({ ids, project, sow, billingType }) => {
  if (!ids || ids.length === 0) return "";

  const conditions = [`id in (${ids.join(",")})`]; // usamos IDs directamente

  if (project) {
    conditions.push(`project = "${project.value}"`);
  }

  if (sow) {
    conditions.push(`"SOW Number[Short text]" ~ "${sow}"`);
  }

  if (billingType && billingType.label !== "Ninguno") {
    conditions.push(`"Billing Type[Dropdown]" = "${billingType.label}"`);
  }

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
  sow,
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
    "customfield_10154",
    "customfield_10882", // Billing Type
    "customfield_10386",
    "customfield_10221", // SOW
  ];

  const chunks = chunkArray(ids, 250);
  const allIssues = [];

  for (const chunk of chunks) {
    const jql = buildJqlFromFilters({
      ids: chunk,
      project,
      sow,
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
