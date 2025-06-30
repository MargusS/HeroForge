import Resolver from "@forge/resolver";
import { getProjects } from "./mainForm/getProjects";
import { getSowsByProject } from "./mainForm/getSowsByProject";
import { getBillingTypes } from "./mainForm/getBillingTypes";
import { getWorklogsInDateRange } from "./mainForm/getWorklogsInDateRange";
import { getWorklogDetailsByIds } from "./mainForm/getWorklogDetailsByIds";
import { getFilteredIssuesByIds } from "./mainForm/getFilteredIssuesByIds";

const resolver = new Resolver();

resolver.define("getWorklogsInDateRange", async ({ payload }) => {
  return await getWorklogsInDateRange(payload);
});

resolver.define("getWorklogDetailsByIds", async ({ payload }) => {
  return await getWorklogDetailsByIds(payload);
});

resolver.define("getFilteredIssuesByIds", async ({ payload }) => {
  return await getFilteredIssuesByIds(payload);
});

resolver.define("getProjects", getProjects);

resolver.define("getSowsByProject", async ({ payload }) => {
  return await getSowsByProject({ payload });
});

resolver.define("getBillingTypes", getBillingTypes);

export const handler = resolver.getDefinitions();
