import { create } from 'zustand';

export type PageName = 'home' | 'products' | 'services' | 'dealers' | 'contact' | 'admin';

interface NavigationState {
  currentPage: PageName;
  adminAuth: boolean;
  navigate: (page: PageName) => void;
  setAdminAuth: (auth: boolean) => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPage: 'home',
  adminAuth: false,
  navigate: (page: PageName) => {
    if (page === 'admin') {
      // Check if already authenticated
      const auth = useNavigation.getState().adminAuth;
      if (!auth) {
        set({ currentPage: 'admin' });
      } else {
        set({ currentPage: 'admin' });
      }
    } else {
      set({ currentPage: page });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  setAdminAuth: (auth: boolean) => {
    set({ adminAuth: auth });
  },
}));