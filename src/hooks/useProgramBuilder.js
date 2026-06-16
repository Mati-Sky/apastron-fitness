import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const DEMO_PROGRAMS_KEY = 'demo-programs';
const DEMO_PROFILE_KEY = 'demo-profile';

export const useProgramBuilder = ({ db, user, appId, profile, weeklySchedule, setupCompleted }) => {
  const isDemo = user?.isDemo;

  const createProgram = async (name, setView, setProgramId) => {
    if (isDemo) {
      const programs = JSON.parse(localStorage.getItem(DEMO_PROGRAMS_KEY) || '[]');
      const id = `demo-${Date.now()}`;
      const newProgram = {
        id,
        name,
        createdAt: Date.now(),
        weeklySchedule: {}
      };
      localStorage.setItem(DEMO_PROGRAMS_KEY, JSON.stringify([newProgram, ...programs]));
      localStorage.setItem('demo-programId', id);
      setProgramId(id);
      setView("programBuilder");
      return;
    }

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

    if (isDemo) {
      const programs = JSON.parse(localStorage.getItem(DEMO_PROGRAMS_KEY) || '[]');
      const updated = programs.map((p) =>
        p.id === programId ? { ...p, weeklySchedule, programId } : p
      );
      localStorage.setItem(DEMO_PROGRAMS_KEY, JSON.stringify(updated));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify({
        profile: safeProfile,
        weeklySchedule,
        activeProgramId: programId,
        setupCompleted: true
      }));
      return;
    }

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
        profile : safeProfile,
        weeklySchedule,
        activeProgramId : programId,
        setupCompleted: true
      },
      { merge: true }
    );
  };

  return { createProgram, saveProgram };
};