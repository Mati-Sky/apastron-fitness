import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import ExerciseEditor from "../components/ExerciseEditor";
import ExercisePicker from "../components/ExercisePicker";

const dayNames = [
  "Sunday","Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday"
];

const ProgramBuilder = ({
  weeklySchedule,
  setWeeklySchedule,
  programId,
  db,
  user,
  appId,
  saveProgram,
  setView,
  showToast
}) => {
  
  useEffect(() => {

  const loadProgram = async () => {

    if (!programId) return;

    const snap = await getDoc(
      doc(db, "artifacts", appId, "users", user.uid, "programs", programId)
    );

    if (snap.exists()) {
      const data = snap.data();
      setWeeklySchedule(data.weeklySchedule || {});
    }

  };

  loadProgram();

}, [programId, db, user, appId]);

  const addExercise = (day, name) => {
  setWeeklySchedule(prev => {
    const existingExercises = prev[day]?.exercises || [];

    const alreadyExists = existingExercises.some(
      ex => ex.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      showToast("Exercise already added", "error"); 
      return prev; 
    }

    const newExercise = {
      name,
      sets: "",
      reps: ""
    };

    return {
      ...prev,
      [day]: {
        name: dayNames[day],
        exercises: [...existingExercises, newExercise]
      }
    };
  });
};

  const handleSave = async () => {
   if (!programId) {
    showToast("Program not created yet");
    return;
  }

  if (Object.keys(weeklySchedule).length === 0) {
    showToast("Add exercises before saving");
    return;
  }

  await saveProgram(programId, weeklySchedule);
  showToast("Program saved successfully");
  setView("program");
};

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Program Builder
      </h1>

      <button
        onClick={() => setView("onboarding")}
         className="mb-6 px-4 py-2 bg-white text-green-950 rounded-xl"
        >
         ← Back to Onboarding
        </button>

      {dayNames.map((day, index) => {

        const workout = weeklySchedule[index];
        const isRestDay = workout?.rest === true;

        return (
          
          <div key={index} className="mb-8 border p-4 rounded-xl">

<div className="flex items-center gap-3 mb-3">

  <h2 className="text-xl font-bold">{day}</h2>

  <button
    onClick={() =>
      setWeeklySchedule(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          rest: !prev[index]?.rest,
          exercises: !prev[index]?.rest ? [] : prev[index]?.exercises || []
        }
      }))
    }
    className="px-3 py-1 text-xs bg-gray-100 text-green-500 rounded"
  >
    {isRestDay ? "Undo Rest Day" : "Set Rest Day"}
  </button>

</div>

 {isRestDay ? (

  <p className="text-slate-400 italic">
    Rest Day
  </p>

) : (

  <>
    {(workout?.exercises || []).map((ex, i) => (
      <ExerciseEditor
        key={i}
        day={index}
        index={i}
        exercise={ex}
        weeklySchedule={weeklySchedule}
        setWeeklySchedule={setWeeklySchedule}
      />
    ))}

    <ExercisePicker
      onSelect={(name) => addExercise(index, name)}
     selectedExercises={weeklySchedule[day]?.exercises || []}
/>
  </>
)}

</div>
        );
      })}
      <button
        onClick={handleSave}
         className="mt-6 px-6 py-3 bg-blue-600 text-white rounded"
      >
      Save Program
      </button>
    </div>
  );
};

export default ProgramBuilder;
