export const parseTimeSpentToDecimal = (timeStr) => {
  if (!timeStr) return "0";

  const hoursMatch = timeStr.match(/(\d+)h/);
  const minutesMatch = timeStr.match(/(\d+)m/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  const decimal = hours + minutes / 60;
  return decimal.toFixed(2).replace(".", ",");
};
