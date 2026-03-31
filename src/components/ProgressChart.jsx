import { useState } from "react";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const ProgressChart = ({ logs }) => {

  const exercises = [...new Set(logs.map(l => l.exercise))];
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);

  if (!logs || logs.length === 0) {
    return (
      <p className="text-slate-600 italic">
        No progress data yet. Start logging workouts!
      </p>
    );
  }

  // Filter logs for selected exercise
  const filteredLogs = logs
    .filter(log => log.exercise === selectedExercise)
    .sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

  const chartData = filteredLogs.map((log, index) => ({
    session: index + 1,
    weight: log.weight,
    date: new Date(log.createdAt).toLocaleDateString()
  }));

  return (
    <div className="space-y-4 ">

      {/* Exercise selector */}
      <select
        value={selectedExercise}
        onChange={(e)=>setSelectedExercise(e.target.value)}
      className="p-3 rounded-xl bg-slate-800 border text-green-300"
      > 
        {exercises.map(ex => (
          <option key={ex}>{ex}</option>
        ))}
      </select>

      <p className="font-bold text-green-300">
        Strength Progress: {selectedExercise}
      </p>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="session" />

          <YAxis />

          <Tooltip
            formatter={(value)=>`${value} kg`}
            labelFormatter={(label)=>`Session ${label}`}
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ProgressChart;