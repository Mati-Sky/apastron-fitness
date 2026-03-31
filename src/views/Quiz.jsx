import React from "react";
import { Icons } from "../lib/icons";

const Quiz = ({ questions, quizStep, handleQuizNext,setView }) => {
  if (!questions || !questions[quizStep]) {
  return null; // or a loading spinner
}
  return (
    <div className="max-w-xl mx-auto pt-20 animate-in zoom-in-95">
      <h1 className="text-slate-500 text-xl uppercase font-bold">Quiz Guided Setup</h1>
      <p><br></br></p>
      <h2 className="text-slate-500 text-xl font-bold">Please answer all questions according to your personal preferences</h2>
      <p><br></br></p>
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i <= quizStep ? "bg-green-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <h2 className="text-blue-500 text-2xl font-bold">
        {questions[quizStep].q}
      </h2><br></br>

      {/* Options */}
      <div className="space-y-4">
        {questions[quizStep].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleQuizNext(opt.v)}
            className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl text-left hover:border-blue-600 hover:shadow-xl hover:scale-[1.02] transition-all flex justify-between items-center group"
          >
            <span className="font-bold text-lg text-slate-700 group-hover:text-blue-600">
              {opt.l}
            </span>
            <span className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity">
              <Icons.ChevronRight />
            </span>
          </button>
        ))}
      </div>
       <button
      onClick={() => {
        setView("program");
      } }
      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
    >
      Cancel
    </button>
    </div>
  );
};

export default Quiz;
