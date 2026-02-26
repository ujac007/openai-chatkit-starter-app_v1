"use client";

import { useMemo, useState } from "react";

type Goal = "Fat burn" | "Endurance" | "Strength" | "Mobility";
type IntervalPattern = "60/30" | "30/15";
type DurationOption = 3 | 7 | 10 | 15 | 20;

type Workout = {
  id: string;
  name: string;
  category: "Calisthenics" | "Weights" | "Strength";
};

const durations: DurationOption[] = [3, 7, 10, 15, 20];
const intervalPatterns: { id: IntervalPattern; label: string }[] = [
  { id: "60/30", label: "1 min workout / 30 sec rest" },
  { id: "30/15", label: "30 sec workout / 15 sec rest" },
];

const workoutLibrary: Workout[] = [
  { id: "jumping-jacks", name: "Jumping Jacks", category: "Calisthenics" },
  { id: "mountain-climbers", name: "Mountain Climbers", category: "Calisthenics" },
  { id: "burpees", name: "Burpees", category: "Calisthenics" },
  { id: "push-ups", name: "Push-Ups", category: "Strength" },
  { id: "dumbbell-thrusters", name: "Dumbbell Thrusters", category: "Weights" },
  { id: "kettlebell-swings", name: "Kettlebell Swings", category: "Weights" },
  { id: "goblet-squats", name: "Goblet Squats", category: "Strength" },
  { id: "plank-shoulder-taps", name: "Plank Shoulder Taps", category: "Strength" },
];

const aiPresets: Record<Goal, string[]> = {
  "Fat burn": ["burpees", "mountain-climbers", "jumping-jacks", "kettlebell-swings"],
  Endurance: ["jumping-jacks", "push-ups", "mountain-climbers", "plank-shoulder-taps"],
  Strength: ["goblet-squats", "dumbbell-thrusters", "push-ups", "kettlebell-swings"],
  Mobility: ["plank-shoulder-taps", "jumping-jacks", "goblet-squats", "mountain-climbers"],
};

export default function App() {
  const [duration, setDuration] = useState<DurationOption>(10);
  const [intervalPattern, setIntervalPattern] = useState<IntervalPattern>("60/30");
  const [goal, setGoal] = useState<Goal>("Fat burn");
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<string[]>(["jumping-jacks", "push-ups", "kettlebell-swings"]);

  const selectedWorkouts = useMemo(
    () => selectedWorkoutIds.map((id) => workoutLibrary.find((workout) => workout.id === id)).filter(Boolean) as Workout[],
    [selectedWorkoutIds],
  );

  const totalSecondsPerRound = intervalPattern === "60/30" ? 90 : 45;
  const estimatedRounds = Math.max(1, Math.floor((duration * 60) / totalSecondsPerRound));

  const toggleWorkout = (workoutId: string) => {
    setSelectedWorkoutIds((current) =>
      current.includes(workoutId)
        ? current.filter((id) => id !== workoutId)
        : [...current, workoutId],
    );
  };

  const moveWorkout = (index: number, direction: "up" | "down") => {
    setSelectedWorkoutIds((current) => {
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= current.length) {
        return current;
      }
      const updated = [...current];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
  };

  const applyAiSelection = () => {
    setSelectedWorkoutIds(aiPresets[goal]);
  };

  const applyAiOrder = () => {
    setSelectedWorkoutIds((current) => [...current].sort((a, b) => a.localeCompare(b)));
  };

  return (
    <main className="flex min-h-screen justify-center bg-slate-900 p-4 text-white">
      <section className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-800 p-5 shadow-2xl">
        <header className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">HIIT Studio</p>
          <h1 className="text-2xl font-semibold">Build your workout</h1>
          <p className="mt-1 text-sm text-slate-300">Create your own routine or let AI generate one for your goal.</p>
        </header>

        <div className="space-y-5">
          <div>
            <h2 className="mb-2 text-sm font-medium text-slate-200">Workout length</h2>
            <div className="grid grid-cols-5 gap-2">
              {durations.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDuration(option)}
                  className={`rounded-xl px-2 py-2 text-sm font-medium transition ${
                    duration === option ? "bg-emerald-400 text-slate-900" : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {option}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-medium text-slate-200">Intervals</h2>
            <div className="space-y-2">
              {intervalPatterns.map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setIntervalPattern(pattern.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    intervalPattern === pattern.id
                      ? "border-emerald-300 bg-emerald-200/20 text-emerald-100"
                      : "border-slate-600 bg-slate-700 text-slate-200"
                  }`}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">Workout selection</h2>
              <button
                type="button"
                onClick={applyAiSelection}
                className="rounded-lg bg-purple-500 px-2 py-1 text-xs font-medium"
              >
                AI pick ({goal})
              </button>
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              {(["Fat burn", "Endurance", "Strength", "Mobility"] as Goal[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGoal(option)}
                  className={`rounded-full px-3 py-1 text-xs ${
                    goal === option ? "bg-purple-300 text-slate-900" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
              {workoutLibrary.map((workout) => {
                const active = selectedWorkoutIds.includes(workout.id);
                return (
                  <button
                    key={workout.id}
                    type="button"
                    onClick={() => toggleWorkout(workout.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      active ? "bg-emerald-400/25 text-emerald-100" : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    <span>{workout.name}</span>
                    <span className="text-xs text-slate-300">{workout.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">Order</h2>
              <button
                type="button"
                onClick={applyAiOrder}
                className="rounded-lg bg-indigo-500 px-2 py-1 text-xs font-medium"
              >
                AI order
              </button>
            </div>
            <ol className="space-y-2">
              {selectedWorkouts.map((workout, index) => (
                <li key={workout.id} className="flex items-center justify-between rounded-lg bg-slate-700 px-3 py-2">
                  <span className="text-sm">
                    {index + 1}. {workout.name}
                  </span>
                  <div className="space-x-1 text-xs">
                    <button
                      type="button"
                      onClick={() => moveWorkout(index, "up")}
                      className="rounded bg-slate-600 px-2 py-1"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveWorkout(index, "down")}
                      className="rounded bg-slate-600 px-2 py-1"
                    >
                      ↓
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <footer className="mt-5 rounded-xl bg-slate-900 p-3 text-sm text-slate-200">
          <p>Duration: {duration} min</p>
          <p>Pattern: {intervalPattern === "60/30" ? "60s on / 30s rest" : "30s on / 15s rest"}</p>
          <p>Estimated rounds: {estimatedRounds}</p>
        </footer>
      </section>
    </main>
  );
}
