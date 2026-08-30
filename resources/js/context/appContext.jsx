import { createContext, useContext, useEffect, useState } from 'react';
import { supportedLanguages } from '@/lib/translations';

const AppContext = createContext();

const normalizeLanguage = (language) => {
    if (!language || !supportedLanguages.includes(language)) {
        return 'en';
    }

    return language;
};

const readStoredDarkMode = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const storedAppearance = localStorage.getItem('appearance');
    if (storedAppearance === 'dark' || storedAppearance === 'light') {
        return storedAppearance === 'dark';
    }

    const storedTheme = localStorage.getItem('darkMode');
    return storedTheme !== null && storedTheme !== 'false';
};

export const AppContextProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguageState] = useState(() => {
        if (typeof window === 'undefined') {
            return 'en';
        }

        return normalizeLanguage(localStorage.getItem('language'));
    });
    const [darkMode, setDarkMode] = useState(readStoredDarkMode);

    const setSelectedLanguage = (language) => {
        const normalized = normalizeLanguage(language);
        setSelectedLanguageState(normalized);
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', normalized);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem('language', selectedLanguage);
        localStorage.setItem('darkMode', String(darkMode));
        localStorage.setItem('appearance', darkMode ? 'dark' : 'light');
        document.documentElement.lang = selectedLanguage;
    }, [selectedLanguage, darkMode]);

    // Tailwind dark: variant uses @custom-variant dark (&:is(.dark *)) — sync context with <html>
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return <AppContext.Provider value={{ selectedLanguage, setSelectedLanguage, darkMode, setDarkMode }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
