import React from "react";
import { Icons } from "../lib/icons";
import couple from  "../assets/images/couple.png";
import { useState } from "react";

const Auth = ({
  handleAuth,
  authError,
  isRegistering,
  setAuthError,
  setIsRegistering,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const backgroundStyle = {
    backgroundImage: `url(${couple})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100vw', 
    height: '120vh', 
  };
  return (
      <div style={backgroundStyle} className="h-96 bg-cover w-full rounded-3xl">
             <div className="relative max-w-md mx-auto pt-8 animate-in fade-in">
                    <header className="text-center mb-10">
                      <div className="group w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6
  shadow-2xl shadow-green-100
  transform transition-all duration-500 ease-out
  animate-float hover:animate-none
  hover:rotate-6 hover:scale-110 hover:shadow-green-300">

  <Icons.Dumbbell className="w-8 h-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" /></div>
                      <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-teal-500 tracking-tighter mb-2">APASTRON FITNESS</h1>
                      <p className="text-blue-400 font-bold text-sm uppercase tracking-[0.4em]">Get to your Fitness Peak</p>
                    </header>
                   
                    <form
                   onSubmit={(e) => {
                  e.preventDefault();
                   const email = e.target.email.value;
                   const password = e.target.password.value;
                   handleAuth(email, password);}}
                   className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6"
                    >
                      <h2 className="text-3xl font-black text-slate-800">{isRegistering ? 'Join Us' : 'Welcome'}</h2>
                      {authError && (
                     <div className="bg-red-600 border border-red-800 text-red-200 p-4 rounded-lg mb-4">
                       {authError}
                    </div>
                    )}
                      <div className="space-y-4">
                        <input name="email" type="email" placeholder="Email Address" required onChange={() => {
                           if (authError) setAuthError(null);
                           }}className="w-full p-5 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-medium transition-all hover:bg-slate-100" />
                        <div className="relative w-full">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    required
    onChange={() => authError && setAuthError(null)}
    className="w-full p-5 pr-14 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-medium transition-all hover:bg-slate-100"
  />

  <button title="Show Password"
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all duration-200 text-slate-500 hover: hover:text-slate-800"
  >
    {showPassword ? (
      <Icons.EyeOff className="w-5 h-5" />
    ) : (
      <Icons.Eye className="w-5 h-5" />
    )}
  </button>
</div>
                      </div>

                      <button type="submit" className="w-full py-5 bg-green-600 text-white font-bold rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95">{isRegistering ? 'Confirm Registration' : 'Enter Portal'}</button>
                      <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full py-5 bg-green-600 text-center text-white font-bold rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-colors">{isRegistering ? 'Login Instead' : 'Create Account'}</button>
                    </form>
                    <p><br></br></p>
                    <p className="text-blue-400 font-bold">Gym Policy</p>
                    <p className="text-green-400 font-bold text-sm italic ">**Official gym members receive complimemntary access. Guests can register via Mpesa to unlock elite tracking**</p>
                    </div>
     </div>
  );
};

export default Auth;
