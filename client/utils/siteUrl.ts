export const DEFAULT_SITE_URL = 'https://thaithanhpanel.shop'

export const normalizeSiteUrl = (value: unknown): string => {
  try {
    const url = new URL(String(value || DEFAULT_SITE_URL).trim())

    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return DEFAULT_SITE_URL
    }

    return url.origin
  }
  catch {
    return DEFAULT_SITE_URL
  }
}

export const toAbsoluteUrl = (value: string, siteUrl: string): string => {
  try {
    return new URL(value, `${siteUrl}/`).toString()
  }
  catch {
    return `${siteUrl}/${value.replace(/^\/+/, '')}`
  }
}

export const toCanonicalUrl = (value: string, siteUrl: string): string => {
  const absoluteUrl = new URL(toAbsoluteUrl(value, siteUrl))

  if (absoluteUrl.pathname !== '/' && !absoluteUrl.pathname.endsWith('/')) {
    absoluteUrl.pathname = `${absoluteUrl.pathname}/`
  }

  return absoluteUrl.toString()
}
