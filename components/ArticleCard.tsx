
import React from 'react';
import { Link } from 'react-router-dom';
import { Article, Language } from '../types';
import { Calendar, User, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  lang: Language;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, lang }) => {
  return (
    <Link 
      to={`/article/${article.id}`}
      className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/5 hover:border-blue-500/30 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={article.imageUrl} 
          alt={article.title[lang]} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600/90 text-white text-xs font-bold rounded-lg backdrop-blur-md shadow-lg">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-4 text-slate-400 text-xs mb-3 font-medium uppercase tracking-widest">
          <span className="flex items-center"><Calendar size={12} className="mr-1.5 text-blue-400" /> {article.date}</span>
          <span className="flex items-center"><User size={12} className="mr-1.5 text-indigo-400" /> {article.author}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight font-serif">
          {article.title[lang]}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow font-medium">
          {article.summary[lang]}
        </p>
        
        <div className="flex items-center text-blue-400 font-bold text-xs uppercase tracking-widest">
          <span>{lang === 'en' ? 'Deep Dive' : 'Leer más'}</span>
          <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;