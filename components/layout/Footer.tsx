'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

const PLACEHOLDER_CONTACT = {
  phone: '[PHONE]',
  email: '[EMAIL]',
  address: 'Haridwar Road, Chandok, District Bijnor, Uttar Pradesh – 246721',
  whatsapp: '[WHATSAPP]',
};

export default function Footer() {
  const { t, locale } = useI18n();
  const isDevanagari = locale !== 'en';

  const quickLinks = [
    { href: '/#about', label: t('nav.about') },
    { href: '/products', label: t('nav.products') },
    { href: '/#why', label: t('nav.why') },
    { href: '/#leadership', label: t('nav.leadership') },
    { href: '/#quality', label: t('nav.quality') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const productLinks = [
    { href: '/products/fungicides', label: t('categories.fungicides.name') },
    { href: '/products/insecticides', label: t('categories.insecticides.name') },
    { href: '/products/seed-treatment', label: t('categories.seed-treatment.name') },
  ];

  const legalLinks = [
    { href: '/legal/privacy-policy', label: t('footer.privacy') },
    { href: '/legal/terms', label: t('footer.terms') },
    { href: '/legal/disclaimer', label: t('footer.disclaimer') },
    { href: '/legal/cookie-policy', label: t('footer.cookies') },
  ];

  return (
    <footer className="bg-forest text-white" role="contentinfo">
      <div className="container-brand py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-2xl tracking-tight text-white">AGROMIA</span>
            </Link>
            <p className={cn('text-sm text-white/70 leading-relaxed max-w-[220px] mb-6', isDevanagari && 'font-devanagari-sans')}>
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-label text-white/50 mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label text-white/50 mb-4">{t('footer.products')}</h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label text-white/50 mb-4">{t('footer.contact_us')}</h3>
            <ul className="space-y-3.5">
              <li>
                <a href={`tel:${PLACEHOLDER_CONTACT.phone}`} className="flex items-start gap-2.5 text-sm text-white/80 hover:text-white">
                  <Phone className="w-4 h-4 mt-0.5 text-sage" />
                  <span>{PLACEHOLDER_CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${PLACEHOLDER_CONTACT.email}`} className="flex items-start gap-2.5 text-sm text-white/80 hover:text-white">
                  <Mail className="w-4 h-4 mt-0.5 text-sage" />
                  <span>{PLACEHOLDER_CONTACT.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/80">
                  <MapPin className="w-4 h-4 mt-0.5 text-sage" />
                  <address className="not-italic leading-relaxed">{PLACEHOLDER_CONTACT.address}</address>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-brand py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4 flex-wrap">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-white/50 hover:text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
