export const sortWorklogsByDay = (worklogs) => {
  const result = {};

  worklogs.forEach((log) => {
    const date = log.started.split("T")[0];

    if (!result[date]) {
      result[date] = [];
    }

    result[date].push({
      key: log.issue?.key || "SIN-KEY",
      summary: log.issue?.fields?.summary || "Sin resumen",
      user: log.author?.displayName || "Desconocido",
      time: log.timeSpent,
    });
  });

  return result;
};
