export const getReferenceKeyAndSummary = (task, allTasks) => {
  const isSubtask = task.fields?.issuetype?.name === "Subtask";
  const parent = task.fields?.parent;

  let base = task;

  if (isSubtask) {
    base = allTasks.find((t) => t.key === parent.key) || parent;
  }

  console.log("Base task for reference:", base);

  const isEpic = base.fields?.parent?.fields?.issuetype?.name === "Epic";

  const keyReference = isEpic ? base.fields?.parent?.key : base.key;

  const summaryReference = isEpic ? base.fields?.parent?.fields?.summary : base.summary;
 
  return {
    key: keyReference,
    summary: summaryReference,
  };
};
