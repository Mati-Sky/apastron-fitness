import { useNavigation } from "../hooks/useNavigation";
import { useState } from "react";

const SidebarNav = ({ view, setView, signOut, auth, Icons, memberStatus }) => {
  const { showSidebar, desktopItems, isActive } = useNavigation(view);
  const LOCKED_VIEWS = ["program", "tracking", "ai"];
  
  const [showPaywallPrompt, setShowPaywallPrompt] = useState(false);
  const [pendingView, setPendingView] = useState(null);

  if (!showSidebar) return null;

  return (
    <>
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-black border-gray-800 p-6 flex-col transition-all duration-300 hover:w-72">
      <div
  className={`mb-4 px-3 py-2 rounded-xl text-sm font-semibold ${
    memberStatus === "member"
      ? "bg-gradient-to-r from-green-500 to-blue-600  text-slate-900"
      : "bg-gradient-to-r from-slate-300 via-slate-500 to-slate-600  text-slate-900"
  }`}
>
  {memberStatus === "member" ? "Premium Plan" : "Free Plan"}
</div>
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-12 mt-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icons.Dumbbell />
        </div>

        <h1 className="text-xl font-black tracking-tight">
          APASTRON FITNESS
        </h1>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex flex-col gap-2 flex-1">

        {desktopItems.map(item => {

          const Icon = Icons[item.icon];

          return (
            <button
  key={item.id}
  onClick={() => {
    if (LOCKED_VIEWS.includes(item.id) && memberStatus !== "member") {
  setPendingView(item.id);
  setShowPaywallPrompt(true);
  return;
}
    setView(item.id);
  }}
  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-semibold
    ${
      isActive(item.id)
        ? "bg-blue-500 text-white shadow-lg"
        : "text-slate-400 hover:bg-slate-900 hover:text-white"
    }
    ${
      LOCKED_VIEWS.includes(item.id) && memberStatus !== "member"
        ? "opacity-60 cursor-not-allowed"
        : ""
    }
  `}
>
  <Icon className="w-5 h-5" />

  <span>{item.label}</span>

  {LOCKED_VIEWS.includes(item.id) && memberStatus !== "member" && (
    <span className="text-xs ml-auto">🔒</span>
  )}
</button>
          );
        })}

      </nav>

      {/* LOGOUT */}
      <button
        onClick={() => signOut(auth)}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors"
      >
        <Icons.Lock className="w-5 h-5" />

        <span className="text-xs uppercase tracking-widest">
          Logout
        </span>

      </button>

    </aside>
  
    {showPaywallPrompt && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
      <h2 className="text-xl text-slate-900 font-bold">
        Premium Feature 🔒
      </h2>

      <p className="text-slate-900">
        This feature is locked for guests. Proceed to paywall?
      </p>

      <div className="flex gap-4 justify-center mt-4">
        
        {/* CANCEL */}
        <button
          onClick={() => {
            setShowPaywallPrompt(false);
            setPendingView(null);
          }}
          className="px-4 py-2 bg-red-500  text-white rounded-xl"
        >
          Cancel
        </button>

        {/* PROCEED */}
        <button
          onClick={() => {
            setShowPaywallPrompt(false);
            setView("paywall");
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-xl"
        >
          Proceed
        </button>

      </div>
    </div>
  </div>
)}
</>
  );
};

const BottomNav = ({ view, setView, Icons, memberStatus,signOut, auth }) => {
  const { showBottomNav, mobileItems, isActive } = useNavigation(view);

  const LOCKED_VIEWS = ["program", "tracking", "ai"];

  const [showPaywallPrompt, setShowPaywallPrompt] = useState(false);
  const [pendingView, setPendingView] = useState(null);

  if (!showBottomNav) return null;

  return (
    <>
      <nav className="md:hidden sticky top-0 inset-x-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-sm">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {mobileItems.map(item => {
          const Icon = Icons[item.icon];

          const isLocked =
            LOCKED_VIEWS.includes(item.id) && memberStatus !== "member";

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "logout") {
              signOut(auth);
               return;
               }
                  if (isLocked) {
                  setPendingView(item.id);
                  setShowPaywallPrompt(true);
                  return;
                }
                setView(item.id);
              }}
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all
                ${
                  isActive(item.id)
                    ? "text-blue-500 scale-110"
                    : "text-slate-500"
                }
                ${isLocked ? "opacity-60" : ""}
              `}
            >

              <Icon className="w-6 h-6" />
              {isLocked && <span className="text-xs">🔒</span>}
              <span className="text-[10px] font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
        </div>
      </nav>

      {/* PAYWALL MODAL (same as sidebar) */}
      {showPaywallPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl text-slate-900 font-bold">
              Premium Feature 🔒
            </h2>

            <p className="text-slate-900">
              This feature is locked for guests. Proceed to paywall?
            </p>

            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => {
                  setShowPaywallPrompt(false);
                  setPendingView(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowPaywallPrompt(false);
                  setView("paywall");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const Navigation = (props) => (
  <>
    <SidebarNav {...props} />
    <BottomNav {...props} />
  </>
);

export default Navigation;