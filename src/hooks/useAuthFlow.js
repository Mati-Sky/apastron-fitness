import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const useAuthFlow = ({ auth, db, appId,showToast }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [memberStatus, setMemberStatus] = useState('guest');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (email, password) => {
    try {
      setAuthError('');
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        showToast("Account created successfully");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Logged in successfully");
      }
    } catch (error) {

  let message = "Authentication failed.";

  switch (error.code) {

    case "auth/user-not-found":
      message = "No account found with that email. Try registering.";
      break;

    case "auth/wrong-password":
      message = "Incorrect password. Please try again.";
      break;

    case "auth/invalid-email":
      message = "Invalid email format.";
      break;

    case "auth/email-already-in-use":
      message = "An account already exists with this email.";
      break;

    case "auth/weak-password":
      message = "Password must be at least 6 characters.";
      break;
      
      case "auth/too-many-requests":
    message = "Too many failed attempts. Access to this account has been temporarily disabled. Please try again later or reset your password.";
    break;

    case "auth/invalid-credential":
      message = "Invalid email or password.";
      break;

    default:
      message = "Login failed. Please try again.";
  }

  setAuthError(message);
}
  };

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log("Auth state changed:", u);
      if (u?.email) {
        try {
          const memberDoc = await getDoc(
                doc(db, "artifacts", appId, "users", u.uid, "profile", "membership"));
                const isMember = memberDoc.exists() && memberDoc.data().status === "member";

          setMemberStatus(isMember ? "member" : "guest");
          setUser(u);
          if (!memberDoc.exists()) {
  showToast("Access limited — upgrade required", "warning");
}
        } catch (err) {
          console.error("Firestore read failed:", err);
        }
      } else {
        setUser(null);
        setMemberStatus("guest");
      }
      setLoading(false);
    });

    // ----- EMERGENCY FALLBACK ----- 
    // after 1.5 seconds, stop loading even if onAuthStateChanged hasn't fired
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Firebase auth timed out, showing login anyway.");
        setLoading(false);
      }
    }, 1500);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [auth, db, appId]);

  return {
    user,
    loading,
    authError,
    memberStatus,
    setMemberStatus,
    isRegistering,
    setAuthError,
    setIsRegistering,
    handleAuth
  };
};