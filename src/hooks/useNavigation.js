import { DESKTOP_NAV_ITEMS, MOBILE_NAV_ITEMS } from '../config/navigation';
export const useNavigation = (view) => {

  const isAuthFlow =
    view === "auth" || view === "onboarding" || view === "quiz";

  return {
    showSidebar: !isAuthFlow,
    showBottomNav: !isAuthFlow, // keep logic simple
    desktopItems: DESKTOP_NAV_ITEMS,
    mobileItems: MOBILE_NAV_ITEMS,
    isActive: (id) => view === id
  };
};