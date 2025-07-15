export const getReferenceKeyAndSummary = (task, allTasks) => {
  const isSubtask = task.fields?.issuetype?.name === "Subtask";
  const parent = task.fields?.parent;

  let base = task;

  if (isSubtask) {
    base = allTasks.get(parent.id);
  }

  const isEpic = base.fields?.parent?.fields?.issuetype?.name === "Epic";

  const keyReference = isEpic ? base.fields?.parent?.key : base.key;

  console.log(base)

  const summaryReference = isEpic
    ? base.fields?.parent?.fields?.summary
    : base.fields?.summary;

  return {
    key: keyReference,
    summary: summaryReference,
  };
};
