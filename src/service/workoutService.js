const isDemo = import.meta.env.VITE_APP_MODE === "demo";

// GET WORKOUTS
export const getWorkouts = async (userId, db) => {
  if (isDemo) {
    const data = localStorage.getItem("demo-workouts");
    return data ? JSON.parse(data) : [];
  }

  //FIREBASE
  const { collection, getDocs } = await import("firebase/firestore");

  const snapshot = await getDocs(collection(db, "users", userId, "workouts"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// SAVE WORKOUT
export const saveWorkout = async (userId, workout, db) => {
  if (isDemo) {
    const existing = JSON.parse(localStorage.getItem("demo-workouts") || "[]");
    const updated = [...existing, workout];
    localStorage.setItem("demo-workouts", JSON.stringify(updated));
    return;
  }

  // FIREBASE
  const { collection, addDoc } = await import("firebase/firestore");

  await addDoc(collection(db, "users", userId, "workouts"), workout);
};