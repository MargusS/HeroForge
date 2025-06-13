import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

resolver.define('getProjects', async () => {
  const response = await api.asApp().requestJira('/rest/api/3/project/search');
  const data = await response.json();
  return data.values.map((p) => ({ key: p.key, name: p.name }));
});

resolver.define('getIssues', async ({ payload }) => {
  const { projectKey } = payload;
  const jql = `project=${projectKey} AND updated >= -30d ORDER BY updated DESC`;
  const search = await api
    .asApp()
    .requestJira(
      `/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=summary`
    );
  const { issues } = await search.json();
  return issues.map((i) => ({ key: i.key, summary: i.fields.summary }));
});

export const handler = resolver.getDefinitions();
