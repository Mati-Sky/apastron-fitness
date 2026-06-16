import React, { useState, useEffect, useRef } from 'react';
import "./App.css";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "./lib/firebase"; //imports firebase firestore authentication code
import { Icons } from "./lib/icons";  //handles importing icons
import Auth from "./views/Auth";   //imports auth code
import Quiz from "./views/Quiz";
import Navigation from './components/Navigation';
import {VIEW_MAP} from './config/viewMap';
import { useProgramBuilder } from "./hooks/useProgramBuilder";
import { useAuthFlow } from './hooks/useAuthFlow';
import { useAppUser } from './hooks/useAppUser';
import { useNavigation } from './hooks/useNavigation';
import { useQuizSetup } from './hooks/useQuizSetup';
import { useLogs } from './hooks/useLogs';
import { useHealthAnalysis } from './hooks/useHealthAnalysis';
import { useAIChat } from './hooks/useAIChat'; 
import Program from "./views/Program"; 
import Onboarding from './views/Onboarding';
import Toast from "./components/Toast";
import { useToast } from "./hooks/useToast";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  collection, 
  onSnapshot, 
  addDoc 
} from 'firebase/firestore';
import { DESKTOP_NAV_ITEMS, MOBILE_NAV_ITEMS } from './config/navigation';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Paywall from './views/Paywall';
import Dashboard from './views/Dashboard';
import { QUIZ_QUESTIONS } from './constants/quiz_questions';

const appId = 'apastron-fitness-v2';

//Main APP
const App = () => {
  const [view, setView] = useState('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  // Data States
  const [profile, setProfile] = useState({ name: '', weight: 75, height: 180, age: 25, gender: 'male' });
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [activeExModal, setActiveExModal] = useState(null); 
  const [programId, setProgramId] = useState(null);
  const [toast, setToast] = useState(null);

  const DEMO_PROFILE = {
    name: 'Demo Athlete',
    weight: 76,
    height: 178,
    age: 27,
    gender: 'male'
  };

  const DEMO_WEEKLY_SCHEDULE = {
    1: {
      name: 'Strength Build',
      exercises: [
        { name: 'Back Squat', sets: 5, reps: 5 },
        { name: 'Incline Dumbbell Press', sets: 4, reps: 10 },
        { name: 'Barbell Row', sets: 4, reps: 8 }
      ]
    },
    2: {
      name: 'Pull Focus',
      exercises: [
        { name: 'Deadlift', sets: 5, reps: 5 },
        { name: 'Chin Up', sets: 4, reps: 8 },
        { name: 'Face Pull', sets: 3, reps: 12 }
      ]
    },
    4: {
      name: 'Upper Power',
      exercises: [
        { name: 'Bench Press', sets: 5, reps: 5 },
        { name: 'Overhead Press', sets: 4, reps: 8 },
        { name: 'Lat Pulldown', sets: 4, reps: 10 }
      ]
    },
    5: {
      name: 'Conditioning',
      exercises: [
        { name: 'Kettlebell Swing', sets: 4, reps: 15 },
        { name: 'Walking Lunges', sets: 3, reps: 12 },
        { name: 'Plank', sets: 3, reps: 60 }
      ]
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  //auth initialization, authflow
  const {
    user,
    handleAuth,
    loading,
    authError,
    setAuthError,
    isRegistering,
    setIsRegistering,
    setMemberStatus,
    memberStatus
  } = useAppUser({ 
    auth,
    db,
    appId,
    showToast,
    isDemoMode
  });

  const isLocked = memberStatus !== "member";

 useEffect(() => {
  if (!user || loading) return;
  if (isDemoMode && demoLoaded) return;

  const loadUserProfile = async () => {
    try {
      if (isDemoMode) {
        const savedProfile = JSON.parse(localStorage.getItem('demo-profile') || 'null');
        const savedSchedule = JSON.parse(localStorage.getItem('demo-weeklySchedule') || 'null');
        const savedProgramId = localStorage.getItem('demo-programId');

        setProfile(savedProfile?.profile || DEMO_PROFILE);
        setWeeklySchedule(savedSchedule || DEMO_WEEKLY_SCHEDULE);
        setProgramId(savedProgramId || null);
        setView('dashboard');
        setDemoLoaded(true);
        return;
      }

      const snap = await getDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'settings')
      );
      const programSnap = await getDocs(
        collection(db, "artifacts", appId, "users", user.uid, "programs")
      );
      //program initialization
      const programs = programSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (snap.exists() && snap.data()?.profile && snap.data()?.setupCompleted) {
        const data = snap.data();

        setProfile(
          data.profile || {
            name: user.email.split("@")[0],
            weight: 75,
            height: 180,
            age: 25,
            gender: 'male'
          }
        );

        setWeeklySchedule(data.weeklySchedule || {});
        setView('dashboard');
      } else if (programs.length > 0) {
        // fallback if profile missing but program exists
        const latest = programs[0];

        setWeeklySchedule(latest.weeklySchedule || {});
        setProgramId(latest.id);
        setView('dashboard');
      } else {
        setView('onboarding');
      }

    } catch (err) {
      console.error("❌ ERROR loading profile:", err);
    }
  };

  loadUserProfile();

}, [user?.uid, loading, db, appId, isDemoMode, demoLoaded]);
//initialize program builder
const { createProgram, saveProgram } = useProgramBuilder({db,  user,  appId, profile});
const {
  questions, 
  quizStep,
  setQuizStep,
  handleQuizNext,
  finalizeSetup,
  quizData
} = useQuizSetup({
  user,
  db,
  appId,
  profile,
  setWeeklySchedule,
  setView
});

//logs
const {
  logs,
  activeLogItem,
  setActiveLogItem,
  isManualEntry,
  setIsManualEntry,
  submitLog
} = useLogs({ user, db, appId, showToast });

//BMI calculator
  const {
  healthAnalysis,
  healthError,
  calculateHealth
} = useHealthAnalysis(profile);

//AI Chat
const {
  aiChat,
  chatInput,
  setChatInput,
  talkToCoach,
  isAiLoading,
  chatEndRef
} = useAIChat(profile, user, logs, weeklySchedule);

   const renderMessage = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => 
      part.startsWith('**') && part.endsWith('**') 
        ? <strong key={index} className="text-blue-200">{part.slice(2, -2)}</strong> 
        : part
    );
  };

  // function for successful payment redirect to premium mode
const handlePaymentSuccess = async () => {
  if (user?.isDemo) {
    setMemberStatus("member");
    setView("dashboard");
    showToast("Demo mode already includes premium access 🎉");
    return;
  }

  await setDoc(
    doc(db, "artifacts", appId, "users", user.uid, "profile", "membership"),
    { status: "member" },
    { merge: true }
  );

  setMemberStatus("member");
  setView("dashboard"); // exit paywall
  showToast("Payment successful 🎉");
};

  // --- RENDER HELPERS ---
  const todayIndex = new Date().getDay();
  const todayRoutine = weeklySchedule?.[todayIndex] || { name: 'Rest Day', exercises: [] };
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

if (loading) return <div className="max-w-6xl mx-auto px-6 py-10">Loading Apastron...</div>;
if (!user) {
  return (
    <Auth
      handleAuth={handleAuth}
      authError={authError}
      setAuthError={setAuthError}
      isRegistering={isRegistering}
      setIsRegistering={setIsRegistering}
      setDemoMode={setIsDemoMode}
    />
  );
}

const signOut = async () => {
  try {
    if (user?.isDemo) {
      setIsDemoMode(false);
      setDemoLoaded(false);
      console.log('Demo user signed out');
      return;
    }

    await firebaseSignOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};


if (view === 'onboarding') {  //onboardingview
  return (
    <Onboarding
      setView={setView}
      setQuizStep={setQuizStep}
      finalizeSetup={finalizeSetup}
    />
  );
}

if (view === 'quiz') { //quizview
  return (
    <Quiz
      questions={questions}
      quizStep={quizStep}
      handleQuizNext={handleQuizNext}
      setView={setView}
    />
  );
}
 if (view === "paywall") {
  return <Paywall setView={setView} onSuccess={handlePaymentSuccess} auth={auth} signOut={signOut} />;
}
const ActiveView = VIEW_MAP[view];
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col md:flex-row">
       <Navigation
      view={view}
      setView={setView}
      signOut={signOut}
      auth={auth}
      Icons={Icons}
      memberStatus={memberStatus}
    />

      {/* 5. MAIN CONTENT AREA */}
      <main className={`flex-1 min-h-screen transition-all ${view !== 'auth' && view !== 'onboarding' && view !== 'quiz' ? 'p-4 sm:p-6 md:p-12 md:ml-64' : 'p-6 pb-20 md:pb-0'}`}>


    {ActiveView && (
  <ActiveView
    user={user}
    profile={profile}
    setProfile={setProfile}
    memberStatus={memberStatus}
    weeklySchedule={weeklySchedule}
    setQuizStep={setQuizStep}
    quizStep={quizStep}
    questions ={QUIZ_QUESTIONS}
    setView={setView}
    dayNames={dayNames}
    todayRoutine={todayRoutine}
    todayIndex={todayIndex}
    activeLogItem={activeLogItem}
    isManualEntry={isManualEntry}
    submitLog={submitLog}
    logs={logs}
    setActiveLogItem={setActiveLogItem}
    setIsManualEntry={setIsManualEntry}
    calculateHealth={calculateHealth}
    healthAnalysis={healthAnalysis}
    healthError={healthError}
    aiChat={aiChat}
    chatInput={chatInput}
    setChatInput={setChatInput}
    talkToCoach={talkToCoach}
    isAiLoading={isAiLoading}
    chatEndRef={chatEndRef}
    quizData={quizData}
    programId={programId}
    setProgramId={setProgramId}
    createProgram={createProgram}
    saveProgram={saveProgram}
    setWeeklySchedule={setWeeklySchedule}
    db={db}
    appId={appId}
    showToast={showToast}
    Paywall={Paywall}
    isLocked={isLocked} 
    handlePaymentSuccess={handlePaymentSuccess}
  />
)}
{toast && <Toast toast={toast} />}
  </main>
    </div>
    
  );
};

export default App;