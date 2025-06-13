import Resolver from '@forge/resolver';
import { requestJira } from '@forge/api';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);
  return 'Hello, world!';
});

resolver.define('getProjects', async () => {
  const response = await requestJira('/rest/api/3/project/search');
  const data = await response.json();
  return data.values.map((p) => ({ key: p.key, name: p.name }));
});

resolver.define('getTasks', async ({ payload }) => {
  const { projectKey } = payload;
  const jql = `project = ${projectKey} AND created >= -30d`;
  const response = await requestJira(`/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
  const data = await response.json();
  return data.issues.map((issue) => ({
    key: issue.key,
    summary: issue.fields.summary,
  }));
});

export const handler = resolver.getDefinitions();
