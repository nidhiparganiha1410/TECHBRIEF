
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ArticleCard from '../components/ArticleCard';
import { ChevronLeft, Sparkles, Layers, Cpu, Bitcoin, Smartphone, Filter, Zap } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles, lang, categories } = useAppContext();

  // Find the category object to get localized name
  const category = categories.find(c => c.slug === slug);
  const categoryName = category ? (category.name[lang] || category.name['en']) : (slug?.toUpperCase() || '');
  
  useEffect(() => {
    // Explicitly ensure we land at the top of the category page
    window.scrollTo(0, 0);
  }, [slug]);

  // Filter articles by category name (matching slug or the english category name)
  const filteredArticles = articles.filter(a => 
    a.status === 'published' && 
    (
      a.category.toLowerCase() === slug?.toLowerCase() || 
      a.category.toLowerCase() === categoryName.toLowerCase() ||
      a.tags.some(t => t.toLowerCase() === slug?.toLowerCase())
    )
  );

  const getIcon = (s: string) => {
    switch(s.toLowerCase()) {
      case 'ai': return <Sparkles size={40} />;
      case 'software': return <Layers size={40} />;
      case 'hardware': return <Cpu size={40} />;
      case 'crypto': return <Bitcoin size={40} />;
      case 'mobile': return <Smartphone size={40} />;
      default: return <Zap size={40} />;
    }
  };

  const getColorClass = (s: string) => {
    switch(s.toLowerCase()) {
      case 'ai': return 'text-blue-500';
      case 'software': return 'text-emerald-500';
      case 'hardware': return 'text-amber-500';
      case 'crypto': return 'text-orange-500';
      case 'mobile': return 'text-indigo-500';
      default: return 'text-slate-400';
    }
  };

  const getBgClass = (s: string) => {
    switch(s.toLowerCase()) {
      case 'ai': return 'bg-blue-600/10';
      case 'software': return 'bg-emerald-500/10';
      case 'hardware': return 'bg-amber-500/10';
      case 'crypto': return 'bg-orange-500/10';
      case 'mobile': return 'bg-indigo-500/10';
      default: return 'bg-slate-500/10';
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen pb-24">
      {/* Dynamic Background Glow */}
      <div className={`fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 blur-[150px] transition-all duration-1000 ${getBgClass(slug || '')}`}></div>

      <div className="container mx-auto px-4 pt-12 relative z-10">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-white mb-12 transition-all font-bold text-sm group">
          <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>

        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className={`${getColorClass(slug || '')} bg-white/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-2xl`}>
                {getIcon(slug || '')}
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight mb-4">
                  {categoryName}
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                  Deep investigative reports and real-time intelligence from the {categoryName.toLowerCase()} sector. 
                  Curated for professionals and visionaries.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3">
               <div className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>{filteredArticles.length} Briefings Available</span>
              </div>
            </div>
          </div>
        </header>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-sm">
            <Filter size={48} className="mx-auto text-slate-700 mb-6" />
            <p className="text-slate-500 font-bold text-xl italic">No briefings found for this sector yet.</p>
            <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block font-bold">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
