import Resolver from "@forge/resolver";
import { getProjects } from "./getProjects";
import { getIssuesWithRecentWorklogsBatch } from "./getIssuesWithRecentWorklogsBatch";
import { getSowsByProject } from "./getSowsByProject";

const resolver = new Resolver();

resolver.define("getProjects", getProjects);

resolver.define("getSowsByProject", async ({ payload }) => {
  return await getSowsByProject({ payload });
});

resolver.define("getIssuesWithRecentWorklogsBatch", async ({ payload }) => {
  return await getIssuesWithRecentWorklogsBatch(payload);
});


export const handler = resolver.getDefinitions();
