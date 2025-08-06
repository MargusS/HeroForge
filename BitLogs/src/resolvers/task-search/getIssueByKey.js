import api, { route } from "@forge/api";

export const getIssueByKey = async ({ payload }) => {
  const { key } = payload;
  if (!key) return null;

  // Buscamos la issue por JQL
  const response = await api.asUser().requestJira(
    route`/rest/api/3/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jql: `key = "${key}"`,
        maxResults: 1,
        fields: [
          "summary",
          "key",
          "issuetype",
          "parent"
        ],
      }),
    }
  );
  const data = await response.json();
  return data.issues?.[0] || null;
};