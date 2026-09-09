import { useState } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { workouts } from "../data/workouts";

export default function Workout() {
  const [selectedWorkout, setSelectedWorkout] = useState("chestTri");

  const tabs = [
    {
      key: "chestTri",
      label: "Chest + Tri",
    },
    {
      key: "backBi",
      label: "Back + Bi",
    },
    {
      key: "shoulderLegs",
      label: "Shoulder + Legs",
    },
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Gym Tracker App</h1>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedWorkout(tab.key)}
            className={`rounded-lg py-3 px-2 text-sm font-semibold transition-all
              ${
                selectedWorkout === tab.key
                  ? "bg-white text-black"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {workouts[selectedWorkout].map((exercise, index) => (
        <ExerciseCard
          key={`${selectedWorkout}-${exercise.name}`}
          exercise={exercise}
          workoutType={selectedWorkout}
        />
      ))}
    </div>
  );
}
