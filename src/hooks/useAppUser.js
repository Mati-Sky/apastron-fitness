import { useMemo } from "react";
import { useAuthFlow } from "./useAuthFlow";

export const useAppUser = ({ auth, db, appId, showToast, isDemoMode }) => {
  const authFlow = useAuthFlow({ auth, db, appId, showToast });
  const isDemo = isDemoMode || import.meta.env.VITE_APP_MODE === "demo";

  const demoUser = useMemo(() => {
    if (!isDemo) return null;

    return {
      uid: "demo-user",
      email: "demo@fittrack.com",
      isDemo: true,
    };
  }, [isDemo]);

  const demoFlow = useMemo(() => {
    if (!isDemo) return null;

    return {
      ...authFlow,
      user: demoUser,
      loading: false,
      memberStatus: "member",
      handleAuth: () => {},
      authError: null,
      setAuthError: () => {},
      isRegistering: false,
      setIsRegistering: () => {},
      setMemberStatus: () => {}
    };
  }, [authFlow, demoUser, isDemo]);

  return isDemo ? demoFlow : authFlow;
};