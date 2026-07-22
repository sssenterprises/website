'use client';

import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/data/site-data';

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/91${CONTACT_INFO.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}