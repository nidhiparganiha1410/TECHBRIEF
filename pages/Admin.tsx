
import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, FileText, Settings, Users, BarChart3, 
  Plus, Edit3, Trash2, Eye, Shield, Search, 
  Image as ImageIcon, Globe, Save, Send, ChevronRight, 
  Files, Tags, Bold, Italic, Underline, Link as LinkIcon,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Quote, 
  Undo, Redo, Smile, Smartphone, DollarSign, Terminal, Code,
  ChevronDown, Type as TypeIcon, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Article, PostStatus, Page, Category, AdSettings, SiteSettings } from '../types';

const KPI_TILES = [
  { label: 'Total Visits', value: '1.2M', change: '+12%', icon: <Eye className="text-blue-500" /> },
  { label: 'Active Sessions', value: '4.5k', change: '+5%', icon: <Users className="text-emerald-500" /> },
  { label: 'Ad Revenue', value: '$12,450', change: '+18%', icon: <DollarSign className="text-amber-500" /> },
  { label: 'Conversion', value: '3.2%', change: '-2%', icon: <BarChart3 className="text-indigo-500" /> },
];

const EditorToolbar = ({ onAction }: { onAction: (command: string, value?: string) => void }) => (
  <div className="flex items-center flex-wrap gap-1 p-2 bg-slate-100 border border-slate-200 rounded-t-2xl shadow-sm sticky top-0 z-40">
    <div className="flex items-center space-x-1 pr-2 border-r border-slate-300">
      <button onClick={() => onAction('undo')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><Undo size={16} /></button>
      <button onClick={() => onAction('redo')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><Redo size={16} /></button>
    </div>
    <div className="flex items-center space-x-1 px-2 border-r border-slate-300">
      <button onClick={() => onAction('bold')} className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-slate-600"><Bold size={16} /></button>
      <button onClick={() => onAction('italic')} className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-slate-600"><Italic size={16} /></button>
      <button onClick={() => onAction('underline')} className="p-2 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-slate-600"><Underline size={16} /></button>
    </div>
    <div className="flex items-center space-x-1 px-2 border-r border-slate-300">
      <button onClick={() => onAction('justifyLeft')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><AlignLeft size={16} /></button>
      <button onClick={() => onAction('justifyCenter')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><AlignCenter size={16} /></button>
      <button onClick={() => onAction('justifyRight')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><AlignRight size={16} /></button>
    </div>
    <div className="flex items-center space-x-1 pl-2">
      <button onClick={() => onAction('insertUnorderedList')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><List size={16} /></button>
      <button onClick={() => onAction('insertOrderedList')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><ListOrdered size={16} /></button>
      <button onClick={() => onAction('formatBlock', 'blockquote')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600"><Quote size={16} /></button>
    </div>
  </div>
);

const Admin: React.FC = () => {
  const { 
    isAdmin, user, lang, articles, pages, categories, adSettings, siteSettings,
    upsertArticle, deleteArticle, upsertPage, deletePage, 
    upsertCategory, deleteCategory, updateAdSettings, updateSiteSettings 
  } = useAppContext();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [categoryInput, setCategoryInput] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-[#0f172a] min-h-screen">
        <Shield size={64} className="mx-auto text-rose-500 mb-6 opacity-20" />
        <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold">Return Home</button>
      </div>
    );
  }

  const handleAction = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSaveArticle = async (status: PostStatus) => {
    if (!editingArticle) return;
    setIsSaving(true);
    try {
      const content = editorRef.current?.innerHTML || '';
      
      // Generate slug if missing
      let slug = editingArticle.slug;
      if (!slug) {
        const title = editingArticle.title[lang] || editingArticle.title['en'] || '';
        slug = title.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }

      if (!slug) {
        throw new Error("Article title or slug is required to generate a valid URL.");
      }

      const now = new Date().toISOString();
      const articleToSave: Article = { 
        ...editingArticle, 
        slug,
        status, 
        content: { ...editingArticle.content, [lang]: content },
        updated_at: now,
        publish_at: editingArticle.publish_at || now,
        created_at: editingArticle.created_at || now,
        author: user?.name || editingArticle.author,
        author_id: user?.id || editingArticle.author_id
      };

      await upsertArticle(articleToSave);
      setActiveTab('content');
      setEditingArticle(null);
    } catch (err: any) {
      console.error("Save error:", err);
      alert(`Failed to save article: ${err.message || 'Ensure all fields are valid.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    setIsSaving(true);
    try {
      const content = editorRef.current?.innerHTML || '';
      await upsertPage({ ...editingPage, content: { ...editingPage.content, [lang]: content } });
      setActiveTab('pages');
    } catch (err) {
      alert("Failed to save page.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!categoryInput.trim() || isCategoryLoading) return;
    
    setIsCategoryLoading(true);
    try {
      const name = categoryInput.trim();
      const newCategory: Category = { 
        id: crypto.randomUUID(), // Standard UUID required for Supabase
        name: { [lang]: name, en: name }, 
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') 
      };
      
      await upsertCategory(newCategory);
      setCategoryInput('');
    } catch (err) {
      alert("Error adding category. It might already exist or check your permissions.");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const SidebarItem = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => { setActiveTab(id); setEditingArticle(null); setEditingPage(null); }}
      className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#020617] border-r border-white/5 flex flex-col p-6 space-y-8 z-30 overflow-y-auto">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/20">TB</div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">CMS Pro</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Editorial Hub</p>
          </div>
        </div>
        <nav className="flex-grow space-y-1">
          <SidebarItem id="overview" label="Overview" icon={<LayoutDashboard size={18} />} />
          <SidebarItem id="content" label="Articles" icon={<FileText size={18} />} />
          <SidebarItem id="pages" label="Pages" icon={<Files size={18} />} />
          <SidebarItem id="categories" label="Categories" icon={<Tags size={18} />} />
          <SidebarItem id="analytics" label="Analytics" icon={<BarChart3 size={18} />} />
          <SidebarItem id="ads" label="Ad Manager" icon={<DollarSign size={18} />} />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="h-20 bg-[#020617]/50 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" placeholder="Search resources..." 
                className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {activeTab === 'content' && (
            <button 
              onClick={() => { 
                setEditingArticle({ 
                  id: crypto.randomUUID(), 
                  slug: '', 
                  title: {}, 
                  summary: {}, 
                  content: {}, 
                  status: 'draft', 
                  visibility: 'public', 
                  category: categories[0]?.slug || 'AI', 
                  categories: [], 
                  tags: [], 
                  author: user?.name || 'Admin', 
                  author_id: user?.id || '1', 
                  date: new Date().toISOString(), 
                  imageUrl: '', 
                  publish_at: '', 
                  created_at: new Date().toISOString(), 
                  updated_at: new Date().toISOString(), 
                  revision_ids: [] 
                }); 
                setActiveTab('article-editor'); 
              }} 
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} /> <span>New Article</span>
            </button>
          )}
          {activeTab === 'pages' && (
            <button onClick={() => { setEditingPage({ id: crypto.randomUUID(), title: {}, slug: '', content: {}, status: 'draft', updatedAt: '' }); setActiveTab('page-editor'); }} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
              <Plus size={18} /> <span>New Page</span>
            </button>
          )}
        </header>

        <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-10 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {KPI_TILES.map((kpi, i) => (
                  <div key={i} className="bg-[#020617] p-6 rounded-[2rem] border border-white/5 shadow-xl text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-4">{kpi.icon}</div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h4 className="text-3xl font-bold text-white">{kpi.value}</h4>
                    <span className="text-[10px] text-emerald-400 font-bold">{kpi.change} increase</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-[#020617] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">Article</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {articles.filter(a => (a.title[lang] || '').toLowerCase().includes(searchQuery.toLowerCase())).map(article => (
                    <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-200">{article.title[lang] || 'Untitled'}</td>
                      <td className="px-8 py-6">
                         <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{article.status}</span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                         <button onClick={() => { setEditingArticle(article); setActiveTab('article-editor'); }} className="p-2 bg-white/5 rounded-lg hover:text-blue-400 transition-colors"><Edit3 size={16} /></button>
                         <button onClick={() => deleteArticle(article.id)} className="p-2 bg-white/5 rounded-lg hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="bg-[#020617] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">Page Title</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">Slug</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pages.map(page => (
                    <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-200">{page.title[lang] || 'New Page'}</td>
                      <td className="px-8 py-6 font-mono text-xs text-slate-400">/{page.slug}</td>
                      <td className="px-8 py-6 text-right space-x-2">
                         <button onClick={() => { setEditingPage(page); setActiveTab('page-editor'); }} className="p-2 bg-white/5 rounded-lg hover:text-blue-400 transition-colors"><Edit3 size={16} /></button>
                         <button onClick={() => deletePage(page.id)} className="p-2 bg-white/5 rounded-lg hover:text-rose-400 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-[#020617] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
                <h3 className="text-2xl font-serif font-bold text-white mb-8">Manage Categories</h3>
                
                <form onSubmit={handleAddCategory} className="flex gap-4 mb-10">
                  <div className="flex-grow relative">
                    <input 
                      type="text" 
                      placeholder="Category Name" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      disabled={isCategoryLoading}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isCategoryLoading || !categoryInput.trim()}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isCategoryLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                    <span>{isCategoryLoading ? 'Saving...' : 'Add'}</span>
                  </button>
                </form>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-2">Existing Sectors</p>
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      className="group flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                        <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                          {cat.name[lang] || cat.name['en'] || 'Undefined Category'}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteCategory(cat.id)} 
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Remove Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                      <p className="text-slate-500 italic text-sm">No categories defined yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-[#020617] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <h3 className="text-xl font-serif font-bold text-white mb-6 flex items-center"><Terminal className="mr-3 text-blue-400" /> Tracking & Verification</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Google Analytics Tracking ID / Script</label>
                    <textarea 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-400 outline-none h-32"
                      value={siteSettings.googleAnalyticsId}
                      onChange={(e) => updateSiteSettings({ ...siteSettings, googleAnalyticsId: e.target.value })}
                      placeholder="<!-- Google tag (gtag.js) -->..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Search Console Meta Tag</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-blue-400 outline-none"
                      value={siteSettings.searchConsoleTag}
                      onChange={(e) => updateSiteSettings({ ...siteSettings, searchConsoleTag: e.target.value })}
                      placeholder='<meta name="google-site-verification" content="..." />'
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Other Site Verifications (HTML Tags)</label>
                    <textarea 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs font-mono text-amber-400 outline-none h-24"
                      value={siteSettings.otherVerificationTags}
                      onChange={(e) => updateSiteSettings({ ...siteSettings, otherVerificationTags: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-[#020617] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-serif font-bold text-white flex items-center"><Code className="mr-3 text-amber-400" /> Ad Network Scripts</h3>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <span className="text-xs font-bold text-slate-400 uppercase">Ads Enabled</span>
                    <input 
                      type="checkbox" checked={adSettings.active} 
                      onChange={(e) => updateAdSettings({ ...adSettings, active: e.target.checked })}
                      className="w-10 h-5 appearance-none bg-white/10 rounded-full checked:bg-blue-600 transition-all relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:left-0.5 after:top-0.5 checked:after:translate-x-5 after:transition-all"
                    />
                  </label>
                </div>
                <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block">Header Ad Code (Before {'</head>'})</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-amber-400 outline-none h-32"
                      value={adSettings.headerCode}
                      onChange={(e) => updateAdSettings({ ...adSettings, headerCode: e.target.value })}
                      placeholder="Paste script from AdSense/Ezoic..."
                    />
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block">In-Article Ad Code (Dynamic Placement)</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-blue-400 outline-none h-32"
                      value={adSettings.inArticleCode}
                      onChange={(e) => updateAdSettings({ ...adSettings, inArticleCode: e.target.value })}
                    />
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block">Footer Ad Code (After Content)</label>
                    <textarea 
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-rose-400 outline-none h-32"
                      value={adSettings.footerCode}
                      onChange={(e) => updateAdSettings({ ...adSettings, footerCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'article-editor' && editingArticle && (
            <div className="max-w-5xl mx-auto space-y-8 pb-32">
              <div className="flex justify-between items-center">
                 <button onClick={() => setActiveTab('content')} className="text-slate-500 hover:text-white flex items-center transition-colors"><ChevronRight className="rotate-180 mr-2" /> Back</button>
                 <div className="space-x-4">
                    <button onClick={() => handleSaveArticle('draft')} className="px-6 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold transition-all hover:bg-white/10">Save Draft</button>
                    <button onClick={() => handleSaveArticle('published')} className="px-6 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-500">Publish</button>
                 </div>
              </div>

              {/* Meta Settings Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#020617] p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <LinkIcon size={12} className="mr-2" /> Custom Slug (URL)
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={editingArticle.slug}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="article-url-slug"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <Tags size={12} className="mr-2" /> Assigned Category
                    </label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={editingArticle.category}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.slug}>{cat.name[lang] || cat.name['en']}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#020617] p-8 rounded-[2rem] border border-white/5 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                      <ImageIcon size={12} className="mr-2" /> Feature Image URL
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={editingArticle.imageUrl}
                      onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
                <EditorToolbar onAction={handleAction} />
                <div className="p-12 flex-grow">
                   <div className="flex items-center space-x-3 mb-4 text-slate-400">
                     <TypeIcon size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Article Title</span>
                   </div>
                   <input 
                     className="w-full text-4xl font-serif font-bold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 mb-8 focus:ring-0"
                     placeholder="Headline..." value={editingArticle.title[lang] || ''}
                     onChange={(e) => setEditingArticle({ ...editingArticle, title: { ...editingArticle.title, [lang]: e.target.value } })}
                   />
                   <div className="w-full h-px bg-slate-100 mb-8" />
                   <div 
                     ref={editorRef} contentEditable className="prose prose-lg max-w-none text-slate-700 outline-none min-h-[400px]"
                     dangerouslySetInnerHTML={{ __html: editingArticle.content[lang] || '' }}
                   />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'page-editor' && editingPage && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                 <button onClick={() => setActiveTab('pages')} className="text-slate-500 hover:text-white flex items-center transition-colors"><ChevronRight className="rotate-180 mr-2" /> Back</button>
                 <button onClick={handleSavePage} className="px-8 py-2 bg-blue-600 rounded-xl font-bold text-white transition-all hover:bg-blue-500">Save Page</button>
              </div>
              <div className="bg-[#020617] p-8 rounded-[2rem] border border-white/5 space-y-6 mb-8">
                 <input 
                   placeholder="Page Slug (e.g., privacy-policy)" 
                   className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-xs font-mono outline-none"
                   value={editingPage.slug}
                   onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                 />
              </div>
              <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
                <EditorToolbar onAction={handleAction} />
                <div className="p-12">
                   <div className="flex items-center space-x-3 mb-4 text-slate-400">
                     <TypeIcon size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Page Title</span>
                   </div>
                   <input 
                     className="w-full text-4xl font-serif font-bold text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 mb-8 focus:ring-0"
                     placeholder="Headline..." value={editingPage.title[lang] || ''}
                     onChange={(e) => setEditingPage({ ...editingPage, title: { ...editingPage.title, [lang]: e.target.value } })}
                   />
                   <div className="w-full h-px bg-slate-100 mb-8" />
                   <div 
                     ref={editorRef} contentEditable className="prose prose-lg max-w-none text-slate-700 outline-none min-h-[400px]"
                     dangerouslySetInnerHTML={{ __html: editingPage.content[lang] || '' }}
                   />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
