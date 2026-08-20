'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type Locale = 'en' | 'hi' | 'har';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  isTransitioning: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

type Messages = Record<string, unknown>;
const messageCache: Record<string, Messages> = {};

async function loadMessages(locale: Locale): Promise<Messages> {
  if (messageCache[locale]) return messageCache[locale];
  try {
    const response = await fetch(`/api/i18n/${locale}`);
    if (!response.ok) throw new Error('Failed to load messages');
    const data = await response.json();
    messageCache[locale] = data;
    return data;
  } catch {
    const fallback = await import(`@/locales/${locale}.json`);
    messageCache[locale] = fallback.default;
    return fallback.default;
  }
}

function getNestedValue(obj: Messages, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Messages>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocale, setDisplayLocale] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = (localStorage.getItem('agromia-locale') as Locale) || 'en';
    loadMessages(savedLocale).then((msgs) => {
      setMessages(msgs);
      setLocaleState(savedLocale);
      setDisplayLocale(savedLocale);
    });
  }, []);

  const setLocale = useCallback(async (newLocale: Locale) => {
    if (newLocale === locale) return;
    setIsTransitioning(true);

    const newMessages = await loadMessages(newLocale);
    await new Promise((r) => setTimeout(r, 200));

    setMessages(newMessages);
    setLocaleState(newLocale);
    setDisplayLocale(newLocale);
    localStorage.setItem('agromia-locale', newLocale);

    await new Promise((r) => setTimeout(r, 50));
    setIsTransitioning(false);
  }, [locale]);

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    let value = getNestedValue(messages, key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }
    return value;
  }, [messages]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isTransitioning }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={displayLocale}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
