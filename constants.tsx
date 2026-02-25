
import React from 'react';
import { Newspaper, Info, ShieldCheck, Home, PlayCircle } from 'lucide-react';
import { Language } from './types';

export const NAVIGATION = [
  { name: { en: 'Home', es: 'Inicio', hi: 'होम', ru: 'Главная', fr: 'Accueil', 'fr-ca': 'Accueil', ar: 'الرئيسية' }, path: '/', icon: <Home size={18} /> },
  { name: { en: 'Videos', es: 'Videos', hi: 'वीडियो', ru: 'Видео', fr: 'Vidéos', 'fr-ca': 'Vidéos', ar: 'فيديوهات' }, path: '/videos', icon: <PlayCircle size={18} /> },
  { name: { en: 'About', es: 'Sobre Nosotros', hi: 'हमारे बारे में', ru: 'О нас', fr: 'À propos', 'fr-ca': 'À propos', ar: 'حول' }, path: '/about', icon: <Info size={18} /> },
  { name: { en: 'Admin', es: 'Admin', hi: 'एडमिन', ru: 'Админ', fr: 'Admin', 'fr-ca': 'Admin', ar: 'مسؤول' }, path: '/admin', icon: <ShieldCheck size={18} />, adminOnly: true },
];

export const CATEGORIES = [
  { en: 'AI', es: 'IA', hi: 'एआई', ru: 'ИИ', fr: 'IA', 'fr-ca': 'IA', ar: 'الذكاء الاصطناعي' },
  { en: 'Software', es: 'Software', hi: 'सॉफ्टवेयर', ru: 'ПО', fr: 'Logiciel', 'fr-ca': 'Logiciel', ar: 'برمجيات' },
  { en: 'Hardware', es: 'Hardware', hi: 'हार्डवेयर', ru: 'Железо', fr: 'Matériel', 'fr-ca': 'Matériel', ar: 'عتاد' },
  { en: 'Crypto', es: 'Cripto', hi: 'क्रिप्टो', ru: 'Крипто', fr: 'Crypto', 'fr-ca': 'Crypto', ar: 'تشفير' },
  { en: 'Mobile', es: 'Móvil', hi: 'मोबाइल', ru: 'Мобильный', fr: 'Mobile', 'fr-ca': 'Mobile', ar: 'جوال' }
];

export const SUPPORTED_LANGUAGES: { code: Language; label: string; flag: string; dir?: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'fr-ca', label: 'Français (CA)', flag: '🇨🇦' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const APP_NAME = "Tech Brief Pro";
