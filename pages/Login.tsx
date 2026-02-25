
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Shield, UserPlus, ArrowRight, User, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const { login, register, lang } = useAppContext();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await register(name, email, password, isAdminMode);
        if (result.success) {
          setSuccess(result.message);
          setTimeout(() => navigate(isAdminMode ? '/admin' : '/'), 1500);
        } else {
          setError(result.message);
        }
      } else {
        const result = await login(email, password, isAdminMode);
        if (result.success) {
          setSuccess(result.message);
          setTimeout(() => navigate(isAdminMode ? '/admin' : '/'), 1000);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/5 relative z-10 transition-all duration-500">
        
        {/* Header Branding */}
        <div className={`p-10 text-center transition-colors duration-500 ${isAdminMode ? 'bg-indigo-600/10' : 'bg-blue-600/10'}`}>
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl transition-all duration-500 ${isAdminMode ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
            {isSignUp ? <UserPlus size={32} className="text-white" /> : (isAdminMode ? <Shield size={32} className="text-white" /> : <LogIn size={32} className="text-white" />)}
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {isSignUp ? 'Create Profile' : (isAdminMode ? 'Editorial Hub' : 'Member Login')}
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            {isSignUp ? 'Join the global tech intelligence network' : (isAdminMode ? 'Secure access for authorized editors only' : 'Access your personalized global news feed')}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 pt-6 space-y-6">
          
          {/* Status Messages */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start space-x-3 animate-shake">
              <AlertCircle className="text-rose-500 shrink-0" size={18} />
              <p className="text-xs text-rose-200 font-bold">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start space-x-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
              <p className="text-xs text-emerald-200 font-bold">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="name@protocol.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Passphrase</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <button 
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center space-x-2 text-xs font-bold transition-colors ${isAdminMode ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
            >
              <Shield size={14} />
              <span>{isAdminMode ? 'Admin Mode Active' : 'Administrator?'}</span>
            </button>
            {!isSignUp && (
              <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Recovery</button>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 ${isAdminMode ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}
          >
            <span>{isLoading ? 'Authenticating...' : (isSignUp ? 'Establish Account' : 'Initialize Session')}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="p-10 pt-0 text-center">
           <p className="text-sm text-slate-500 font-medium">
             {isSignUp ? "Already have a protocol?" : "Need a new identifier?"}{' '}
             <button 
               onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
               className={`font-black uppercase tracking-widest text-[10px] ml-2 transition-colors ${isAdminMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-blue-500 hover:text-blue-400'}`}
             >
               {isSignUp ? 'Sign In Instead' : 'Create Account'}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
