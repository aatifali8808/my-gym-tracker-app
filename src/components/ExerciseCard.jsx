import { useState, useEffect } from "react";

export default function ExerciseCard({ exercise, workoutType }) {
  const storageKey = `${workoutType}-${exercise.name}`;

  const [weight, setWeight] = useState(exercise.weight);
  const [sets, setSets] = useState(Array(exercise.sets).fill(""));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const data = JSON.parse(saved);

      setHistory(data);

      const latest = data[data.length - 1];

      if (latest) {
        setWeight(latest.weight);
        setSets(latest.sets);
      }
    } else {
      setWeight(exercise.weight);
      setSets(Array(exercise.sets).fill(""));
    }
  }, [storageKey, exercise]);

  const saveWorkout = () => {
    const existing = JSON.parse(localStorage.getItem(storageKey)) || [];

    const workoutEntry = {
      date: new Date().toLocaleDateString(),
      weight,
      sets,
    };

    existing.push(workoutEntry);

    localStorage.setItem(storageKey, JSON.stringify(existing));

    setHistory(existing);

    alert(`${exercise.name} Saved ✅`);
  };

  const updateSet = (index, value) => {
    const newSets = [...sets];
    newSets[index] = value;
    setSets(newSets);
  };

  const getPR = () => {
    if (!history.length) return null;

    let best = null;
    let bestScore = 0;

    history.forEach((workout) => {
      const maxReps = Math.max(...workout.sets.map((r) => Number(r) || 0));

      const score = Number(workout.weight) * maxReps;

      if (score > bestScore) {
        bestScore = score;

        best = {
          weight: workout.weight,
          reps: maxReps,
        };
      }
    });

    return best;
  };

  const pr = getPR();

  const getSuggestion = () => {
    const reps = sets.map((r) => Number(r) || 0);

    if (!reps.length) return null;

    const allTenOrMore = reps.every((rep) => rep >= 10);

    const veryLowPerformance = reps.every((rep) => rep <= 6);

    if (allTenOrMore) {
      return {
        type: "increase",
        message: `Try ${Number(weight) + 2.5} kg next session`,
      };
    }

    if (veryLowPerformance) {
      return {
        type: "reduce",
        message: "Weight may be too heavy",
      };
    }

    return {
      type: "stay",
      message: `Stay at ${weight} kg and aim for all sets at 10 reps`,
    };
  };

  const suggestion = getSuggestion();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{exercise.name}</h3>

        <span
          className={`text-xs px-2 py-1 rounded ${
            exercise.type === "Compound" ? "bg-green-700" : "bg-blue-700"
          }`}
        >
          {exercise.type}
        </span>
      </div>

      <div className="mt-4">
        <label className="text-sm text-zinc-400">Weight</label>

        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-black border border-zinc-700 rounded p-2 mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {Array.from({ length: exercise.sets }).map((_, index) => (
          <input
            key={index}
            type="number"
            placeholder={`Set ${index + 1}`}
            value={sets[index] || ""}
            onChange={(e) => updateSet(index, e.target.value)}
            className="bg-black border border-zinc-700 rounded p-2"
          />
        ))}
      </div>

      <button
        onClick={saveWorkout}
        className="w-full mt-4 bg-white text-black font-semibold py-2 rounded"
      >
        Save Workout
      </button>

      {pr && (
        <div className="mt-4 bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
          <h4 className="font-semibold">🏆 Personal Record</h4>

          <p className="mt-1">
            {pr.weight} kg × {pr.reps} reps
          </p>
        </div>
      )}

      {suggestion && (
        <div
          className={`mt-4 rounded-lg p-3 border ${
            suggestion.type === "increase"
              ? "bg-green-900/30 border-green-700"
              : suggestion.type === "reduce"
                ? "bg-red-900/30 border-red-700"
                : "bg-blue-900/30 border-blue-700"
          }`}
        >
          <h4 className="font-semibold">📈 Progression Suggestion</h4>

          <p className="mt-1">{suggestion.message}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <h4 className="font-semibold mb-2">Previous Workouts</h4>

          {history
            .slice(-3)
            .reverse()
            .map((item, index) => (
              <div key={index} className="bg-black rounded p-2 mb-2 text-sm">
                <p>📅 {item.date}</p>

                <p>🏋️ Weight: {item.weight}</p>

                <p>Reps: {item.sets.join(" - ")}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
