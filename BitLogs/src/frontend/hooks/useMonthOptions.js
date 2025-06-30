const useMonthOptions = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const options = [];

  for (let y = currentYear - 1; y <= currentYear; y++) {
    const endMonth = y === currentYear ? currentMonth : 11;
    for (let m = 0; m <= endMonth; m++) {
      const date = new Date(Date.UTC(y, m, 1));
      const label = date.toLocaleString("es-ES", { month: "long" });
      options.push({
        label: `${label.charAt(0).toUpperCase() + label.slice(1)} ${y}`,
        value: `${y}-${(m + 1).toString().padStart(2, "0")}`,
      });
    }
  }

  return options.reverse();
};

export default useMonthOptions;
