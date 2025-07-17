// store/globalStore.ts
import { create } from 'zustand';

type GlobalState = {
  theme: 'light' | 'dark';
  language: 'en' | 'ur';
  isLoading: boolean;
  loggedIn: boolean;
  email: string,
  password: string,
  setEmail: (email: string) => void,
  setPassword: (password: string) => void,
  setLoggedin: (loggedIn: boolean) => void,
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'ur') => void;
  setLoading: (loading: boolean) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  theme: 'light',
  language: 'en',
  isLoading: false,
  loggedIn: false,
  email: "1",
  password: "1",
  setEmail: (email) => set({ email}),
  setPassword: (password) => set({ password}),
  setLoggedin: (loggedIn) => set({ loggedIn}),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setLoading: (isLoading) => set({ isLoading })
}));
