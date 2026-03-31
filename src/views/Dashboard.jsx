import { Icons } from "../lib/icons";
import hardcore from  "../assets/images/hardcore.png";
import { motion } from "framer-motion";

const Dashboard = ({ setView, profile, user, memberStatus, logs, todayRoutine, todayIndex }) => {

  const safeLogs = Array.isArray(logs) ? logs : [];

const todayVolume = safeLogs
    .filter(l => l.dayIndex === todayIndex)
    .reduce((acc, curr) => acc + curr.weight * curr.sets * curr.reps, 0);

const backgroundStyle = {
    backgroundImage: `url(${hardcore})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh', 
  };

 const childVariants = {
  hidden: (i) => ({
    opacity: 0,
    x: i % 2 === 0 ? -60 : 60 // 👈 alternate sides
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};
if (!todayRoutine) {
  return (
    <div className="p-10 text-slate-500">
      Loading dashboard...
    </div>
  );
}
  return (
    <div style={backgroundStyle} className="h-96 bg-cover w-full bg-center rounded-3xl">
  <div className="max-w-7xl mx-auto space-y-10">
  <div className="flex flex-col items-center leading-tight space-y-1">
  
  <div className="group flex items-center gap-2 group-hover:scale-[1.02] transition-transform duration-300">
    <h1 className="flex items-center gap-2 text-2xl sm:text-3xl md:text-5xl font-bold italic tracking-tight">
    <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
      🏋🏽 APASTRON
    </span>
    <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-slate-600 bg-clip-text text-transparent">
      FITNESS 🏋🏽
    </span>
</h1>
 </div>

  <p className="text-sm sm:text-base md:text-lg font-bold text-slate-200 opacity-90 drop-shadow-[0_0_1px_rgba(0,1,1,1)]">
    Be ready to ascend to new heights 🚀
  </p>

</div>

      {/* HEADER */}
      <div><header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-200">
        <div>
          <h2 className="text-4xl font-black text-slate-700 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 font-bold mt-1 text-lg">
            Welcome back, {profile?.name || user?.email?.split('@')[0]}
          </p>
        </div>

        <div
          className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-inner ${
            memberStatus === "member"
              ? "bg-green-100 text-green-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {memberStatus === "member" ? "Pro Member" : "Guest Pass"}
        </div>
      </header>

<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  }}
>
      <div className="grid lg:grid-cols-3 gap-4 md:gap-8 mt-4">

        {/* DAILY WORKOUT CARD */}
        <motion.div variants={childVariants} className="bg-gradient-to-r from-blue-500 to-teal-500 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] hover:shadow-x1 text-white md:items-center col-span-1 group">

          <div className="absolute -right-10 -top-10 opacity-10 transform rotate-12 scale-150 transition-transform group-hover:scale-125">
            <Icons.Dumbbell />
          </div>

          <p className="text-xs font-black uppercase tracking-[0.3em] text-opacity-60 mb-2">
            Today's Focus
          </p>

          <h3 className="text-4xl font-black mb-6">
            {todayRoutine?.name || "Rest Day"}
          </h3>

          <div className="flex flex-wrap gap-2 mb-8">
            {todayRoutine?.exercises?.length > 0 ? (
              todayRoutine.exercises.slice(0, 3).map((ex, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-bold"
                >
                 {typeof ex === "string"
                          ? ex
                          : `${ex.name} (${ex.sets}×${ex.reps})`}
                </span>
              ))
            ) : (
              <span className="px-4 py-2 bg-white/10 rounded-xl text-xs">
                Recovery Day
              </span>
            )}

            {todayRoutine.exercises.length > 3 && (
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-bold">
                +{todayRoutine.exercises.length - 3}
              </span>
            )}
          </div>

          <button
            onClick={() => setView("tracking")}
            className="w-full py-5 bg-white text-blue-600 transition-transform duration-100 hover:scale-105 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-50 hover:shadow-lg active:scale-95"
          >
            Start Session
          </button>
        </motion.div>

        {/* SESSION VOLUME CARD */}
        <motion.div variants={childVariants} className=" bg-gradient-to-r from-teal-500 to-green-600 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] flex flex-col justify-center ">

          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            Session Volume
          </p>

          <h3 className="text-6xl font-black text-slate-900 tracking-tighter">
            {todayVolume.toLocaleString()}
            <span className="text-2xl text-slate-300 ml-2">kg</span>
          </h3>
        </motion.div>

        {/* RECENT ACTIVITY CARD */}
        <motion.div variants={childVariants} className="bg-gradient-to-r from-green-600 to-slate-600 p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-white ">

          <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-6">
            Recent Logs
          </p>

          <div className="space-y-4">

            {(Array.isArray(logs) ? logs : Object.values(logs)).slice(0,3).map((l, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm border-b border-white/10 pb-3 last:border-0"
              >
                <span className="font-bold text-lg">
                  {l.exercise}
                </span>

                <span className="text-green-400 font-mono">
                  {l.weight}kg
                </span>
              </div>
            ))}

            {safeLogs.length === 0 && (
              <p className="text-sm text-green-400 italic py-4">
                No recent activity recorded.
              </p>
            )}

          </div>
        </motion.div>

      </div>
      </motion.div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;