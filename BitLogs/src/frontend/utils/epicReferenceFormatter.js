export const getReferenceKeyAndSummary = (task, allTasks) => {
  const isSubtask = task.fields?.issuetype?.name === "Subtask";
  const parent = task.fields?.parent;

  let base = task;

  if (isSubtask && parent) {
    base = allTasks.get(parent.id);
  }

  const parentIssueType = base.fields?.parent?.fields?.issuetype?.name;

  const isGroupParent =
    parentIssueType === "Epic" ||
    parentIssueType === "Service request" ||
    parentIssueType === "Support";

  const keyReference = isGroupParent ? base.fields?.parent?.key : base.key;

  const summaryReference = isGroupParent
    ? base.fields?.parent?.fields?.summary
    : base.fields?.summary;

  const typeReference = isGroupParent
    ? parentIssueType
    : base.fields?.issuetype?.name;

  return {
    key: keyReference,
    summary: summaryReference,
    type: typeReference,
  };
};
