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

  // Data States
  const [profile, setProfile] = useState({ name: '', weight: 75, height: 180, age: 25, gender: 'male' });
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [activeExModal, setActiveExModal] = useState(null); 
const [programId, setProgramId] = useState(null);
const [toast, setToast] = useState(null);

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
} = useAuthFlow({ 
  auth,
  db,
  appId,
  showToast
});

const isLocked = memberStatus !== "member";


 useEffect(() => {
  if (!user || loading) return;

  const loadUserProfile = async () => {
    try {
      const snap = await getDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'settings')
      );
const programSnap = await getDocs(
      collection(db, "artifacts", appId, "users", user.uid, "programs")
    );

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
      // ⚠️ fallback if profile missing but program exists
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

}, [user, loading, db, appId]);

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

const {
  logs,
  activeLogItem,
  setActiveLogItem,
  isManualEntry,
  setIsManualEntry,
  submitLog
} = useLogs({ user, db, appId, showToast });

  const {
  healthAnalysis,
  healthError,
  calculateHealth
} = useHealthAnalysis(profile);

const {
  aiChat,
  chatInput,
  setChatInput,
  talkToCoach,
  isAiLoading,
  chatEndRef
} = useAIChat(profile, logs, programId);

  const renderMessage = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => 
      part.startsWith('**') && part.endsWith('**') 
        ? <strong key={index} className="text-blue-200">{part.slice(2, -2)}</strong> 
        : part
    );
  };
  
const handlePaymentSuccess = async () => {
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
    />
  );
}

const signOut = async () => {
  try {
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