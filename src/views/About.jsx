import { Icons } from "../lib/icons";
import PageContainer from "../components/PageContainer";
import { doc, setDoc } from "firebase/firestore";
import React, {useState} from "react";


const About= ({ user, profile, db, appId, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
const [newName, setNewName] = useState(profile.name || user?.email?.split('@')[0]);

const handleSave = async () => {
  const updatedProfile = {
    ...profile,
    name: newName
  };

  setProfile(updatedProfile);

  await setDoc(
    doc(db, "artifacts", appId, "users", user.uid, "profile", "settings"),
    { profile: updatedProfile },
    { merge: true }
  );

  setIsEditing(false);
};
  return (
   <div className="bg-gradient-to-br ">
    <PageContainer title="Apastron Profile">
  <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4"> 
  <h2 className="text-4xl font-black text-slate-700 tracking-tight">About</h2> 
        <div className="bg-gradient-to-r from-blue-500 to-teal-300 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-4 md:gap-8"> 
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Icons.Profile />
        </div>
            <div> {isEditing ? (
  <input
    type="text"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    className="text-3xl font-black text-slate-900 bg-transparent border-b-2 border-black outline-none"
  />
) : (
  <h3 className="text-3xl font-black text-slate-900">
    {newName}
  </h3>
)}
<div className="text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline transition mt-3">
  {isEditing ? (
    <button
      onClick={handleSave}
      className="text-xs font-bold text-blue-600 underline tracking-wider"
    >
      Save
    </button>
  ) : (
    <button
      onClick={() => setIsEditing(true)}
      className="text-xs font-bold text-blue-700 underline tracking-wider"

    >
      Edit Username
    </button>
  )}
 <button
  onClick={() => {
    setIsEditing(false);
    setNewName(profile.name || user?.email?.split('@')[0]);
  }}
  className="text-xs px-2 py-1 underline text-red-500"
>
  Cancel
</button> 
</div>
               <div>
                <p className="text-slate-900 font-bold">Apastron V2.0 User</p> 
               <div className="mt-4 flex flex-wrap gap-2"> 
                <span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-black uppercase text-slate-500 tracking-wider">{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</span>
                <span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-black uppercase text-slate-500 tracking-wider">Weight = {profile.weight}kg</span>
                <span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-black uppercase text-slate-500 tracking-wider">Height = {profile.height}cm</span>

            </div>
            </div> 
        </div>
    </div> 
  <div className="bg-slate-900 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-white shadow-xl"> 
    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6">Apastron Profile</h3> 
    <p className="text-lg opacity-80 leading-relaxed mb-8"> Apastron Fitness is designed with data-driven progression and AI-assisted coaching for tracking weight-lifting sessions.<br></br> </p> 
    <p className="text-lg opacity-80 leading-relaxed mb-8"> 
        i. The tracking feature is built for seamless tracking of workouts.<br></br> <br></br> 
        ii. The quiz is designed to direct beginners to programs that align with their goals.<br></br> <br></br> 
        iii. The health feature calculates user's BMI and calorie intake.<br></br> <br></br> 
        iv. The AI coach is an in-built helper, answering user's fitness questions.<br></br><br></br> 
         All these features are directed towards assisting users to reach their peak in both fitness and life. </p> 
         <div className="border-t border-white/10 pt-8 flex justify-between items-center"> 
         <span className="text-sm font-bold">Mati Mary</span><br></br> 
         <span className="text-[10px] uppercase tracking-widest opacity-60">Developer</span>
            </div>
             <div className="border-t border-white/10 pt-8 flex justify-between items-center"> 
            <span className="text-sm font-bold">Contact and Support : </span>
         <span className="text-[14px] uppercase tracking-widest opacity-60">0721470589</span>
         </div>
        </div> 
</div> 
</PageContainer>
</div>
); };

export default About;