import type { MaybeRefOrGetter } from 'vue'
import { normalizeSiteUrl, toAbsoluteUrl, toCanonicalUrl } from '~/utils/siteUrl'

type SeoValue = MaybeRefOrGetter<string>

interface ArticleSeo {
  publishedTime: SeoValue
  section?: SeoValue
  tags?: MaybeRefOrGetter<string[]>
}

interface BreadcrumbSeo {
  name: SeoValue
  path: SeoValue
}

interface ProductSeoSpecification {
  label: string
  value: string
}

interface ProductSeo {
  category?: SeoValue
  applications?: MaybeRefOrGetter<string[]>
  specifications?: MaybeRefOrGetter<ProductSeoSpecification[]>
}

interface PageSeoOptions {
  title: SeoValue
  description: SeoValue
  path?: SeoValue
  image?: SeoValue
  imageAlt?: SeoValue
  type?: 'website' | 'article'
  article?: ArticleSeo
  webPageType?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage'
  breadcrumbs?: BreadcrumbSeo[]
  product?: ProductSeo
}

const SITE_NAME = 'Thái Thanh Panel'
const SITE_ALTERNATE_NAMES = ['Thái Thanh', 'Thai Thanh Panel', 'thaithanhpanel.shop']
const ORGANIZATION_DESCRIPTION = 'Thái Thanh Panel cung cấp panel EPS cách nhiệt, cửa kho lạnh Inox 304, phụ kiện kho lạnh và vật tư hoàn thiện cho công trình trên toàn quốc.'
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
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
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
  const organizationLogoId = computed(() => `${siteUrl.value}/#logo`)
  const organizationLogoUrl = computed(() => toAbsoluteUrl('/images/brand/thai-thanh-logo-transparent.png', siteUrl.value))
  const websiteId = computed(() => `${siteUrl.value}/#website`)
  const webpageId = computed(() => `${canonicalUrl.value}#webpage`)
  const structuredData = computed(() => {
    const email = content.value.companyContact.emailDisplay
    const localTelephone = content.value.companyContact.phoneHref.replace(/^tel:/, '')
    const telephone = localTelephone.replace(/^0(?=\d)/, '+84')
    const organization = {
      '@type': 'Organization',
      '@id': organizationId.value,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      description: ORGANIZATION_DESCRIPTION,
      url: `${siteUrl.value}/`,
      logo: {
        '@type': 'ImageObject',
        '@id': organizationLogoId.value,
        url: organizationLogoUrl.value,
        contentUrl: organizationLogoUrl.value,
        width: 898,
        height: 607,
        caption: SITE_NAME,
      },
      image: { '@id': organizationLogoId.value },
      ...(email ? { email } : {}),
      telephone,
      areaServed: content.value.companyContact.serviceArea,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone,
        ...(email ? { email } : {}),
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: 'Vietnamese',
      },
    }

    const graph: Record<string, unknown>[] = [organization]

    if (canonicalUrl.value === `${siteUrl.value}/`) {
      graph.push({
        '@type': 'WebSite',
        '@id': websiteId.value,
        url: `${siteUrl.value}/`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        description: ORGANIZATION_DESCRIPTION,
        inLanguage: 'vi-VN',
        publisher: { '@id': organizationId.value },
      })
    }

    const webPage: Record<string, unknown> = {
      '@type': options.webPageType || 'WebPage',
      '@id': webpageId.value,
      url: canonicalUrl.value,
      name: fullTitle.value,
      description: description.value,
      inLanguage: 'vi-VN',
      isPartOf: { '@id': websiteId.value },
      about: { '@id': organizationId.value },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: socialImageUrl.value,
        caption: socialImageAlt.value,
      },
    }

    if (options.breadcrumbs?.length) {
      const breadcrumbId = `${canonicalUrl.value}#breadcrumb`
      const breadcrumbItems = [
        { name: 'Trang chủ', path: '/' },
        ...options.breadcrumbs.map(item => ({
          name: toValue(item.name),
          path: toValue(item.path),
        })),
      ]

      graph.push({
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: toCanonicalUrl(item.path, siteUrl.value),
        })),
      })
      webPage.breadcrumb = { '@id': breadcrumbId }
    }

    if (options.product) {
      const productId = `${canonicalUrl.value}#product`
      const applications = options.product.applications
        ? toValue(options.product.applications)
        : []
      const specifications = options.product.specifications
        ? toValue(options.product.specifications)
        : []
      const additionalProperty = [
        ...applications.map(value => ({
          '@type': 'PropertyValue',
          name: 'Ứng dụng',
          value,
        })),
        ...specifications.map(specification => ({
          '@type': 'PropertyValue',
          name: specification.label,
          value: specification.value,
        })),
      ]

      graph.push({
        '@type': 'Product',
        '@id': productId,
        url: canonicalUrl.value,
        name: pageTitle.value,
        description: description.value,
        image: socialImageUrl.value,
        brand: { '@id': organizationId.value },
        category: options.product.category ? toValue(options.product.category) : undefined,
        additionalProperty,
        mainEntityOfPage: { '@id': webpageId.value },
      })
      webPage.mainEntity = { '@id': productId }
    }

    graph.push(webPage)

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
        mainEntityOfPage: { '@id': webpageId.value },
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
