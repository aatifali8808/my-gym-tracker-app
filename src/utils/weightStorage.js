export const getWeightHistory = () => {
  return JSON.parse(localStorage.getItem("weightHistory")) || [];
};

export const saveWeightEntry = (weight) => {
  const history = getWeightHistory();

  history.push({
    weight: Number(weight),
    date: new Date().toLocaleDateString(),
  });

  localStorage.setItem("weightHistory", JSON.stringify(history));
};

export const getCurrentWeight = () => {
  const history = getWeightHistory();

  if (!history.length) return 63;

  return history[history.length - 1].weight;
};
