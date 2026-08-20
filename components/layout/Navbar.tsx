'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useI18n, type Locale } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'har', label: 'हर' },
];

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const isHero = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/#about', label: t('nav.about') },
    { href: '/products', label: t('nav.products') },
    { href: '/#why', label: t('nav.why') },
    { href: '/#leadership', label: t('nav.leadership') },
    { href: '/#quality', label: t('nav.quality') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const navBg = scrolled || !isHero
    ? 'bg-white/95 backdrop-blur-nav border-b border-gray-100'
    : 'bg-transparent';

  const textColor = scrolled || !isHero ? 'text-charcoal' : 'text-white';
  const logoColor = scrolled || !isHero ? 'text-forest' : 'text-white';

  return (
    <>
      <motion.header
        className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', navBg)}
        style={{ boxShadow: scrolled ? 'var(--shadow-nav)' : 'none' }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container-brand">
          <div className="flex items-center justify-between" style={{ height: scrolled ? '60px' : '72px', transition: 'height 0.3s ease' }}>
            <Link
              href="/"
              className={cn('flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded', logoColor)}
              aria-label="AGROMIA — Home"
            >
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="AGROMIA" className="h-9 w-auto object-contain" />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-5" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'py-2 text-xs font-medium tracking-wide transition-all duration-200 hover:opacity-60',
                    textColor
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={cn(
                    'flex items-center gap-1.5 px-1 py-1.5 text-xs font-semibold transition-all duration-200',
                    scrolled || !isHero
                      ? 'border-gray-200 text-gray-600 hover:border-forest hover:text-forest'
                      : 'border-white/40 text-white/90 hover:border-white hover:text-white'
                  )}
                >
                  <span>{LOCALES.find((l) => l.code === locale)?.label}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 py-1 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[100px]"
                    >
                      {LOCALES.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLocale(l.code); setLangOpen(false); }}
                          className={cn(
                            'w-full px-4 py-2 text-sm text-left hover:bg-cream transition-colors',
                            locale === l.code ? 'text-forest font-semibold' : 'text-charcoal'
                          )}
                        >
                          {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/enquire"
                className={cn('btn-editorial btn-editorial-link transition-all duration-300', scrolled || !isHero ? 'text-forest border-forest' : 'text-white border-white')}
              >
                {t('nav.enquire')}
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn('lg:hidden p-2 rounded-md transition-colors', textColor)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-[360px] bg-white flex flex-col p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <img src="/logo.png" alt="AGROMIA" className="h-8 w-auto object-contain" />
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block py-2.5 text-base font-medium text-charcoal hover:text-forest">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Lang:</span>
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={cn(
                        'px-2.5 py-1 text-xs rounded border',
                        locale === l.code ? 'bg-forest text-white' : 'bg-white text-gray-600'
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                <Link href="/enquire" className="btn btn-primary w-full justify-center">
                  {t('nav.enquire')}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

