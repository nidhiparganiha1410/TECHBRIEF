
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, User, Article, Page, Category, AdSettings, SiteSettings, UserPermissions } from '../types';
import { SUPPORTED_LANGUAGES, CATEGORIES as INITIAL_CATEGORIES } from '../constants';
import { MOCK_ARTICLES } from '../services/mockData';
import { supabase } from '../services/supabase';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  user: User | null;
  login: (email: string, pass: string, isAdminAttempt: boolean) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, pass: string, isAdmin: boolean) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAdmin: boolean;
  direction: 'ltr' | 'rtl';
  articles: Article[];
  pages: Page[];
  categories: Category[];
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  upsertArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  upsertPage: (page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  upsertCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateAdSettings: (settings: AdSettings) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDefaultPermissions = (role: string): UserPermissions => ({
  canPublish: role === 'admin' || role === 'super_admin',
  canEditOthers: role === 'admin' || role === 'super_admin',
  canManageUsers: role === 'super_admin',
  canManageAds: role === 'admin' || role === 'super_admin',
  canViewAnalytics: true
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>({
    headerCode: '', footerCode: '', inArticleCode: '', active: true
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    googleAnalyticsId: '', searchConsoleTag: '', otherVerificationTags: ''
  });

  // INITIAL DATA FETCHING FROM SUPABASE
  useEffect(() => {
    const initApp = async () => {
      // 1. Language preference
      const savedLang = localStorage.getItem('lang');
      if (savedLang && savedLang !== "undefined" && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
        setLang(savedLang as Language);
      }

      // 2. Auth state
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const role = (session.user.app_metadata?.role || 'user') as any;
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Member',
          email: session.user.email!,
          role: role,
          permissions: getDefaultPermissions(role)
        });
      }

      // Subscribe to auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const role = (session.user.app_metadata?.role || 'user') as any;
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || 'Member',
            email: session.user.email!,
            role: role,
            permissions: getDefaultPermissions(role)
          });
        } else {
          setUser(null);
        }
      });

      // 3. Fetch Content from Supabase
      try {
        console.log("Initializing Supabase data fetch...");
        const [arts, pgs, cats, settings] = await Promise.all([
          supabase.from('articles').select('*').order('created_at', { ascending: false }),
          supabase.from('pages').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('settings').select('*')
        ]);

        if (arts.error) console.error("Supabase Articles Fetch Error:", arts.error);
        if (pgs.error) console.error("Supabase Pages Fetch Error:", pgs.error);
        if (cats.error) {
          console.error("Supabase Categories Fetch Error:", cats.error);
          // If there's an error fetching categories, we MUST fallback to initial ones
          // to ensure the site doesn't break, but we log it clearly.
        }
        if (settings.error) console.error("Supabase Settings Fetch Error:", settings.error);

        if (arts.data && arts.data.length > 0) setArticles(arts.data as any);
        else {
          console.warn("No articles found in Supabase, using mock data.");
          setArticles(MOCK_ARTICLES);
        }

        if (pgs.data) setPages(pgs.data as any);
        
        // IMPORTANT: Only use fallback if data is null/undefined OR empty AND no error occurred
        // If there was an error, we fallback to be safe, but we should prioritize DB data.
        if (cats.data && cats.data.length > 0) {
          console.log("Successfully fetched categories from Supabase:", cats.data.length);
          setCategories(cats.data as any);
        } else {
          console.warn("No categories found in Supabase (or fetch failed), using initial fallback.");
          const initial = INITIAL_CATEGORIES.map((c, i) => ({
            id: crypto.randomUUID(), 
            name: c,
            slug: c.en.toLowerCase()
          }));
          setCategories(initial);
        }

        // Handle settings mapping
        if (settings.data) {
          const ads = settings.data.find(s => s.key === 'ad_settings');
          if (ads) setAdSettings(ads.value);
          const site = settings.data.find(s => s.key === 'site_settings');
          if (site) setSiteSettings(site.value);
        }
      } catch (err) {
        console.error("Critical error during Supabase initialization:", err);
        setArticles(MOCK_ARTICLES);
        // Fallback categories on critical error
        const initial = INITIAL_CATEGORIES.map((c, i) => ({
          id: crypto.randomUUID(), 
          name: c,
          slug: c.en.toLowerCase()
        }));
        setCategories(initial);
      }
    };

    initApp();
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === newLang);
    document.documentElement.dir = langConfig?.dir || 'ltr';
  };

  // AUTH METHODS
  const register = async (name: string, email: string, pass: string, isAdmin: boolean) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          role: isAdmin ? 'admin' : 'user'
        }
      }
    });

    if (error) return { success: false, message: error.message };
    return { success: true, message: "Account created successfully. Please check your email for verification if enabled." };
  };

  const login = async (email: string, pass: string, isAdminAttempt: boolean) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (error) return { success: false, message: error.message };
    
    const user = data.user;
    const role = user?.app_metadata?.role || 'user';
    
    if (isAdminAttempt && role !== 'admin' && role !== 'super_admin') {
      await supabase.auth.signOut();
      return { 
        success: false, 
        message: `Access denied. Your account role is "${role}", but administrator privileges are required. Please contact the system owner or run the promotion SQL script.` 
      };
    }

    return { success: true, message: "Logged in successfully." };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // CRUD METHODS (Supabase Connected)
  const upsertArticle = async (article: Article) => {
    try {
      const { error } = await supabase.from('articles').upsert(article);
      if (error) {
        console.error("Supabase upsertArticle error:", error);
        throw new Error(error.message);
      }
      
      setArticles(prev => {
        const index = prev.findIndex(a => a.id === article.id);
        if (index !== -1) {
          const newArticles = [...prev];
          newArticles[index] = article;
          return newArticles;
        }
        return [article, ...prev];
      });
    } catch (err: any) {
      console.error("upsertArticle caught error:", err);
      throw err;
    }
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    } else setArticles(prev => prev.filter(a => a.id !== id));
  };

  const upsertPage = async (page: Page) => {
    try {
      const { error } = await supabase.from('pages').upsert(page);
      if (error) {
        console.error("Supabase upsertPage error:", error);
        throw new Error(error.message);
      }
      
      setPages(prev => {
        const index = prev.findIndex(p => p.id === page.id);
        if (index !== -1) {
          const newPages = [...prev];
          newPages[index] = page;
          return newPages;
        }
        return [page, ...prev];
      });
    } catch (err: any) {
      console.error("upsertPage caught error:", err);
      throw err;
    }
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    } else setPages(prev => prev.filter(p => p.id !== id));
  };

  const upsertCategory = async (category: Category) => {
    try {
      console.log("Attempting to upsert category:", category);
      const { error } = await supabase.from('categories').upsert(category);
      if (error) {
        console.error("Supabase upsertCategory error:", error);
        throw error;
      }
      
      setCategories(prev => {
        const existing = prev.find(c => c.id === category.id);
        if (existing) {
          return prev.map(c => c.id === category.id ? category : c);
        } else {
          return [...prev, category];
        }
      });
    } catch (err: any) {
      console.error("upsertCategory caught error:", err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log("Attempting to delete category:", id);
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        console.error("Supabase deleteCategory error:", error);
        throw error;
      }
      
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error("deleteCategory caught error:", err);
      throw err;
    }
  };

  const updateAdSettings = async (settings: AdSettings) => {
    const { error } = await supabase.from('settings').upsert({ key: 'ad_settings', value: settings }, { onConflict: 'key' });
    if (!error) setAdSettings(settings);
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    const { error } = await supabase.from('settings').upsert({ key: 'site_settings', value: settings }, { onConflict: 'key' });
    if (!error) setSiteSettings(settings);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const direction = SUPPORTED_LANGUAGES.find(l => l.code === lang)?.dir || 'ltr';

  return (
    <AppContext.Provider value={{ 
      lang, setLang: handleSetLang, user, login, register, logout, isAdmin, direction, 
      articles, pages, categories, adSettings, siteSettings,
      upsertArticle, deleteArticle, upsertPage, deletePage, 
      upsertCategory, deleteCategory, updateAdSettings, updateSiteSettings
    }}>
      <div dir={direction}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
