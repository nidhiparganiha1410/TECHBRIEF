
export type Language = 'en' | 'es' | 'hi' | 'ru' | 'fr' | 'fr-ca' | 'ar' | 'zh' | 'ja' | 'de';

export type PostStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
export type Visibility = 'public' | 'private' | 'members';

export interface ContentBlock {
  type: 'paragraph' | 'image' | 'heading' | 'code' | 'quote';
  text?: string;
  media_id?: string | number;
  caption?: string;
  level?: number;
}

export interface SEOData {
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string | null;
  schema: { article: boolean; faq: boolean };
}

export interface Article {
  id: string;
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  excerpt?: string;
  content: Record<string, string>;
  content_blocks?: ContentBlock[];
  highlights?: Record<string, string[]>;
  status: PostStatus;
  visibility: Visibility;
  category: string;
  author: string;
  author_id: string | number;
  date: string;
  imageUrl: string;
  videoUrl?: string;
  isFeatured?: boolean;
  seo?: SEOData;
  categories: (string | number)[];
  tags: string[];
  publish_at: string;
  created_at: string;
  updated_at: string;
  revision_ids: (string | number)[];
}

export interface Page {
  id: string;
  title: Record<string, string>;
  slug: string;
  content: Record<string, string>;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
}

export interface UserPermissions {
  canPublish: boolean;
  canEditOthers: boolean;
  canManageUsers: boolean;
  canManageAds: boolean;
  canViewAnalytics: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'contributor' | 'user';
  permissions: UserPermissions;
}

export interface AdSettings {
  headerCode: string;
  footerCode: string;
  inArticleCode: string;
  active: boolean;
}

export interface SiteSettings {
  googleAnalyticsId: string;
  searchConsoleTag: string;
  otherVerificationTags: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  slot: string;
  status: 'active' | 'inactive';
  cpm: number;
  revenue: number;
  impressions: number;
  startDate: string;
  endDate?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'share' | 'comment';
  articleId: string;
  timestamp: string;
  country: string;
  device: 'mobile' | 'desktop' | 'tablet';
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}
