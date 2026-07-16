import type { MaybeRefOrGetter } from 'vue'
import { normalizeSiteUrl, toAbsoluteUrl, toCanonicalUrl } from '~/utils/siteUrl'

type SeoValue = MaybeRefOrGetter<string>

interface ArticleSeo {
  publishedTime: SeoValue
  section?: SeoValue
  tags?: MaybeRefOrGetter<string[]>
}

interface PageSeoOptions {
  title: SeoValue
  description: SeoValue
  path?: SeoValue
  image?: SeoValue
  imageAlt?: SeoValue
  type?: 'website' | 'article'
  article?: ArticleSeo
}

const SITE_NAME = 'Thái Thanh Panel'
const DEFAULT_SOCIAL_IMAGE = '/images/insulation/eps-panel-step-joint.webp'
const DEFAULT_SOCIAL_IMAGE_ALT = 'Panel EPS với mép ngàm bậc âm–dương và mí tôn ngắn'

const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

export const usePageSeo = (options: PageSeoOptions) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const { content } = useSiteContent()

  const siteUrl = computed(() => normalizeSiteUrl(runtimeConfig.public.siteUrl))
  const pageTitle = computed(() => toValue(options.title))
  const description = computed(() => toValue(options.description))
  const fullTitle = computed(() => `${pageTitle.value} | ${SITE_NAME}`)
  const canonicalUrl = computed(() => toCanonicalUrl(
    options.path ? toValue(options.path) : route.path,
    siteUrl.value,
  ))
  const socialImageUrl = computed(() => toAbsoluteUrl(
    options.image ? toValue(options.image) : DEFAULT_SOCIAL_IMAGE,
    siteUrl.value,
  ))
  const socialImageAlt = computed(() => options.imageAlt
    ? toValue(options.imageAlt)
    : DEFAULT_SOCIAL_IMAGE_ALT)

  useSeoMeta({
    title: () => pageTitle.value,
    description: () => description.value,
    ogTitle: () => fullTitle.value,
    ogDescription: () => description.value,
    ogType: options.type || 'website',
    ogUrl: () => canonicalUrl.value,
    ogImage: () => socialImageUrl.value,
    ogImageAlt: () => socialImageAlt.value,
    ogLocale: 'vi_VN',
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: () => fullTitle.value,
    twitterDescription: () => description.value,
    twitterImage: () => socialImageUrl.value,
    twitterImageAlt: () => socialImageAlt.value,
    ...(options.article
      ? {
          articlePublishedTime: () => toValue(options.article!.publishedTime),
          articleSection: options.article.section
            ? () => toValue(options.article!.section!)
            : undefined,
          articleTag: options.article.tags
            ? () => toValue(options.article!.tags!)
            : undefined,
        }
      : {}),
  })

  const organizationId = computed(() => `${siteUrl.value}/#organization`)
  const structuredData = computed(() => {
    const email = content.value.companyContact.emailDisplay
    const localTelephone = content.value.companyContact.phoneHref.replace(/^tel:/, '')
    const telephone = localTelephone.replace(/^0(?=\d)/, '+84')
    const organization = {
      '@type': 'Organization',
      '@id': organizationId.value,
      name: SITE_NAME,
      url: `${siteUrl.value}/`,
      logo: toAbsoluteUrl('/images/brand/thai-thanh-logo-transparent.png', siteUrl.value),
      ...(email ? { email } : {}),
      telephone,
      areaServed: content.value.companyContact.serviceArea,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone,
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: 'Vietnamese',
      },
    }

    const graph: Record<string, unknown>[] = [organization]

    if (options.type === 'article' && options.article) {
      graph.push({
        '@type': 'Article',
        '@id': `${canonicalUrl.value}#article`,
        headline: pageTitle.value,
        description: description.value,
        image: socialImageUrl.value,
        datePublished: toValue(options.article.publishedTime),
        articleSection: options.article.section ? toValue(options.article.section) : undefined,
        keywords: options.article.tags ? toValue(options.article.tags).join(', ') : undefined,
        inLanguage: 'vi-VN',
        mainEntityOfPage: canonicalUrl.value,
        author: { '@id': organizationId.value },
        publisher: { '@id': organizationId.value },
      })
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    }
  })

  useHead(() => ({
    link: [
      { key: 'canonical', rel: 'canonical', href: canonicalUrl.value },
    ],
    script: [
      {
        key: 'page-structured-data',
        type: 'application/ld+json',
        textContent: serializeJsonLd(structuredData.value),
      },
    ],
  }))

  return {
    canonicalUrl: readonly(canonicalUrl),
    socialImageUrl: readonly(socialImageUrl),
    socialImageAlt: readonly(socialImageAlt),
  }
}
