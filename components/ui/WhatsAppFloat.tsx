'use client';

import { useI18n } from '@/lib/i18n-context';
import { getWhatsAppUrl } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatProps {
  productName?: string;
  phoneNumber?: string;
}

export default function WhatsAppFloat({
  productName,
  phoneNumber = '+919876543210',
}: WhatsAppFloatProps) {
  const { t } = useI18n();

  const message = productName
    ? t('whatsapp.product', { product: productName })
    : t('whatsapp.generic');

  const waUrl = getWhatsAppUrl(phoneNumber, message);

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact AGROMIA on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white font-semibold rounded-full shadow-lg hover:bg-[#20ba59] hover:scale-105 transition-all duration-300 group"
    >
      <MessageCircle className="w-6 h-6 flex-shrink-0 fill-current" />
      <span className="hidden md:inline text-sm font-medium pr-1">WhatsApp</span>
    </a>
  );
}
