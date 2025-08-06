import api, { route } from "@forge/api";

export const getProjects = async () => {
  try {
    const response = await api.asUser().requestJira(route`/rest/api/3/project/search`);
    const data = await response.json();
    return data.values.map(({ id, key, name }) => ({ id, key, name }));
  } catch (error) {
    return [];
  }
};
