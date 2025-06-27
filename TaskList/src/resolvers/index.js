import Resolver from "@forge/resolver";
import { getProjects } from "./mainForm/getProjects";
import { getIssuesWithRecentWorklogsBatch } from "./mainForm/getIssuesWithRecentWorklogsBatch";
import { getSowsByProject } from "./mainForm/getSowsByProject";
import { getBillingTypes } from "./mainForm/getBillingTypes";

const resolver = new Resolver();

resolver.define("getProjects", getProjects);

resolver.define("getSowsByProject", async ({ payload }) => {
  return await getSowsByProject({ payload });
});

resolver.define("getIssuesWithRecentWorklogsBatch", async ({ payload }) => {
  return await getIssuesWithRecentWorklogsBatch(payload);
});

resolver.define("getBillingTypes", getBillingTypes);

export const handler = resolver.getDefinitions();
