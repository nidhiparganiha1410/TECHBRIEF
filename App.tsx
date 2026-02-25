
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import StockTicker from './components/StockTicker';
import Home from './pages/Home';
import ArticleDetail from './pages/ArticleDetail';
import CategoryPage from './pages/CategoryPage';
import Admin from './pages/Admin';
import About from './pages/About';
import Login from './pages/Login';
import VideoPage from './pages/VideoPage';
import { APP_NAME, NAVIGATION } from './constants';
import { Twitter, Facebook, Linkedin, Instagram, Youtube, Send, Mail, MapPin, Phone, CheckCircle2, Loader2 } from 'lucide-react';

// Standard utility to scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ScriptInjector: React.FC = () => {
  const { adSettings, siteSettings } = useAppContext();

  useEffect(() => {
    // Inject Head Scripts (Analytics + Ad Codes)
    const head = document.head;
    const scripts: HTMLScriptElement[] = [];
    const metaTags: HTMLMetaElement[] = [];

    const injectHTML = (html: string) => {
      if (!html) return;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Inject scripts
      Array.from(doc.querySelectorAll('script')).forEach(s => {
        const script = document.createElement('script');
        if (s.src) script.src = s.src;
        script.textContent = s.textContent;
        head.appendChild(script);
        scripts.push(script);
      });

      // Inject metas
      Array.from(doc.querySelectorAll('meta')).forEach(m => {
        const meta = document.createElement('meta');
        Array.from(m.attributes).forEach(attr => meta.setAttribute(attr.name, attr.value));
        head.appendChild(meta);
        metaTags.push(meta);
      });
    };

    // Inject Search Console Tag directly
    if (siteSettings.searchConsoleTag) injectHTML(siteSettings.searchConsoleTag);
    if (siteSettings.googleAnalyticsId) injectHTML(siteSettings.googleAnalyticsId);
    if (siteSettings.otherVerificationTags) injectHTML(siteSettings.otherVerificationTags);
    if (adSettings.active && adSettings.headerCode) injectHTML(adSettings.headerCode);

    return () => {
      scripts.forEach(s => {
        if (head.contains(s)) head.removeChild(s);
      });
      metaTags.forEach(m => {
        if (head.contains(m)) head.removeChild(m);
      });
    };
  }, [adSettings, siteSettings]);

  return null;
};

const AppContent: React.FC = () => {
  const { adSettings, lang, categories } = useAppContext();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setSubStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setSubStatus('success');
      setNewsletterEmail('');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <ScrollToTop />
      <ScriptInjector />
      <StockTicker />
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Footer Ad Section */}
      {adSettings.active && adSettings.footerCode && (
        <div className="container mx-auto py-8 text-center" dangerouslySetInnerHTML={{ __html: adSettings.footerCode }} />
      )}

      <footer className="bg-[#020617] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mb-48"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
            {/* Branding & Mission */}
            <div className="lg:col-span-4 space-y-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">TB</div>
                <span className="text-3xl font-bold font-serif tracking-tight">{APP_NAME}</span>
              </Link>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Global intelligence for the next generation of builders, investors, and enthusiasts. We deliver high-fidelity tech journalism in multiple languages, powered by human expertise and AI synthesis.
              </p>
              <div className="flex items-center space-x-4">
                {[Twitter, Facebook, Linkedin, Instagram, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 border border-white/5">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links / Categories - Updated to use dynamic categories */}
            <div className="lg:col-span-2 space-y-8">
              <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Intelligence</h4>
              <ul className="space-y-4">
                {categories.map((cat, idx) => (
                  <li key={cat.id || idx}>
                    <Link to={`/category/${cat.slug}`} className="text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-3 group-hover:bg-blue-500 transition-colors"></span>
                      {cat.name[lang] || cat.name['en']}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company / Legal */}
            <div className="lg:col-span-2 space-y-8">
              <h4 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Publishing</h4>
              <ul className="space-y-4">
                {NAVIGATION.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} className="text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center group">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-3 group-hover:bg-blue-500 transition-colors"></span>
                       {(item.name as any)[lang] || item.name['en']}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-3 group-hover:bg-blue-500 transition-colors"></span>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5 backdrop-blur-md shadow-2xl transition-all duration-500">
                <h4 className="text-xl font-serif font-bold mb-4 text-white">The Daily Protocol</h4>
                <p className="text-slate-400 text-sm mb-6 font-medium">
                  Join 40k+ professionals receiving our curated technical briefings every morning.
                </p>
                
                {subStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-4 animate-fadeIn">
                    <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Protocol Established</p>
                    <p className="text-[10px] text-slate-500 mt-1">Check your inbox for the welcome transmission.</p>
                  </div>
                ) : (
                  <form className="relative group" onSubmit={handleSubscribe}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      disabled={subStatus === 'loading'}
                      placeholder="protocol@example.com"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-16 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={subStatus === 'loading' || !newsletterEmail.trim()}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center justify-center active:scale-95 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                      {subStatus === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    </button>
                  </form>
                )}
                
                <p className="text-[10px] text-slate-500 mt-4 text-center font-bold uppercase tracking-widest">No Spam. Just high-density signal.</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
               <span className="flex items-center"><MapPin size={12} className="mr-1.5 text-blue-500" /> Twin city , cyber Hub Bhilai</span>
               <span className="flex items-center"><Phone size={12} className="mr-1.5 text-emerald-500" /> +91 7999608471</span>
            </div>
            <div className="text-slate-600 text-xs font-bold text-center">
              &copy; {new Date().getFullYear()} {APP_NAME}. Engineered for the decentralized web.
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">System Status: All OK</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
