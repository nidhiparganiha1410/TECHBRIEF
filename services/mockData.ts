
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
  {
    ...generateArticle('pillar-1', 'Software', 'published', true),
    slug: 'ultimate-guide-project-management-software-2026',
    title: { 
      en: 'Ultimate Guide to Project Management Software 2026',
      es: 'Guía Definitiva de Software de Gestión de Proyectos 2026'
    },
    summary: { 
      en: 'Discover the best project management software tools for 2026. Compare features, pricing, and integration tips to optimize your team workflow.',
      es: 'Descubra las mejores herramientas de software de gestión de proyectos para 2026. Compare funciones, precios y consejos de integración.'
    },
    highlights: {
      en: [
        "Real-time resource allocation benchmarks",
        "AI-driven predictive scheduling analysis",
        "Cross-platform integration ecosystem review"
      ]
    },
    content: {
      en: `
        <h2>The Evolution of Project Management in 2026</h2>
        <p>In 2026, project management software has transcended simple task tracking. It is now the central nervous system of high-performing organizations. This guide explores the top tools that are defining the industry this year.</p>
        
        <h3>Key Features to Look For</h3>
        <p>When selecting your stack, prioritize AI-assisted automation, deep integration with communication tools, and robust data visualization capabilities. The best tools now offer predictive analytics that can foresee bottlenecks before they happen.</p>
        
        <h3>Top Tools Comparison</h3>
        <p>From enterprise-grade solutions to agile-focused platforms, we break down the pricing models and unique value propositions of the leading contenders in the market.</p>
      `
    }
  },
  {
    ...generateArticle('pillar-2', 'AI', 'published', true),
    slug: 'best-ai-software-tools-for-businesses',
    title: { 
      en: 'Best AI Software Tools for Businesses',
      es: 'Mejores Herramientas de Software de IA para Empresas'
    },
    summary: { 
      en: 'An expert review of the top AI software tools driving business efficiency in 2026. From automation to deep analytics, find the right fit for your team.',
      es: 'Una revisión experta de las principales herramientas de software de IA que impulsan la eficiencia empresarial en 2026.'
    },
    highlights: {
      en: [
        "Generative AI implementation strategies",
        "Cost-benefit analysis of enterprise AI",
        "Ethical AI usage and compliance guide"
      ]
    },
    content: {
      en: `
        <h2>AI: The New Business Standard</h2>
        <p>Artificial Intelligence is no longer a luxury; it is a fundamental requirement for competitive business operations. The landscape of AI software tools has matured, offering specialized solutions for every department.</p>
        
        <h3>Automation and Efficiency</h3>
        <p>Modern AI tools are automating complex workflows, from customer service chatbots to automated financial auditing. We examine how these tools are saving thousands of man-hours annually.</p>
        
        <h3>Free vs. Paid Solutions</h3>
        <p>While open-source models are gaining ground, enterprise-grade paid solutions offer the security and support necessary for large-scale deployments. We compare the ROI of both approaches.</p>
      `
    }
  },
  {
    ...generateArticle('pillar-3', 'Software', 'published', true),
    slug: 'top-productivity-software-for-teams',
    title: { 
      en: 'Top Productivity Software for Teams',
      es: 'Mejor Software de Productividad para Equipos'
    },
    summary: { 
      en: 'Optimize your team workflow with the top productivity software of 2026. Focus on remote work, mobile accessibility, and seamless app integrations.',
      es: 'Optimice el flujo de trabajo de su equipo con el mejor software de productividad de 2026.'
    },
    highlights: {
      en: [
        "Workflow optimization techniques for 2026",
        "Mobile-first productivity app reviews",
        "Remote work focus and team synergy tools"
      ]
    },
    content: {
      en: `
        <h2>Redefining Team Productivity</h2>
        <p>Productivity in 2026 is about more than just doing more; it's about doing what matters most. The latest productivity software focuses on reducing "work about work" through intelligent filtering and context-aware notifications.</p>
        
        <h3>Workflow Optimization</h3>
        <p>We dive into how modern tools use behavioral science to help teams stay in the "flow state" longer. Integration between calendar, task, and communication apps is now seamless.</p>
        
        <h3>Mobile and Remote Focus</h3>
        <p>With the global workforce more distributed than ever, mobile accessibility is paramount. We review the apps that offer the best experience on the go without sacrificing power.</p>
      `
    }
  },
  ...Array.from({ length: 15 }, (_, i) => generateArticle((i + 1).toString(), ['AI', 'Software', 'Hardware', 'Crypto', 'Mobile'][i % 5], 'published', false)),
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
