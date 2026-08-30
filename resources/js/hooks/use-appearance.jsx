import { useSyncExternalStore } from 'react';










const listeners = new Set();
let currentAppearance = 'light';

const prefersDark = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const normalizeAppearance = (appearance) => {
  if (appearance === 'dark') {
    return 'dark';
  }

  return 'light';
};

const setCookie = (name, value, days = 365) => {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedAppearance = localStorage.getItem('appearance');

  if (storedAppearance === 'dark' || storedAppearance === 'light') {
    return normalizeAppearance(storedAppearance);
  }

  const fallbackAppearance = prefersDark() ? 'dark' : 'light';
  localStorage.setItem('appearance', fallbackAppearance);
  localStorage.setItem('darkMode', String(fallbackAppearance === 'dark'));

  return fallbackAppearance;
};

const isDarkMode = (appearance) => {
  return normalizeAppearance(appearance) === 'dark';
};

const applyTheme = (appearance) => {
  if (typeof document === 'undefined') {
    return;
  }

  const isDark = isDarkMode(appearance);

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback) => {
  listeners.add(callback);

  return () => listeners.delete(callback);
};

const notify = () => listeners.forEach((listener) => listener());

const mediaQuery = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => applyTheme(currentAppearance);

export function initializeTheme() {
  if (typeof window === 'undefined') {
    return;
  }

  const storedAppearance = getStoredAppearance();
  localStorage.setItem('appearance', storedAppearance);
  localStorage.setItem('darkMode', String(storedAppearance === 'dark'));
  setCookie('appearance', storedAppearance);

  currentAppearance = storedAppearance;
  applyTheme(currentAppearance);
  notify();

  mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
  const appearance = useSyncExternalStore(
    subscribe,
    () => currentAppearance,
    () => 'system'
  );

  const resolvedAppearance = isDarkMode(appearance) ?
  'dark' :
  'light';

  const updateAppearance = (mode) => {
    const nextAppearance = normalizeAppearance(mode);
    currentAppearance = nextAppearance;

    localStorage.setItem('appearance', nextAppearance);
    localStorage.setItem('darkMode', String(nextAppearance === 'dark'));
    setCookie('appearance', nextAppearance);

    applyTheme(nextAppearance);
    notify();
  };

  return { appearance, resolvedAppearance, updateAppearance };
}