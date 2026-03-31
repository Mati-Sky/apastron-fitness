import React from "react";
import { Icons } from "../lib/icons";
import dumbbell from  "../assets/images/dumbbell.png";

const Onboarding = ({ setView, setQuizStep, finalizeSetup }) => {
  const backgroundStyle = {
    backgroundImage: `url(${dumbbell})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100vw', 
    height: '100vh', 
  };

  return (
    <div style={backgroundStyle} className="h-96 bg-cover w-full bg-center rounded-3xl">
    <div className="max-w-4xl mx-auto pt-10 animate-in slide-in-from-bottom-8">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4">
        Welcome, Athlete.
      </h2>
      <p className="text-teal-500 mb-6 md:mb-12 text-xl font-medium">
        Take control of your routine.
      </p>

      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
         {/* button to the quiz */}
        <button
          onClick={() => {
            setQuizStep(0);
            setView("quiz");
          }}
          className="relative overflow-hidden bg-white border border-slate-100 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-left hover:border-blue-500 transition-all group shadow-sm hover:shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform scale-150">
            <Icons.Dumbbell />
          </div>

          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider mb-6">
            Recommended
          </span>

          <h3 className="text-3xl font-black text-slate-800 mb-3">
            AI Guided Setup
          </h3>

          <p className="text-slate-400 leading-relaxed font-medium">
            Answer a few questions about your preferences
            and goals and receive a structured program 
            catered to your needs.
          </p>
        </button>

         {/* button to creating program */}
        <button
          onClick={() => {
            setView("createProgram");
          }}
          className="relative overflow-hidden bg-slate-900 border border-slate-900 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-left hover:bg-blue-900 transition-all group shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 text-white transform scale-150">
            <Icons.Edit />
          </div>

          <span className="inline-block px-4 py-2 bg-white/10 text-white/80 rounded-xl text-[10px] font-black uppercase tracking-wider mb-6">
            Advanced
          </span>

          <h3 className="text-3xl font-black text-white mb-3">
            Manual Builder
          </h3>

          <p className="text-slate-400 leading-relaxed font-medium">
           Create a program yourself based on your 
           own experiences be in full control of your split, 
           rest days and exercise choices
          </p>
        </button>
      </div>
      <button
          onClick={() => {
            setView("dashboard");
          }}
          className="relative overflow-hidden mt-7 bg-slate-900 border border-slate-900 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[3rem]text-left hover:bg-blue-900 transition-all group shadow-2xl"
        >
          Head to Dashboard instead
        </button>
    </div>
    </div>
  );
};

export default Onboarding;
