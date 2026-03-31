import React from "react";
import { getPersonalRecords } from "../utils/trainingStats";
import { calculateTrainingVolume } from "../utils/calculateTrainingVolume";
import { Icons } from "../lib/icons";

const Program = ({ weeklySchedule,setQuizStep,setView, dayNames, logs }) => {
  if (!weeklySchedule || Object.keys(weeklySchedule).length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
     <h3 className="text-2xl font-black mb-3">You don't have a program available yet. Try:</h3>
           <div>
               {/* button to the quiz */}
               <button
                 onClick={() => {
                   setQuizStep(0);
                   setView("quiz");
                 }}
                 className="relative overflow-hidden bg-white border border-slate-100 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-left hover:bg-slate-300 transition-all group shadow-sm hover:shadow-2xl"
               >
                 <h3 className="text-2x1 font-black text-slate-800 mb-3">
                   Taking the quiz to generate your program ✍🏽 
                 </h3>
      
               </button>
       </div>
       <div>
               {/* button to creating program */}
               <button
                 onClick={() => {
                   setView("createProgram");
                 }}
                 className="relative overflow-hidden bg-blue-800 border border-slate-900 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-left hover:bg-blue-900 transition-all group shadow-2xl"
               >       
                 <h3 className="text-2x1 font-black text-white mb-3">
                   Creating a program yourself, take full control🏋️
                 </h3>
               </button>
             </div>
             </div>
             );

  }


 const records = getPersonalRecords(logs); 
 const volume = calculateTrainingVolume(logs);
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
        <h2 className="text-4xl font-black text-teal-600 tracking-tight">
          Program Overview
        </h2>
        <h2 className="text-2x1 font-black text-slate-600 tracking-tight">
          Your tailored program, PRs and TV-L, all in one place🔥
        </h2>
    <button
      onClick={() => {
        setQuizStep(0);
        setView("quiz");
      } }
      
      className="mb-6 text-sm text-blue-600 hover:underline"
    >
      ← Retake Assessment
    </button><br></br>
    <button
      onClick={() => {
        setView("createProgram");
      } }
      
      className="mb-6 text-sm text-blue-600 hover:underline"
    >
      ← Reconstruct Program
    </button>
    
    <div className="program-container">
  {Object.entries(weeklySchedule || {}).map(([dayIndex, routine]) => (
    <div key={dayIndex} className="day-card">

      <h3 className="font-bold text-lg">
  {dayNames[dayIndex]}
</h3>

<p className="text-sm text-slate-500 mb-2">
  {routine.name}
</p>
{(!routine.exercises || routine.exercises.length === 0) && (
  <p className="text-slate-400 text-sm">Rest Day</p>
)}
      <ul>
  {routine.exercises?.map((exercise, i) => (
    <li key={i} className="py-1">
      <span className="font-semibold">{exercise.name}</span>{" "}
      <span className="text-slate-500 text-sm">
  {exercise.sets && exercise.reps
    ? `(${exercise.sets} × ${exercise.reps})`
    : "(Not set)"}
</span>
    </li>
  ))}
</ul>

    </div>
  ))}
</div>

<div className="bg-slate-900 text-white p-6 rounded-2xl">
  <p className="text-xs uppercase opacity-60">Training Volume</p>
  <h3 className="text-3xl font-black mt-2">
    {volume} kg
  </h3>
</div>

<div className="bg-white p-6 rounded-2xl border">
  <h3 className="font-bold text-green-600 mb-4">Personal Records</h3>

  {Object.entries(records).map(([exercise, weight]) => (
    <div
      key={exercise}
      className="flex justify-between text-green-600 py-2 border-b"
    >
      <span>{exercise}</span>
      <span className="font-bold text-green-600">{weight} kg</span>
    </div>
  ))}
</div>
</div>
  );
};

export default Program;