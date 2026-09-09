import { workouts } from "../data/workouts";

export default function PRs() {
  const allExercises = [
    ...workouts.chestTri,
    ...workouts.backBi,
    ...workouts.shoulderLegs,
  ];

  const getPR = (exerciseName) => {
    const keys = Object.keys(localStorage);

    const matchingKey = keys.find((key) => key.endsWith(`-${exerciseName}`));

    if (!matchingKey) return null;

    const history = JSON.parse(localStorage.getItem(matchingKey)) || [];

    if (!history.length) return null;

    let bestWeight = 0;
    let bestReps = 0;

    history.forEach((entry) => {
      const maxReps = Math.max(...entry.sets.map((r) => Number(r) || 0));

      if (
        Number(entry.weight) > bestWeight ||
        (Number(entry.weight) === bestWeight && maxReps > bestReps)
      ) {
        bestWeight = Number(entry.weight);
        bestReps = maxReps;
      }
    });

    return {
      weight: bestWeight,
      reps: bestReps,
    };
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-3xl font-bold mb-6">🏆 Personal Records</h1>

      <div className="space-y-3">
        {allExercises.map((exercise) => {
          const pr = getPR(exercise.name);

          return (
            <div key={exercise.name} className="bg-zinc-900 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{exercise.name}</h3>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    exercise.type === "Compound"
                      ? "bg-green-700"
                      : "bg-blue-700"
                  }`}
                >
                  {exercise.type}
                </span>
              </div>

              {pr ? (
                <p className="mt-2 text-lg">
                  {pr.weight} kg × {pr.reps} reps
                </p>
              ) : (
                <p className="mt-2 text-zinc-500">No workout logged yet</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
