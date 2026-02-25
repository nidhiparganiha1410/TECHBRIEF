
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { NAVIGATION, APP_NAME, SUPPORTED_LANGUAGES } from '../constants';
import { Menu, X, User as UserIcon, LogOut, Globe, ChevronDown } from 'lucide-react';
import { Language } from '../types';

const Header: React.FC = () => {
  const { lang, setLang, user, logout, isAdmin } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangChange = (code: Language) => {
    setLang(code);
    setIsLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              TB
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight font-serif text-white leading-none">{APP_NAME}</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Intelligence Hub</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAVIGATION.filter(item => !item.adminOnly || isAdmin).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-slate-300 hover:text-white font-bold text-sm transition-all rounded-xl hover:bg-white/5 flex items-center space-x-2"
              >
                <span className="opacity-70">{item.icon}</span>
                <span>{(item.name as any)[lang] || item.name['en']}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-xs font-bold text-slate-200 border border-white/10 shadow-sm"
              >
                <Globe size={14} className="text-slate-400" />
                <span>{currentLang.flag}</span>
                <span className="hidden lg:inline ml-1 uppercase">{currentLang.code}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn py-2 ring-1 ring-black/5">
                  <div className="max-h-72 overflow-y-auto custom-scrollbar px-1">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLangChange(l.code)}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between rounded-xl hover:bg-white/5 transition-colors ${lang === l.code ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{l.flag}</span>
                          <span className="text-sm">{l.label}</span>
                        </div>
                        {lang === l.code && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center space-x-2 pl-1">
                <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/30 font-bold text-sm">
                  {user.name[0].toUpperCase()}
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors bg-white/5 hover:bg-rose-500/10 rounded-xl"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center space-x-2"
              >
                <UserIcon size={14} />
                <span>{lang === 'en' ? 'SIGN IN' : (lang === 'ar' ? 'تسجيل الدخول' : 'INGRESAR')}</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-300 bg-white/5 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-white/5 py-6 px-4 space-y-4 shadow-2xl animate-slideDown">
          {NAVIGATION.filter(item => !item.adminOnly || isAdmin).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-4 rounded-2xl bg-white/5 text-slate-200 font-bold"
            >
              <span className="text-blue-400">{item.icon}</span>
              <span>{(item.name as any)[lang] || item.name['en']}</span>
            </Link>
          ))}
          {!user && (
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full py-4 bg-blue-600 text-white text-center rounded-2xl font-bold shadow-lg shadow-blue-500/20"
            >
              {lang === 'en' ? 'Get Started' : 'Empezar'}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;