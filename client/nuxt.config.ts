import siteContent from './data/site-content.json'

const publicRoutes = [
  '/',
  ...siteContent.publicNavigation.map(item => item.href),
  '/privacy',
]

const publishedPostRoutes = siteContent.posts
  .filter(post => post.published)
  .map(post => `/posts/${post.slug}`)

const retailProductRoutes = siteContent.retailProducts
  .map(product => `/products/${product.slug}`)

const solutionLandingRoutes = [
  '/solutions/panel-kho-lanh',
  '/solutions/panel-phong-sach',
]

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
      title: 'Tấm panel cách nhiệt kho lạnh, phòng sạch',
      htmlAttrs: { lang: 'vi' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Thái Thanh cung cấp tấm panel EPS cách nhiệt 50–200 mm, cửa kho lạnh Inox 304 và phụ kiện cho kho lạnh, phòng sạch, nhà xưởng trên toàn quốc.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon.png' },
        { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '512x512', href: '/favicon.png' },
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
        ...solutionLandingRoutes,
        ...retailProductRoutes,
        ...publishedPostRoutes,
        '/robots.txt',
        '/sitemap.xml',
      ],
    },
  },
})
