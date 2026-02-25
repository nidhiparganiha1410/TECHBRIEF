
import { Article, StockData, User, AdPlacement } from '../types';

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastModified: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const defaultSEO = (): any => ({
  meta_title: "New Tech Story | Tech Brief Pro",
  meta_description: "Deep dive into the latest technology updates and innovation.",
  focus_keyword: "technology",
  canonical_url: null,
  schema: { article: true, faq: false }
});

const generateArticle = (id: string, category: string, status: any = 'published', isFeatured: boolean = false): Article => ({
  id,
  slug: `post-${id}`,
  title: { en: `Breaking ${category} News: The Future of ${id}` },
  summary: { en: `A comprehensive look into the latest ${category} breakthrough with ID ${id}, analyzing its global impact.` },
  content: { en: `Full content for the ${category} report. This is a placeholder for deep technical analysis and investigative journalism regarding innovation ${id}.` },
  status: status,
  visibility: 'public',
  category,
  categories: [1, 2],
  tags: [category.toLowerCase(), 'tech', 'future'],
  author: 'Sarah Jenkins',
  author_id: 1,
  date: '2024-05-15',
  created_at: '2024-05-10T10:00:00Z',
  updated_at: '2024-05-15T12:00:00Z',
  publish_at: '2024-05-15T09:00:00Z',
  imageUrl: `https://picsum.photos/seed/tech-${id}/800/600`,
  seo: defaultSEO(),
  revision_ids: [1001, 1002],
  isFeatured,
  highlights: {
    en: [
      "Significant performance gains observed",
      "Scalability improved by 40%",
      "Available for early enterprise access"
    ]
  },
  content_blocks: [
    { type: 'paragraph', text: "The initial findings suggest a massive shift." },
    { type: 'heading', text: "The Impact", level: 2 },
    { type: 'paragraph', text: "What follows is a detailed look at the architecture." }
  ]
});

export const MOCK_ARTICLES: Article[] = [
  ...Array.from({ length: 15 }, (_, i) => generateArticle((i + 1).toString(), ['AI', 'Software', 'Hardware', 'Crypto', 'Mobile'][i % 5], 'published', i < 3)), // Feature first 3
  {
    ...generateArticle('16', 'AI', 'draft'),
    title: { en: 'Generative Agents in the Wild' }
  },
  {
    ...generateArticle('17', 'Software', 'review'),
    title: { en: 'Next.js 16 Preview: What to Expect' }
  },
  {
    ...generateArticle('18', 'Hardware', 'scheduled'),
    title: { en: 'Quantum Chips Reach Room Temperature' },
    publish_at: '2026-03-01T09:00:00Z'
  },
  {
    ...generateArticle('19', 'Crypto', 'published'),
    title: { en: 'DeFi 2.0: The End of Liquidity Mining?' }
  },
  {
    ...generateArticle('20', 'Mobile', 'published', true), // Feature this one too
    title: { en: 'The Foldable Tablet Revolution' },
    isFeatured: true
  }
];

export const MOCK_PAGES: StaticPage[] = [
  { id: 'p1', title: 'About Us', slug: 'about', status: 'published', lastModified: '2024-05-01' },
  { id: 'p2', title: 'Privacy Policy', slug: 'privacy', status: 'published', lastModified: '2024-04-15' },
  { id: 'p3', title: 'Terms of Service', slug: 'terms', status: 'published', lastModified: '2024-04-15' },
  { id: 'p4', title: 'Advertise', slug: 'advertise', status: 'draft', lastModified: '2024-05-10' },
];

export const MOCK_CATEGORIES: CategoryData[] = [
  { id: 'cat1', name: 'AI', slug: 'ai', count: 12 },
  { id: 'cat2', name: 'Software', slug: 'software', count: 8 },
  { id: 'cat3', name: 'Hardware', slug: 'hardware', count: 15 },
  { id: 'cat4', name: 'Crypto', slug: 'crypto', count: 6 },
  { id: 'cat5', name: 'Mobile', slug: 'mobile', count: 10 },
];

export const MOCK_STOCKS: StockData[] = [
  { symbol: 'AAPL', price: 189.45, change: 1.25, changePercent: 0.66 },
  { symbol: 'GOOGL', price: 172.30, change: -0.85, changePercent: -0.49 },
  { symbol: 'MSFT', price: 415.60, change: 3.40, changePercent: 0.82 },
  { symbol: 'NVDA', price: 920.12, change: 12.50, changePercent: 1.37 },
  { symbol: 'TSLA', price: 178.90, change: -4.20, changePercent: -2.30 },
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@techbrief.pro',
    role: 'super_admin',
    permissions: { canPublish: true, canEditOthers: true, canManageUsers: true, canManageAds: true, canViewAnalytics: true }
  },
  {
    id: '2',
    name: 'Jane Editor',
    email: 'jane@techbrief.pro',
    role: 'editor',
    permissions: { canPublish: true, canEditOthers: true, canManageUsers: false, canManageAds: false, canViewAnalytics: true }
  },
  {
    id: '3',
    name: 'Bob Author',
    email: 'bob@techbrief.pro',
    role: 'author',
    permissions: { canPublish: false, canEditOthers: false, canManageUsers: false, canManageAds: false, canViewAnalytics: true }
  }
];

export const MOCK_ADS: AdPlacement[] = [
  { id: 'ad1', name: 'Homepage Top Hero', slot: 'home_hero', status: 'active', cpm: 12.5, revenue: 4500.20, impressions: 360000, startDate: '2024-01-01' },
  { id: 'ad2', name: 'Article Body Native', slot: 'article_mid', status: 'active', cpm: 8.2, revenue: 2100.50, impressions: 256000, startDate: '2024-02-15' },
  { id: 'ad3', name: 'Sidebar Sticky', slot: 'sidebar', status: 'inactive', cpm: 5.0, revenue: 120.00, impressions: 24000, startDate: '2024-04-01' },
];
