import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);
  return 'Hello, world!';
});

resolver.define('getProjects', async () => {
  const response = await api.asUser().requestJira('/rest/api/3/project/search');
  const data = await response.json();
  return data.values.map(({ id, key, name }) => ({ id, key, name }));
});

resolver.define('searchTasks', async ({ payload }) => {
  const { projectKey } = payload;
  if (!projectKey) {
    return [];
  }
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const jql = `project = ${projectKey} AND updated >= ${date.toISOString().split('T')[0]}`;
  const response = await api.asUser().requestJira(`/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
  const data = await response.json();
  return data.issues.map(({ key, fields }) => ({ key, summary: fields.summary }));
});

export const handler = resolver.getDefinitions();
