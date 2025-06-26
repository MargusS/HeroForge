export const getDateRangeForMonth = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return { firstDay, lastDay };
};

export const getStartDateForPreviousMonth = (year, month) => {
  const fromDate = new Date(
    Date.UTC(month === 1 ? year - 1 : year, month === 1 ? 11 : month - 2, 1)
  );
  return fromDate.toISOString().split("T")[0];
};
