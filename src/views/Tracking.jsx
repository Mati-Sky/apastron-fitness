import React from "react";
import { Icons } from "../lib/icons";
import ProgressChart from "../components/ProgressChart";
import { motion, AnimatePresence } from "framer-motion";

const Tracking = ({
  todayRoutine,
  logs,
  setActiveLogItem,
  setIsManualEntry,
  activeLogItem,
  isManualEntry,
  submitLog,
  showToast 
}) => {
  const todayDate = new Date().toISOString().slice(0,10);
  // detect days missed for encouragement
const sortedLogs = [...logs].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

const lastLogDate = sortedLogs[0]?.date;

let missedMessage = null;

if (lastLogDate) {
const lastDate = new Date(lastLogDate);
const today = new Date(todayDate);

// normalize time
lastDate.setHours(0,0,0,0);
today.setHours(0,0,0,0);

const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

//  ignores "missed" if it's just yesterday, covering rest day scenarios
// (covers most rest-day scenarios simply)
if (diffDays <= 1) {
  missedMessage = null;
} else if (diffDays === 2) {
  missedMessage = "You missed your last session. One off day is cool- just don't make it two 😅💪🏾";
} else if (diffDays > 2) {
  missedMessage = "It's been a few days since your last workout…are we slipping or what? 👀🚫";
}
}
  const messages = [
  "A New day, A New PR 💪🏾💪🏾",
  "Those weights won't lift themselves!!",
  "Keep showing up! Consitency matters🚀",
  "Feel the pain or remain the same 🔥"
];

let message = messages[new Date().getDay() % messages.length];

if (missedMessage) {
  message = missedMessage;
}
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-4xl font-black text-teal-600 tracking-tight">
          Training Session
        </h2>
        <button
          onClick={() => {
            setIsManualEntry(true);
            setActiveLogItem("Custom");
          }}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <Icons.Plus />
          Custom Exercise
        </button>
      </header>

<AnimatePresence mode="wait">
  <motion.h2
    key={message}
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 40 }} 
    transition={{ duration: 0.4 }}
    className="text-2x1 bg-cyan-300 border border-cyan-600 text-slate-800 px-6 py-4 rounded-2xl font-semibold"
  >
    {message}
  </motion.h2>
</AnimatePresence>
      <div className="grid md:grid-cols-2 gap-6">
        {todayRoutine?.exercises?.length === 0 && (
  <div className="col-span-full bg-gradient-to-r from-blue-500 to-teal-500 border-slate-200 rounded-2xl p-8 text-center">
    <h3 className="text-xl font-bold text-slate-700 mb-2">
      Rest Day 🛌
    </h3>

    <p className="text-slate-500">
      No need to track today — let your muscles recover.
    </p>
  </div>
)}
       {todayRoutine?.exercises?.map((ex, i) => {
  const exName = ex?.name;

  if (!exName) return null;

  const isLogged = logs.some( 
    (l) =>
      l.exercise?.toLowerCase().trim() === exName.toLowerCase().trim() &&
      l.date === todayDate
  );

  return (
    <button
      key={i}
      onClick={() => {
          if (isLogged) {
          showToast(`Oops, you already logged the ${exName} for today😅`);
          return;
      }
        setActiveLogItem(exName);
        setIsManualEntry(false);
      }}
      className={`p-8 border-2 rounded-[2.5rem] text-left transition-all group relative overflow-hidden ${
        isLogged
         ? "bg-green-200 text-green-700 cursor-not-allowed"
         : "bg-white border-slate-100 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3
          className={`font-black text-xl ${
            isLogged ? "text-green-700" : "text-slate-800"
          }`}
        >
          {exName} 
        </h3>

        <div
           className={`p-2 rounded-full ${
            isLogged
               ? "bg-green-200 text-green-700"
                : "bg-slate-50 text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors"
              }`}
        >
          {isLogged ? <Icons.Check /> : <Icons.Plus />}
        </div>
      </div>

      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
        {isLogged ? "Logged Today ✓" : "Tap to log set"}
      </p>
    </button>
  );
})}
      </div>
      {activeLogItem && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <form
      onSubmit={submitLog}
      className="bg-white p-8 rounded-2xl text-green-400 shadow-xl space-y-4 w-96"
    >
      <h3 className="text-xl font-bold">
        Log {isManualEntry ? "Exercise" : activeLogItem}
      </h3>

      {isManualEntry && (
        <input
          name="manualEx"
          placeholder="Exercise name"
          required
          className="w-full border p-2 rounded"
        />
      )}

      <input
        name="w"
        type="number"
        placeholder="Weight"
        required
        onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      showToast("Only numbers are allowed in this field.", "error");
    }
  }}
        className="w-full border p-2 rounded"
      />

      <input
        name="s"
        type="number"
        placeholder="Total Sets"
        required
        onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      showToast("Only numbers are allowed in this field.", "error");
    }
  }}
        className="w-full border p-2 rounded"
      />

      <input
        name="r"
        type="number"
        placeholder="Reps per Set"
        required
        onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
      showToast("Only numbers are allowed in this field.", "error");
    }
  }}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setActiveLogItem(null)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>

  </div>
)}

{/* PROGRESS CHART SECTION */}
      <div className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem]  text-green-300 shadow-sm border border-slate-100">

        <p className="text-xs font-black text-green-300 uppercase tracking-widest mb-6">
          Strength Progress
        </p>

        <ProgressChart logs={logs} />

      </div>
    </div>
  );
};

export default Tracking;
