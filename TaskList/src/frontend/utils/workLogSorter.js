export const sortWorklogsByDay = (tasks) => {
  const result = {};
  tasks.forEach((task) => {
    task.worklogs.forEach((log) => {
      const date = log.started.split("T")[0];
      if (!result[date]) result[date] = [];
      result[date].push({
        key: task.key,
        summary: task.summary,
        user: log.author?.displayName || "Desconocido",
        time: log.timeSpent,
      });
    });
  });
  return result;
};
