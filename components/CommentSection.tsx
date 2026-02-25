
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Comment } from '../types';
import { Send, User as UserIcon, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const { user, lang, isAdmin } = useAppContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: 'c1',
        articleId,
        userId: 'u1',
        userName: 'SiliconVoyager',
        text: "The implications for decentralized architecture here are massive.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: 'c2',
        articleId,
        userId: 'u2',
        userName: 'FrontendWizard',
        text: "Tailwind v4 is going to save us so much configuration headache. Great write-up!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ];
    setComments(mockComments);
  }, [articleId, lang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      articleId,
      userId: user.id,
      userName: user.name,
      text: newComment,
      timestamp: new Date().toISOString()
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-[2rem] p-10 border border-white/5">
      <h3 className="text-2xl font-serif font-bold mb-10 text-white flex items-center">
        Reader Discourse <span className="ml-4 text-sm font-sans text-slate-500 font-bold bg-white/5 px-3 py-1 rounded-full">{comments.length}</span>
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-12 relative">
          <textarea
            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-6 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-inner"
            placeholder="Contribute to the conversation..."
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="absolute bottom-6 right-6 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-90">
            <Send size={20} />
          </button>
        </form>
      ) : (
        <div className="bg-slate-900/50 rounded-2xl p-10 text-center mb-12 border border-dashed border-white/10">
          <p className="text-slate-400 mb-4 font-medium">Join the elite tech community to discuss this briefing.</p>
          <button className="px-8 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold hover:bg-blue-600/30 transition-all">Authenticate to Comment</button>
        </div>
      )}

      <div className="space-y-10">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-5 group">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 font-bold shadow-xl">
                {comment.userName[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{comment.userName}</h4>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </span>
                  {(isAdmin || (user && user.id === comment.userId)) && (
                    <button onClick={() => deleteComment(comment.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;