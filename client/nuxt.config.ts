import siteContent from './data/site-content.json'

const publicRoutes = [
  '/',
  ...siteContent.publicNavigation.map(item => item.href),
  '/privacy',
]

const publishedPostRoutes = siteContent.posts
  .filter(post => post.published)
  .map(post => `/posts/${post.slug}`)

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true,

  experimental: {
    appManifest: false,
  },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      siteUrl: 'https://thaithanhpanel.shop',
      contactFormAccessKey: '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Thái Thanh Panel',
      htmlAttrs: { lang: 'vi' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Panel EPS, cửa Inox 304 và phụ kiện U/V cho công trình hoặc nhu cầu mua lẻ từ Thái Thanh Panel.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  css: ['~/assets/css/tailwind.css'],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    viewer: false,
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: [
        ...publicRoutes,
        ...publishedPostRoutes,
        '/robots.txt',
        '/sitemap.xml',
      ],
    },
  },
})
