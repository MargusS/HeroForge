import api, { route } from "@forge/api";

export const getSowsByProject = async ({ payload }) => {
  const { value } = payload;
  if (!value) return [];

  const jql = `project = "${value}" AND issuetype = "SOW" ORDER BY created DESC`;
  const fields = ["summary", "key","customfield_10221"]; 

  try {
    const response = await api.asUser().requestJira(route`/rest/api/3/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jql,
        maxResults: 50,
        fields,
      }),
    });
    const data = await response.json();
	console.log(data);

    if (!data || !Array.isArray(data.issues)) {
      console.error("Respuesta inesperada de Jira:", data);
      return [];
    }

    return data.issues.map(({ key, fields }) => ({
      key,
      summary: fields.summary,
	  sow: fields.customfield_10221
    }));
  } catch (error) {
    console.error("Error fetching SOWs:", error);
    return [];
  }
};
