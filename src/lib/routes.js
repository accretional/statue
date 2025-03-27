// Bu rotaları işleme/ön-işleme dahil etme
export const excludeRoutes = [
  '/blog/[slug]',
  '/docs/[slug]'
];

// Bu rotaları statik site oluşturmaya dahil et
export const includeRoutes = [
  '/',
  '/ornek',
  '/statik',
  '/statik/hakkimizda',
  '/blog',
  '/docs'
]; 