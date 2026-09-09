import WeightChart from "../components/WeightChart";
import { getWeightHistory } from "../utils/weightStorage";

export default function Progress() {
  const history = getWeightHistory();

  const currentWeight =
    history.length > 0 ? history[history.length - 1].weight : 63;

  const startingWeight = history.length > 0 ? history[0].weight : currentWeight;

  const totalGain = currentWeight - startingWeight;
  const chartData = history.map((item) => ({
    date: item.date,
    weight: item.weight,
  }));
  const getTrend = () => {
  if (history.length < 2) {
    return {
      status: "neutral",
      message: "Need more weight entries",
    };
  }

  const gain =
    Number(currentWeight) -
    Number(startingWeight);

  if (gain >= 2) {
    return {
      status: "excellent",
      message:
        "Excellent progress. Keep calories and protein high.",
    };
  }

  if (gain >= 0.5) {
    return {
      status: "good",
      message:
        "Good muscle gain progress. Stay consistent.",
    };
  }

  return {
    status: "slow",
    message:
      "Progress is slow. Consider increasing calories.",
  };
};

const trend = getTrend();
  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold mb-6">Progress</h1>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Current Weight</p>

        <h2 className="text-2xl font-bold">{currentWeight} kg</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Starting Weight</p>

        <h2 className="text-2xl font-bold">{startingWeight} kg</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-6">
        <p className="text-zinc-400">Total Gain</p>

        <h2 className="text-2xl font-bold">
          {totalGain >= 0 ? "+" : ""}
          {totalGain.toFixed(1)} kg
        </h2>
      </div>
      <WeightChart data={chartData} />
      <div
  className={`mt-4 rounded-xl p-4 border ${
    trend.status === "excellent"
      ? "bg-green-900/30 border-green-700"
      : trend.status === "good"
      ? "bg-blue-900/30 border-blue-700"
      : "bg-yellow-900/30 border-yellow-700"
  }`}
>
  <h3 className="font-semibold">
    📈 Muscle Gain Trend
  </h3>

  <p className="mt-2">
    {trend.message}
  </p>
</div>
      <div className="bg-zinc-900 p-4 rounded-xl">
        <h3 className="font-semibold mb-3">Weight History</h3>

        {history.length === 0 ? (
          <p className="text-zinc-400">No weight entries yet</p>
        ) : (
          history
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-zinc-800 py-2"
              >
                <span>{item.date}</span>

                <span>{item.weight} kg</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
