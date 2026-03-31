const ExerciseEditor = ({
  day,
  index,
  exercise,
  weeklySchedule,
  setWeeklySchedule
}) => {

 const updateExercise = (field, value) => {

  setWeeklySchedule(prev => {

    const copy = structuredClone(prev);

    copy[day].exercises[index][field] = value;

    return copy;

  });

};
const removeExercise = () => {
    setWeeklySchedule(prev => {
      const copy = structuredClone(prev);

      copy[day].exercises.splice(index, 1);

      return copy;
    });
  };

  return (
    <div className="flex gap-4 items-center mt-2">
     <input
    value={exercise.name}
    onChange={(e)=>updateExercise("name", e.target.value)}
    className="border p-2 flex-1 rounded"
  />

  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-400">Sets</span>
    <input
      type="number"
      value={exercise.sets}
      placeholder="3"
      onChange={(e)=>updateExercise("sets", e.target.value)}
      className="border p-2 w-16 text-center rounded"
    />
  </div>

  <div className="flex flex-col items-center">
    <span className="text-xs text-gray-400">Reps</span>
    <input
      type="number"
      value={exercise.reps}
      placeholder="10"
      onChange={(e)=>updateExercise("reps", e.target.value)}
      className="border p-2 w-16 text-center rounded"
    />
  </div>
 <button
        onClick={removeExercise}
        className="px-3 py-2 bg-red-500 text-white rounded"
      >
        ✕
      </button>
    </div>
  );
};

export default ExerciseEditor;