import { useState } from "react";

const CreateProgram = ({ createProgram, setView, setProgramId }) => {
  const [name, setName] = useState("");

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Program</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Program Name"
        className="w-full p-4 border rounded-xl"
      />

      <div className="flextainer"><div><button
        onClick={() => createProgram(name, setView, setProgramId)}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        Create
      </button></div>

    <div><button
      onClick={() => {
        setView("program");
      } }
      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
    >
      Cancel
    </button></div></div>
      
    </div>
  );
};

export default CreateProgram;