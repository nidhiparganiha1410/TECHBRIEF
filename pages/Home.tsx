
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Sparkles, Flame, Star, Mail, ArrowUpRight, Globe, Layers, Cpu, Bitcoin, Smartphone, Trophy, Radio, Calendar as CalendarIcon, ExternalLink, MapPin, Users as UsersIcon, ArrowRight, Share2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCricketUpdate } from '../services/geminiService';

const CricketWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cricketInfo, setCricketInfo] = useState<{ text: string; links: { title: string; uri: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCricketUpdate();
        setCricketInfo(data);
        setError(null);
      } catch (err: any) {
        if (err.message === "QUOTA_EXHAUSTED") {
          setCricketInfo({ 
            text: "Live updates temporarily paused due to API quota limits. Check back later.", 
            links: [] 
          });
        } else {
          setError("Updates unavailable.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parseFixtures = (rawText: string) => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const fixturesIndex = lines.findIndex(l => l.toLowerCase().includes('upcoming') || l.toLowerCase().includes('schedule'));
    if (fixturesIndex === -1) return [];

    return lines.slice(fixturesIndex + 1)
      .filter(l => !l.includes('---') && !l.toLowerCase().includes('opponent') && !l.toLowerCase().includes('date'))
      .map(l => l.replace(/\|/g, '').trim())
      .filter(l => l.length > 5);
  };

  const fixtures = cricketInfo ? parseFixtures(cricketInfo.text) : [];

  return (
    <div className="bg-gradient-to-br from-[#0c1a26] via-[#102435] to-[#0c1a26] rounded-[2.5rem] p-8 border border-white/5 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Global Sports Pulse</span>
            {!loading && cricketInfo?.text.toLowerCase().includes('live score') && (
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white leading-tight">
            Indian Cricket <br /> <span className="text-slate-400 font-medium">Intelligence</span>
          </h3>
        </div>
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
          <Trophy size={28} className="text-yellow-500" />
        </div>
      </div>

      <div className="relative z-10 space-y-8">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-20 bg-white/5 rounded-3xl w-full"></div>
            <div className="space-y-3">
              <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
              <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#020617]/40 rounded-3xl p-6 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${cricketInfo?.text.toLowerCase().includes('no live match') ? 'bg-slate-500' : 'bg-rose-500 animate-pulse'}`}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Status</span>
                </div>
                <Radio size={14} className="text-blue-500 opacity-50" />
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                {cricketInfo?.text.split('\n\n')[0]}
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarIcon size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upcoming Fixtures</span>
                </div>
                <span className="text-[9px] font-bold text-slate-600 uppercase">Next 3 Games</span>
              </div>
              
              <div className="space-y-3">
                {fixtures.length > 0 ? fixtures.map((fixture, idx) => (
                  <div key={idx} className="bg-white/5 hover:bg-white/10 transition-all border border-white/5 rounded-2xl p-4 group/match">
                    <div className="flex flex-col space-y-2">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <UsersIcon size={12} className="text-blue-400" />
                            <span className="text-xs font-bold text-white group-hover/match:text-blue-400 transition-colors">{fixture.split('*').join('')}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-xs text-slate-500 font-medium italic p-4 text-center border border-dashed border-white/10 rounded-2xl">
                    No upcoming schedule found in reports.
                  </div>
                )}
              </div>
            </div>

            {cricketInfo?.links && cricketInfo.links.length > 0 && (
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center space-x-2 mb-3">
                   <Globe size={12} className="text-slate-500" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Grounding Sources</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cricketInfo.links.slice(0, 3).map((link, i) => (
                    <a 
                      key={i} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] text-blue-400 hover:text-white transition-all bg-blue-500/5 hover:bg-blue-600/20 px-3 py-1.5 rounded-xl border border-blue-500/10"
                    >
                      {link.title.substring(0, 15)}... <ExternalLink size={10} className="ml-1.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 relative z-10 flex items-center justify-between">
        <a href="https://www.bcci.tv" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center group">
          BCCI.tv Official Scorecard
          <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const { lang, articles } = useAppContext();
  const [sliderIndex, setSliderIndex] = useState(0);

  const publishedArticles = articles.filter(a => a.status === 'published');
  const sliderPosts = publishedArticles.filter(a => a.isFeatured);
  const trendingPosts = publishedArticles.slice(0, 5);
  const highlightPosts = publishedArticles.slice(0, 3);
  const spotlightPost = publishedArticles[4] || publishedArticles[0];

  useEffect(() => {
    if (sliderPosts.length <= 1) return;
    const timer = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % sliderPosts.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [sliderPosts.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setSliderIndex(prev => (prev - 1 + sliderPosts.length) % sliderPosts.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setSliderIndex(prev => (prev + 1) % sliderPosts.length);
  };

  const renderCategoryGrid = (category: string) => {
    const catArticles = publishedArticles.filter(a => a.category === category);
    if (catArticles.length === 0) return null;

    // 1. AI: THE NEURAL GRID (Hero + Side List)
    if (category === 'AI') {
      return (
        <div key={category} className="space-y-8 py-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-3xl font-serif font-bold flex items-center text-white">
              <span className="w-2.5 h-8 bg-blue-600 rounded-full mr-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]"></span>
              Intelligence & AI
            </h3>
            <Link to={`/category/ai`} className="flex items-center space-x-2 text-blue-400 hover:text-white transition-colors cursor-pointer group">
              <span className="text-xs font-black uppercase tracking-widest">Neural Network</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8">
               <ArticleCard article={catArticles[0]} lang={lang as any} />
             </div>
             <div className="lg:col-span-4 flex flex-col space-y-4">
               {catArticles.slice(1, 4).map(a => (
                 <Link key={a.id} to={`/article/${a.id}`} className="flex space-x-4 p-4 bg-white/[0.03] backdrop-blur-md rounded-[2rem] hover:bg-white/[0.08] border border-white/5 transition-all group shadow-xl">
                   <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-2xl">
                    <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <div className="flex flex-col justify-center">
                     <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">{a.category}</span>
                     <h4 className="font-bold text-xs line-clamp-2 text-slate-100 group-hover:text-blue-400 transition-colors leading-tight">{a.title[lang] || a.title['en']}</h4>
                   </div>
                 </Link>
               ))}
             </div>
          </div>
        </div>
      );
    }

    // 2. SOFTWARE: THE DEV STACK (Alternating Horizontal Zig-Zag)
    if (category === 'Software') {
      return (
        <div key={category} className="space-y-8 py-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-3xl font-serif font-bold flex items-center text-white">
              <span className="w-2.5 h-8 bg-emerald-500 rounded-full mr-4 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></span>
              Dev Channel
            </h3>
            <Layers className="text-emerald-500" size={24} />
          </div>
          <div className="grid grid-cols-1 gap-6">
            {catArticles.slice(0, 3).map((a, idx) => (
              <Link 
                key={a.id} 
                to={`/article/${a.id}`} 
                className={`flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-to-r ${idx % 2 === 0 ? 'from-white/5 to-transparent' : 'from-transparent to-white/5 md:flex-row-reverse'} rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group`}
              >
                <div className="md:w-1/3 aspect-video overflow-hidden rounded-3xl border border-white/10">
                  <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="md:w-2/3 space-y-3">
                   <div className="flex items-center space-x-2 text-emerald-400">
                      <Cpu size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Stack Architecture</span>
                   </div>
                   <h4 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                     {a.title[lang] || a.title['en']}
                   </h4>
                   <p className="text-slate-400 text-sm line-clamp-2">{a.summary[lang] || a.summary['en']}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // 3. HARDWARE: THE SHOWCASE (3-Column Benchmarks)
    if (category === 'Hardware') {
      return (
        <div key={category} className="space-y-8 py-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-3xl font-serif font-bold flex items-center text-white">
              <span className="w-2.5 h-8 bg-amber-500 rounded-full mr-4 shadow-[0_0_15px_rgba(245,158,11,0.4)]"></span>
              Hardware Lab
            </h3>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-1 rounded-full border border-amber-500/20">Benchmarks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {catArticles.slice(0, 3).map(a => (
               <Link key={a.id} to={`/article/${a.id}`} className="group bg-[#020617] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-amber-500/40 transition-all">
                  <div className="aspect-square overflow-hidden relative">
                    <img src={a.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                       <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">{a.title[lang] || a.title['en']}</h4>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex justify-between items-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{a.date}</div>
                    <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-amber-500">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
               </Link>
            ))}
          </div>
        </div>
      );
    }

    // 4. CRYPTO: THE LEDGER (High-Density List)
    if (category === 'Crypto') {
      return (
        <div key={category} className="space-y-8 py-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-3xl font-serif font-bold flex items-center text-white">
              <span className="w-2.5 h-8 bg-orange-500 rounded-full mr-4 shadow-[0_0_15px_rgba(249,115,22,0.4)]"></span>
              Digital Assets
            </h3>
            <Bitcoin className="text-orange-500 animate-pulse" size={24} />
          </div>
          <div className="bg-[#020617]/50 rounded-[2.5rem] border border-white/5 overflow-hidden divide-y divide-white/5">
            {catArticles.slice(0, 4).map(a => (
              <Link key={a.id} to={`/article/${a.id}`} className="flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all group">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={a.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-100 group-hover:text-orange-400 transition-colors">{a.title[lang] || a.title['en']}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{a.summary[lang]?.substring(0, 80)}...</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                   <div className="text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20">Market Log</div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase">{a.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // 5. MOBILE: THE OS DECK (2-Column Grid)
    if (category === 'Mobile') {
      return (
        <div key={category} className="space-y-8 py-8">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-3xl font-serif font-bold flex items-center text-white">
              <span className="w-2.5 h-8 bg-indigo-500 rounded-full mr-4 shadow-[0_0_15px_rgba(99,102,241,0.4)]"></span>
              Mobile Era
            </h3>
            <Smartphone className="text-indigo-400" size={24} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {catArticles.slice(0, 4).map(a => (
              <Link key={a.id} to={`/article/${a.id}`} className="group relative overflow-hidden rounded-[2.5rem] aspect-[16/10] border border-white/10">
                <img src={a.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">Mobile OS</span>
                   <h4 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">{a.title[lang] || a.title['en']}</h4>
                   <div className="flex items-center space-x-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold">{a.author[0]}</div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{a.date}</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div key={category} className="space-y-6">
        <h3 className="text-2xl font-serif font-bold flex items-center text-white">
          <span className="w-8 h-1 bg-slate-300 mr-3"></span>
          {category}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catArticles.map(a => <ArticleCard key={a.id} article={a} lang={lang as any} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-10 pb-12 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4 relative rounded-[2.5rem] overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl min-h-[480px]">
              {sliderPosts.length > 0 ? sliderPosts.map((item, idx) => (
                <div 
                  key={item.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === sliderIndex ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full z-0 pointer-events-none'}`}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center text-white space-y-5">
                      <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
                        {item.title[lang] || item.title['en']}
                      </h1>
                      
                      {/* Restore missing Highlights/Bullet Points in Slider */}
                      {item.highlights && (item.highlights[lang] || item.highlights['en']) && (
                        <ul className="space-y-2 mt-4">
                          {(item.highlights[lang] || item.highlights['en']).slice(0, 3).map((point, i) => (
                            <li key={i} className="flex items-start text-slate-300 text-sm font-medium">
                              <Sparkles className="text-blue-400 mr-2 mt-1 shrink-0" size={14} />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="pt-2">
                        <Link to={`/article/${item.id}`} className="inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl">
                          Explore Insights
                        </Link>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-6 md:p-10">
                       <img src={item.imageUrl} className="w-full h-full object-cover rounded-[2rem]" alt={item.title['en']} />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-bold">Featured content arriving soon...</div>
              )}
              {sliderPosts.length > 1 && (
                <div className="absolute bottom-8 right-8 flex space-x-3 z-20">
                  <button onClick={handlePrev} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white transition-all"><ChevronLeft size={20} /></button>
                  <button onClick={handleNext} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white transition-all"><ChevronRight size={20} /></button>
                </div>
              )}
            </div>
            {spotlightPost && (
              <div className="lg:w-1/4">
                 <Link to={`/article/${spotlightPost.id}`} className="block h-full bg-white/5 rounded-[2.5rem] p-6 border border-white/10 hover:border-blue-500 transition-all group">
                    <img src={spotlightPost.imageUrl} className="h-48 w-full object-cover rounded-3xl mb-6" />
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 leading-tight mb-4">
                      {spotlightPost.title[lang] || spotlightPost.title['en']}
                    </h3>
                    
                    {/* Add key points to spotlight section */}
                    {spotlightPost.highlights && (spotlightPost.highlights[lang] || spotlightPost.highlights['en']) && (
                      <ul className="space-y-2 mb-6">
                        {(spotlightPost.highlights[lang] || spotlightPost.highlights['en']).slice(0, 2).map((point, i) => (
                          <li key={i} className="flex items-start text-slate-400 text-[11px] leading-snug">
                            <Zap className="text-amber-500 mr-2 shrink-0" size={12} />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <span className="text-xs font-bold text-blue-400 flex items-center">
                      Read Spotlight <ChevronRight size={14} />
                    </span>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow lg:w-2/3 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlightPosts.map((a) => (
                <Link key={a.id} to={`/article/${a.id}`} className="flex bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:-translate-y-1 transition-all h-32">
                  <div className="w-1/3 flex-shrink-0"><img src={a.imageUrl} className="w-full h-full object-cover" /></div>
                  <div className="p-4 flex flex-col justify-center">
                    <span className="text-[9px] font-black text-blue-400 uppercase mb-1.5">{a.category}</span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2">{a.title[lang] || a.title['en']}</h4>
                  </div>
                </Link>
              ))}
            </div>
            {CATEGORIES.map(cat => renderCategoryGrid(cat.en))}
          </div>
          <aside className="lg:w-1/3 space-y-12">
            <CricketWidget />
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-xl font-serif font-bold mb-8 text-white flex items-center"><Flame className="text-orange-500 mr-3" size={20} /> Trending Now</h3>
              <div className="space-y-8">
                {trendingPosts.map((a, i) => (
                  <Link key={a.id} to={`/article/${a.id}`} className="group/item flex items-start space-x-4">
                    <span className="text-4xl font-serif font-black text-white/5 leading-none">{i + 1}</span>
                    <h4 className="text-sm font-bold text-slate-200 group-hover/item:text-blue-400">{a.title[lang] || a.title['en']}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
