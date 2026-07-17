import { describe, expect, it } from 'vitest'
import { DEFAULT_SITE_URL, normalizeSiteUrl, toAbsoluteUrl, toCanonicalUrl } from './siteUrl'

describe('site URL helpers', () => {
  it('uses the official HTTPS production origin by default', () => {
    expect(DEFAULT_SITE_URL).toBe('https://thaithanhpanel.shop')
    expect(normalizeSiteUrl(undefined)).toBe('https://thaithanhpanel.shop')
  })

  it('normalizes a valid public origin', () => {
    expect(normalizeSiteUrl('https://www.example.vn/path?query=1#fragment')).toBe('https://www.example.vn')
    expect(normalizeSiteUrl('http://localhost:3000/')).toBe('http://localhost:3000')
  })

  it('falls back for invalid, unsupported or credential-bearing URLs', () => {
    expect(normalizeSiteUrl('javascript:alert(1)')).toBe(DEFAULT_SITE_URL)
    expect(normalizeSiteUrl('https://user:secret@example.vn')).toBe(DEFAULT_SITE_URL)
    expect(normalizeSiteUrl('not a URL')).toBe(DEFAULT_SITE_URL)
  })

  it('creates absolute URLs from public paths', () => {
    expect(toAbsoluteUrl('/posts/example', 'https://www.example.vn')).toBe('https://www.example.vn/posts/example')
  })

  it('uses trailing slashes for canonical page URLs except the homepage', () => {
    expect(toCanonicalUrl('/', 'https://www.example.vn')).toBe('https://www.example.vn/')
    expect(toCanonicalUrl('/products', 'https://www.example.vn')).toBe('https://www.example.vn/products/')
    expect(toCanonicalUrl('/posts/example/', 'https://www.example.vn')).toBe('https://www.example.vn/posts/example/')
  })

  it('removes query strings and fragments from canonical URLs', () => {
    expect(toCanonicalUrl('/contact?source=hero#quick-contact', 'https://www.example.vn'))
      .toBe('https://www.example.vn/contact/')
  })
})
