import { collection, addDoc, doc, setDoc } from "firebase/firestore";

export const useProgramBuilder = ({ db, user, appId, profile, weeklySchedule, setupCompleted }) => {

  const createProgram = async (name, setView, setProgramId) => {

    const ref = await addDoc(
      collection(db, "artifacts", appId, "users", user.uid, "programs"),
      {
        name,
        createdAt: Date.now(),
        weeklySchedule: {}
      }
    );

    setProgramId(ref.id);
    setView("programBuilder");
  };

  const saveProgram = async (programId, weeklySchedule) => {

const safeProfile = profile || {
  name: user.email.split("@")[0],
  weight: 75,
  height: 180,
  age: 25,
  gender: "male"
};


    await setDoc(
      doc(db, "artifacts", appId, "users", user.uid, "programs", programId),
      {
    weeklySchedule,
    programId,
  },
  { merge: true }
);

await setDoc(
  doc(db, "artifacts", appId, "users", user.uid, "profile", "settings"),
  {
    profile : safeProfile ,
    weeklySchedule,
    activeProgramId : programId,
    setupCompleted: true
  },
  { merge: true }
);
  };

  return { createProgram, saveProgram };
};