
import React from 'react';
import { MOCK_ARTICLES } from '../services/mockData';
import { useAppContext } from '../context/AppContext';
import { Play, Calendar, PlayCircle, Clock, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoPage: React.FC = () => {
  const { lang } = useAppContext();
  // Filter articles that have a video URL or just simulate some as videos
  const videoPosts = MOCK_ARTICLES.filter(a => !!a.videoUrl || a.id === '3' || a.id === '2');

  return (
    <div className="bg-slate-950 min-h-screen text-white pb-32">
      {/* Cinematic Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 scale-110 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-4 shadow-2xl shadow-blue-500/40 animate-pulse">
            <PlayCircle size={40} className="fill-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight">Tech <span className="text-blue-500">Live</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light">
            Exclusive interviews, hardware teardowns, and deep dives into the next generation of computing.
          </p>
        </div>
      </section>

      {/* Video Hub Grid */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videoPosts.map((v) => (
            <Link 
              key={v.id}
              to={`/article/${v.id}`}
              className="group relative block rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-700 bg-slate-900/40 backdrop-blur-sm"
            >
              {/* Thumbnail Container */}
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={v.imageUrl} 
                  alt={v.title[lang] || v.title['en']} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500">
                    <Play size={36} className="fill-white text-white ml-1.5" />
                  </div>
                </div>

                {/* Duration Tag */}
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl text-xs font-bold flex items-center">
                  <Clock size={12} className="mr-2" />
                  12:45
                </div>

                {/* Live Tag */}
                <div className="absolute top-6 left-6 flex items-center space-x-2">
                    <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Premium Content</span>
                </div>
              </div>
              
              {/* Info Container */}
              <div className="p-10 space-y-6">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span className="text-blue-400">{v.category}</span>
                  <div className="flex items-center space-x-4 text-slate-500">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {v.date}</span>
                    <span>3.2k Views</span>
                  </div>
                </div>

                <h3 className="text-3xl font-serif font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {v.title[lang] || v.title['en']}
                </h3>

                <p className="text-slate-400 text-sm line-clamp-2 font-light leading-relaxed">
                    {v.summary[lang] || v.summary['en']}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-blue-400">
                      {v.author[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-300">{v.author}</span>
                  </div>
                  <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <Share2 size={18} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Section */}
        <div className="mt-20 text-center">
            <button className="px-10 py-4 bg-transparent border border-white/20 hover:border-blue-500 hover:text-blue-500 transition-all rounded-full font-bold text-sm">
                Explore Archived Footage
            </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
