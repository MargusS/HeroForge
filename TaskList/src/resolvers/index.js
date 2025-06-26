import Resolver from "@forge/resolver";
import { getProjects } from "./getProjects";
import { getIssuesWithRecentWorklogsBatch } from "./getIssuesWithRecentWorklogsBatch";

const resolver = new Resolver();

resolver.define("getProjects", getProjects);

resolver.define("getIssuesWithRecentWorklogsBatch", async ({ payload }) => {
  return await getIssuesWithRecentWorklogsBatch(payload);
});

export const handler = resolver.getDefinitions();
