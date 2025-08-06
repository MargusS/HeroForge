import Resolver from "@forge/resolver";
import { getProjects } from "./main-form/getProjects";
import { getSowsByProject } from "./main-form/getSowsByProject";
import { getBillingTypes } from "./main-form/getBillingTypes";
import { getWorklogsInDateRange } from "./task-search/getWorklogsInDateRange";
import { getWorklogDetailsByIds } from "./task-search/getWorklogDetailsByIds";
import { getFilteredIssuesByIds } from "./task-search/getFilteredIssuesByIds";
import { getIssueByKey } from "./task-search/getIssueByKey";

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

resolver.define("getIssueByKey", async ({ payload }) =>
  getIssueByKey({ payload })
);

export const handler = resolver.getDefinitions();
