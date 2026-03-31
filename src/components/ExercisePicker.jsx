import { useState } from "react";
import { exerciseLibrary } from "../data/exerciseLibrary";

const ExercisePicker = ({ onSelect, selectedExercises }) => {

  const [search, setSearch] = useState("");

  const filtered = exerciseLibrary.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
    
  );
 
  const isSelected = (name) =>
  selectedExercises.some(
    ex => ex.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
 const disabled = isSelected(ex=> ex.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mt-3">

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search exercise..."
        className="w-full p-2 border rounded mb-2"
      />

      <div className="max-h-40 overflow-y-auto border rounded">

        {filtered.map((ex, i) => (
          <div
            key={i}
            onClick={() => !disabled && onSelect(ex.name)}
            className="p-2 hover:bg-slate-200 cursor-pointer text-sm"
          >
            <span className="text-xs text-green-500 ml-2">
            {ex.name}
            </span>
            <span className="text-xs text-green-500 ml-2">
              ({ex.muscle})
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ExercisePicker;