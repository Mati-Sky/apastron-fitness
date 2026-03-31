import React from "react";
const bmiColor = (category) => {
  switch (category) {
    case "Underweight":
      return "text-yellow-400";
    case "Normal weight":
      return "text-green-400";
    case "Overweight":
      return "text-orange-400";
    case "Obesity":
      return "text-red-400";
    default:
      return "text-gray-300";
  }
};

const Health = ({
  profile,
  setProfile,
  calculateHealth,
  healthError,
  healthAnalysis,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in">
      <h2 className="text-4xl font-black text-teal-600 tracking-tight">
        Biometrics Analysis
      </h2>
      <h2 className="text-2x1 font-black text-slate-600 tracking-tight">
        Estimate your body fat and adjust your calorie intake
      </h2>

      <div className="bg-gradient-to-r from-blue-500 to-green-600  p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {[
            { label: "Weight (kg)", key: "weight" },
            { label: "Height (cm)", key: "height" },
            { label: "Age", key: "age" },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-wider">
                {label}
              </label>
              <input
                type="number"
                value={profile[key]}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: Number(e.target.value) })
                }
                className="w-full p-6 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-3xl font-black text-2xl outline-none focus:ring-4 ring-blue-500/10"
              />
            </div>
          ))}

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-wider">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full p-6 bg-slate-50 text-slate-900 placeholder-slate-400  font-bold text-lg"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculateHealth}
          className="w-full py-6 bg-blue-600 text-white hover:bg-blue-800 font-black rounded-3xl uppercase tracking-widest text-sm"
        >
          Analyze Metrics
        </button>
      </div>

      {healthError && (
              <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
                 {healthError}
             </div>
          )}
{healthAnalysis && (
  <div className="space-y-6">

    {/* MAIN CARDS */}
    <div className="grid md:grid-cols-2 gap-4 md:gap-8">

      {/* BMI CARD */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white">
        <p className="text-xs font-black uppercase tracking-widest opacity-60">
          BMI Score
        </p>

        <h3 className={`text-4xl font-black mt-4 ${bmiColor(healthAnalysis.bmi.category)}`}>
          {healthAnalysis.bmi.bmi}
        </h3>

        <p className="mt-2 text-sm">
          Category:
          <span className={`ml-2 font-semibold ${bmiColor(healthAnalysis.bmi.category)}`}>
            {healthAnalysis.bmi.category}
          </span>
        </p>

        <p className="mt-4 text-gray-300 text-sm">
          {healthAnalysis.bmi.advice}
        </p>
      </div>

      {/* MAINTENANCE CARD */}
      <div className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-center border">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Maintenance Calories
        </p>

        <h3 className="text-6xl font-black mt-4 text-slate-800">
          {healthAnalysis.maintenance}
          <span className="text-xl text-slate-400"> cal</span>
        </h3>
      </div>
    </div>
    <div className="text-center text-xs text-red-500 max-w-xl mx-auto">
      {healthAnalysis.bmi.disclaimer}
    </div>

  </div>
)}      
    </div>
  );
};

export default Health;
