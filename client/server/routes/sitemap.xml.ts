import siteContent from '../../data/site-content.json'
import { normalizeSiteUrl, toCanonicalUrl } from '../../utils/siteUrl'

interface SitemapEntry {
  path: string
  lastmod?: string
}

const solutionLandingPaths = [
  '/solutions/panel-kho-lanh',
  '/solutions/panel-phong-sach',
]

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(runtimeConfig.public.siteUrl)
  const staticPaths = [
    '/',
    ...siteContent.publicNavigation.map(item => item.href),
    ...solutionLandingPaths,
    '/privacy',
  ]
  const entries: SitemapEntry[] = [
    ...staticPaths.map(path => ({ path })),
    ...siteContent.retailProducts.map(product => ({ path: `/products/${product.slug}` })),
    ...siteContent.posts
      .filter(post => post.published)
      .map(post => ({
        path: `/posts/${post.slug}`,
        lastmod: post.date,
      })),
  ]

  const urls = entries.map(({ path, lastmod }) => {
    const location = toCanonicalUrl(path, siteUrl)
    const lastModified = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''

    return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastModified}\n  </url>`
  })

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
})
