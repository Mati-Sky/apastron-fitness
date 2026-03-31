import { useState } from 'react';
import { WORKOUT_PLANS } from '../constants/workoutPlans';
import { setDoc, doc } from 'firebase/firestore';
import { QUIZ_QUESTIONS } from '../constants/quiz_questions';

export function useQuizSetup({ user, db, appId, profile, setWeeklySchedule, setView }) {
  const [quizStep, setQuizStep] = useState(0);
  const [quizData, setQuizData] = useState({});
  
const safeProfile = profile || {
  name: user.email.split("@")[0],
  weight: 75,
  height: 180,
  age: 25,
  gender: "male"
};

  const handleQuizNext = async (val) => {
    const updatedData = {
      ...quizData,
      [QUIZ_QUESTIONS[quizStep].key]: val
    };

  setQuizData(updatedData);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep((s) => s + 1);
    } else {
      await finalizeSetup(updatedData,);
    }
  };

  const finalizeSetup = async (finalData) => {
    if (!user || !db || !appId) return;

    let routineType = finalData.goal;

    if (finalData.exp === 'beginner' && routineType !== 'endurance') {
      routineType = 'beginner';
    }

    const baseRoutine = WORKOUT_PLANS[routineType];
    if (!baseRoutine) return;

    const freq = Number(finalData.freq); 

    const planDays = Object.values(baseRoutine.weeklySchedule);
const newSchedule = {};

let dayCounter = 0;

const formatExercises = (exerciseArray, goal) => {
  return exerciseArray.map(ex => {
    if (goal === "strength") {
      return { name: ex, sets: 5, reps: 5 };
    }
    if (goal === "hypertrophy") {
      return { name: ex, sets: 3, reps: 10 };
    }
    if (goal === "endurance") {
      return { name: ex, sets: 3, reps: 15 };
    }
    // beginner fallback
    return { name: ex, sets: 3, reps: 8 };
  });
};
    if (freq <= 2) {
      [1, 4].forEach((d) => {
        newSchedule[d] = {
          name: baseRoutine.name,
          exercises: formatExercises(
  planDays[dayCounter % planDays.length]
)
        };
        dayCounter++;
      });
    } else if (freq <= 4) {
      [1, 2, 4, 5].forEach((d) => {
        newSchedule[d] = {
          name: baseRoutine.name,
          exercises: formatExercises(
  planDays[dayCounter % planDays.length]
)
        };
        dayCounter++;
      });
    } else {
      for (let d = 1; d <= 6; d++) {
        newSchedule[d] = {
          name: baseRoutine.name,
          exercises: formatExercises(
  planDays[dayCounter % planDays.length]
)
        };
        dayCounter++;
      }
    }

    await setDoc(
      doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'settings'),
      {
        profile : safeProfile,
        weeklySchedule: newSchedule,
        setupCompleted: true,
        quizDetails: finalData
      },
      { merge: true }
    );

    setWeeklySchedule(newSchedule);
    setView('results');
  };

  return {
    questions: QUIZ_QUESTIONS,
    quizStep,
    setQuizStep,
    handleQuizNext,
    finalizeSetup,
    quizData
  };
}