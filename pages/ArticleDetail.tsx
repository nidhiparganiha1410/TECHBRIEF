
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateAISummary, getCricketUpdate } from '../services/geminiService';
import CommentSection from '../components/CommentSection';
import ArticleCard from '../components/ArticleCard';
import { Calendar, User, ArrowLeft, Sparkles, AlertCircle, Flame, Trophy, ExternalLink, ChevronRight, Zap } from 'lucide-react';

const SidebarCricketWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [cricketInfo, setCricketInfo] = useState<{ text: string; links: { title: string; uri: string }[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCricketUpdate();
        setCricketInfo(data);
      } catch (err: any) {
        if (err.message === "QUOTA_EXHAUSTED") {
          setCricketInfo({ text: "Quota limit reached. Please check back later.", links: [] });
        } else {
          setCricketInfo({ text: "Cricket updates unavailable.", links: [] });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0c1a26] via-[#102435] to-[#0c1a26] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest">Cricket Pulse</h3>
        <Trophy size={16} className="text-yellow-500" />
      </div>
      <div className="relative z-10 space-y-4">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-white/5 rounded w-3/4"></div>
            <div className="h-10 bg-white/5 rounded w-full"></div>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-3">
              {cricketInfo?.text}
            </p>
            <div className="pt-3 border-t border-white/5">
              <a href="https://www.bcci.tv" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors flex items-center">
                Detailed Scorecard <ChevronRight size={10} className="ml-1" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, articles, adSettings } = useAppContext();
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const article = articles.find(a => a.id === id);
  const publishedArticles = articles.filter(a => a.status === 'published');
  const trendingPosts = publishedArticles.slice(0, 4);
  const relatedArticles = publishedArticles
    .filter(a => a.category === article?.category && a.id !== article?.id)
    .slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAiSummary(null);
  }, [id]);

  const handleAiSummarize = async () => {
    if (!article) return;
    setIsLoadingSummary(true);
    const summary = await generateAISummary(article.content[lang] || article.content['en'] || '', lang);
    setAiSummary(summary);
    setIsLoadingSummary(false);
  };

  const renderContentWithAds = (content: string) => {
    if (!adSettings.active || !adSettings.inArticleCode) return content;
    
    // Split by paragraphs or common block separators
    const parts = content.split('</p>');
    if (parts.length < 3) return content + `<div class="my-10 text-center">${adSettings.inArticleCode}</div>`;

    // Inject in the middle
    const middleIndex = Math.floor(parts.length / 2);
    parts.splice(middleIndex, 0, `</p><div class="my-12 py-6 border-y border-white/5 bg-white/[0.02] rounded-2xl text-center">${adSettings.inArticleCode}</div><p>`);
    
    return parts.join('</p>');
  };

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
        <button onClick={() => navigate('/')} className="text-blue-400 font-bold hover:underline">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-300">
      <div className="container mx-auto px-4 pt-10">
        <button onClick={() => navigate(-1)} className="group flex items-center text-slate-500 hover:text-blue-400 transition-colors mb-8 font-bold text-sm">
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          {lang === 'en' ? 'Back' : 'Volver'}
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow lg:w-2/3">
            <div className="space-y-6 mb-10">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/20 uppercase tracking-widest">
                {article.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                {article.title[lang] || article.title['en']}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 font-bold">
                    {article.author[0]}
                  </div>
                  <span className="text-slate-100">{article.author}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border border-white/5 aspect-video mb-12">
              <img src={article.imageUrl} alt={article.title[lang]} className="w-full h-full object-cover" />
            </div>

            <div className="max-w-none">
              <div className="mb-12 bg-blue-600/5 rounded-3xl p-8 border border-blue-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-blue-400 font-black uppercase tracking-[0.2em] flex items-center text-xs">
                    <Sparkles className="mr-3 text-blue-500" size={18} /> AI Insights
                  </h3>
                  {!aiSummary && (
                    <button onClick={handleAiSummarize} disabled={isLoadingSummary} className="text-[10px] bg-blue-600 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50">
                      {isLoadingSummary ? 'Processing...' : 'Summarize'}
                    </button>
                  )}
                </div>
                {aiSummary && <div className="prose prose-invert max-w-none text-slate-50 font-medium text-sm leading-relaxed">{aiSummary}</div>}
              </div>

              <div className="prose prose-invert lg:prose-lg max-w-none text-white leading-relaxed mb-16">
                <p className="font-bold text-xl text-white mb-10 border-l-4 border-blue-500 pl-8 italic">
                  {article.summary[lang] || article.summary['en']}
                </p>
                <div 
                  className="whitespace-pre-line font-medium text-slate-50 text-lg"
                  dangerouslySetInnerHTML={{ __html: renderContentWithAds(article.content[lang] || article.content['en'] || '') }}
                />
              </div>

              {relatedArticles.length > 0 && (
                <div className="pt-16 border-t border-white/5 mb-16">
                  <h3 className="text-2xl font-serif font-bold mb-8 text-white flex items-center">
                    <Zap className="text-blue-500 mr-3" size={24} /> Recommended
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((ra) => <ArticleCard key={ra.id} article={ra} lang={ra.category === article.category ? lang : 'en'} />)}
                  </div>
                </div>
              )}
              <CommentSection articleId={article.id} />
            </div>
          </div>

          <aside className="lg:w-1/3 space-y-10">
            <SidebarCricketWidget />
            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 shadow-xl">
              <h3 className="text-lg font-serif font-bold mb-6 flex items-center text-white"><Flame className="text-orange-500 mr-2" size={18} /> Trending</h3>
              <div className="space-y-6">
                {trendingPosts.map((a, i) => (
                  <Link key={a.id} to={`/article/${a.id}`} className="group flex items-start space-x-4">
                    <span className="text-2xl font-serif font-black text-white/5">0{i + 1}</span>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 line-clamp-2">{a.title[lang] || a.title['en']}</h4>
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

export default ArticleDetail;
