import { exportBackup, importBackup } from "../utils/backup";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  getCurrentWeight,
  saveWeightEntry,
  getWeightHistory,
} from "../utils/weightStorage";

export default function Dashboard() {
  const [currentWeight, setCurrentWeight] = useState(getCurrentWeight());

  const [newWeight, setNewWeight] = useState("");

  const [history, setHistory] = useState(getWeightHistory());

  const getWorkoutStats = () => {
    let totalWorkouts = 0;
    let totalExercises = 0;
    let lastWorkoutDate = null;

    Object.keys(localStorage).forEach((key) => {
      const data = localStorage.getItem(key);

      try {
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].sets) {
          totalExercises++;

          totalWorkouts += parsed.length;

          const latest = parsed[parsed.length - 1];

          if (
            latest.date &&
            (!lastWorkoutDate ||
              new Date(latest.date) > new Date(lastWorkoutDate))
          ) {
            lastWorkoutDate = latest.date;
          }
        }
      } catch {
        // ignore non-workout data
      }
    });

    return {
      totalWorkouts,
      totalExercises,
      lastWorkoutDate,
    };
  };

  const stats = getWorkoutStats();

  const getCompletedExercises = () => {
    let completed = 0;

    Object.keys(localStorage).forEach((key) => {
      const data = localStorage.getItem(key);

      try {
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].sets) {
          completed++;
        }
      } catch {}
    });

    return completed;
  };

  const completedExercises = getCompletedExercises();
  const getStreakStats = () => {
    const allDates = new Set();

    Object.keys(localStorage).forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));

        if (Array.isArray(data) && data.length > 0 && data[0].sets) {
          data.forEach((entry) => {
            if (entry.date) {
              allDates.add(entry.date);
            }
          });
        }
      } catch {}
    });

    const dates = [...allDates].map((d) => new Date(d)).sort((a, b) => a - b);

    if (!dates.length) {
      return {
        currentStreak: 0,
        bestStreak: 0,
      };
    }

    let bestStreak = 1;
    let currentRun = 1;

    for (let i = 1; i < dates.length; i++) {
      const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentRun++;
        bestStreak = Math.max(bestStreak, currentRun);
      } else {
        currentRun = 1;
      }
    }

    const today = new Date();

    const latest = dates[dates.length - 1];

    const gap = Math.floor((today - latest) / (1000 * 60 * 60 * 24));

    return {
      currentStreak: gap <= 1 ? currentRun : 0,
      bestStreak,
    };
  };

  const streakStats = getStreakStats();
  const handleSaveWeight = () => {
    if (!newWeight) return;

    saveWeightEntry(newWeight);

    setCurrentWeight(Number(newWeight));
    setHistory(getWeightHistory());

    setNewWeight("");
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    importBackup(file, () => {
      window.location.reload();
    });
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">My Gym Tracker</h1>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Current Weight</p>

        <h2 className="text-2xl font-bold">{currentWeight} kg</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Goal Weight</p>

        <h2 className="text-2xl font-bold">70 kg</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Total Workouts Logged</p>

        <h2 className="text-2xl font-bold">{stats.totalWorkouts}</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Exercises Tracked</p>

        <h2 className="text-2xl font-bold">{stats.totalExercises}</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Exercises Completed</p>

        <h2 className="text-2xl font-bold">{completedExercises} / 23</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">Last Workout</p>

        <h2 className="text-lg font-bold">
          {stats.lastWorkoutDate || "No workouts yet"}
        </h2>
      </div>
      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">🔥 Current Streak</p>

        <h2 className="text-2xl font-bold">{streakStats.currentStreak} days</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="text-zinc-400">🏆 Best Streak</p>

        <h2 className="text-2xl font-bold">{streakStats.bestStreak} days</h2>
      </div>
      <div className="bg-zinc-900 p-4 rounded-xl mb-4">
        <p className="mb-2">Update Weight</p>

        <input
          type="number"
          step="0.1"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Enter weight"
          className="w-full bg-black border border-zinc-700 rounded p-2 mb-2"
        />

        <button
          onClick={handleSaveWeight}
          className="w-full bg-white text-black font-semibold py-2 rounded"
        >
          Save Weight
        </button>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl mb-6">
        <h3 className="font-semibold mb-2">Weight History</h3>

        {history.length === 0 ? (
          <p className="text-zinc-400">No entries yet</p>
        ) : (
          history
            .slice(-5)
            .reverse()
            .map((item, index) => (
              <div key={index} className="mb-2 text-sm">
                📅 {item.date} — ⚖️ {item.weight} kg
              </div>
            ))
        )}
      </div>

      <Link
        to="/workout"
        className="block text-center bg-white text-black font-semibold py-3 rounded-xl"
      >
        Start Workout 💪
      </Link>
      <button
        onClick={exportBackup}
        className="w-full mt-4 bg-zinc-800 text-white font-semibold py-3 rounded-xl"
      >
        Export Backup 📦
      </button>
      <label className="block mt-4 bg-zinc-700 text-center text-white font-semibold py-3 rounded-xl cursor-pointer">
        Import Backup 📥
        <input
          type="file"
          accept=".json"
          onChange={handleImportBackup}
          className="hidden"
        />
      </label>
    </div>
  );
}
