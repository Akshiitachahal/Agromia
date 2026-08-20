import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function categorySlugToColor(slug: string): string {
  const map: Record<string, string> = {
    fungicides: '#2D5A3D',
    insecticides: '#8B3A3A',
    'seed-treatment': '#3A4E8B',
  };
  return map[slug] || '#2D5A3D';
}
