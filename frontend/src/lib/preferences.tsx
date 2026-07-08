import React, { createContext, useContext, useState } from "react";

interface Preferences {
  compactMode: boolean;
  sidebarCollapsed: boolean;
}

interface PreferencesContextType extends Preferences {
  setCompactMode: (v: boolean) => void;
  setSidebarCollapsed: (v: boolean) => void;
}

const STORAGE_KEY = "eos_preferences";

function loadPrefs(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { compactMode: false, sidebarCollapsed: false, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return { compactMode: false, sidebarCollapsed: false };
}

function savePrefs(prefs: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(loadPrefs);

  const setCompactMode = (v: boolean) => {
    setPrefs(prev => {
      const next = { ...prev, compactMode: v };
      savePrefs(next);
      return next;
    });
  };

  const setSidebarCollapsed = (v: boolean) => {
    setPrefs(prev => {
      const next = { ...prev, sidebarCollapsed: v };
      savePrefs(next);
      return next;
    });
  };

  return (
    <PreferencesContext.Provider value={{ ...prefs, setCompactMode, setSidebarCollapsed }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
