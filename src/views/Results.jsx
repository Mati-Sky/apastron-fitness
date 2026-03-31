const Results = ({ quizData, weeklySchedule, setView }) => {
  const capitalize = (str) => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
  return (
    <div className="max-w-3xl mx-auto pt-20">
      <h1 className="text-4xl font-black mb-6">
        Your Training Plan
      </h1>

      <p className="mb-4">
        Goal: <strong>{capitalize(quizData.goal)}</strong>
      </p>
      <p className="mb-4">
        Experience: <strong>{capitalize(quizData.exp)}</strong>
      </p>
      <p className="mb-4">
        Priority: <strong>{capitalize(quizData.priority)}</strong>
      </p>
      <p className="mb-4">
        Frequency: <strong>{capitalize(quizData.freq)} days per week</strong>
      </p>

      <button
        onClick={() => setView('program')}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        View My Program
      </button>
    </div>
  );
};

export default Results;