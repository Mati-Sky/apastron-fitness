import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export function useLogs({ user, db, appId, showToast}) {
  const [logs, setLogs] = useState([]);
  const [activeLogItem, setActiveLogItem] = useState(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, 'artifacts', appId, 'users', user.uid, 'history'),
      (s) => {
        setLogs(
          s.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => b.time - a.time)
        );
      }
    );

    return () => unsub();
  }, [user, db, appId]);

  const submitLog = async (e) => {
    e.preventDefault();
    if (!user) return;

    const fd = new FormData(e.target);
    const exerciseName = isManualEntry
      ? fd.get('manualEx')
      : activeLogItem;

      const weight = Number(fd.get('w'));
const sets = Number(fd.get('s'));
const reps = Number(fd.get('r'));

if (!exerciseName) {
  showToast("Please select or enter an exercise.", "error");
  return;
}

if (!weight || weight <= 0 || weight > 300) {
  showToast("Enter a valid weight (1–300 kg).", "error");
  return;
}

if (!sets || sets <= 0 || sets > 20) {
  showToast("Sets must be between 1 and 20. If you're doing more, that's junk volume.", "error");
  return;
}

if (!reps || reps <= 0 || reps > 30) {
  showToast("Reps must be between 1 and 100. If you're doing more, that's junk volume.", "error");
  return;
}

const newLog = {
  exercise: exerciseName,
  weight,
  sets,
  reps,
    time: Date.now(),
    date: new Date().toISOString().slice(0,10),
    dayIndex: new Date().getDay()
};
    await addDoc(
      collection(db, 'artifacts', appId, 'users', user.uid, 'history'),
      newLog
    );
    setActiveLogItem(null);
    setIsManualEntry(false);
     e.target.reset();
  };

  return {
    logs,
    activeLogItem,
    setActiveLogItem,
    isManualEntry,
    setIsManualEntry,
    submitLog
  };
}
