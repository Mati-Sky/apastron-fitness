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
  .filter(log => log.weight || log.w) // ensure valid data
  .sort((a,b) => new Date(a.date) - new Date(b.date))
const chartData = filteredLogs.map((log, index) => {
  const weight = Number(log.weight ?? log.w ?? 0);
  const reps = Number(log.reps ?? log.r ?? 0);
  const sets = Number(log.sets ?? log.s ?? 0);


  const volume = weight * reps * sets;

  return {
    session: index + 1,
    weight,
    reps,
    sets,
    volume,
    date: new Date(log.date).toLocaleDateString()
  };
})
 .filter(d => !isNaN(d.weight) && !isNaN(d.volume));

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
  Performance Progress: {selectedExercise}
</p>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="session" />

          <YAxis />

          <Tooltip
  formatter={(value, name) => {
    if (name === "weight") return [`${value} kg`, "Weight"];
    if (name === "volume") return [value, "Volume"];
    return [value, name];
  }}
  labelFormatter={(label, payload) => {
    const point = payload?.[0]?.payload;
    return `Session ${label} (${point?.date})`;
  }}
/>

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <Line
             type="monotone"
              dataKey="volume"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ProgressChart;