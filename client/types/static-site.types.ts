export type StaticRoute =
  | '/'
  | '/solutions'
  | '/products'
  | '/projects'
  | '/posts'
  | '/about'
  | '/contact'
  | '/privacy'

export type PrimaryNavigationRoute = Exclude<StaticRoute, '/' | '/privacy'>

export interface PublicNavigationItem {
  label: string
  href: PrimaryNavigationRoute
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface ResponsiveImage {
  image: string
  imageSrcset?: string
  imageWidth: number
  imageHeight: number
  imageAlt: string
}

export interface ProductSectionMedia extends ResponsiveImage {
  caption: string
}

export interface ProductFamily extends ResponsiveImage {
  id: string
  name: string
  eyebrow: string
  summary: string
  applications: string[]
  specifications: ProductSpecification[]
}

export interface ProductDetailSection {
  id: string
  title: string
  summary: string
  paragraphs: string[]
  specifications: ProductSpecification[]
  points: string[]
  media?: ProductSectionMedia
  references?: ProductTechnicalReference[]
}

export interface ProductTechnicalReference {
  label: string
  url: string
}

export interface ProductFrequentlyAskedQuestion {
  question: string
  answer: string
}

export interface ProductSelectionGuideItem {
  need: string
  operatingConditions: string
  preliminaryConfiguration: string
  confirm: string
}

export interface RetailProduct extends ResponsiveImage {
  slug: string
  familyId: string
  name: string
  eyebrow: string
  summary: string
  applications: string[]
  specifications: ProductSpecification[]
  detailSections: ProductDetailSection[]
  selectionChecklist: string[]
  selectionGuide: ProductSelectionGuideItem[]
  advantages: string[]
  limitations: string[]
  frequentlyAskedQuestions: ProductFrequentlyAskedQuestion[]
}

export interface StaticSolution {
  id: string
  index: string
  name: string
  temperature: string
  summary: string
  recommendedSystem: string
  checklist: string[]
}

export interface ReferenceApplication {
  id: string
  sector: string
  title: string
  brief: string
  system: string[]
  note: string
}

export interface ContentPost extends ResponsiveImage {
  id: string
  slug: string
  title: string
  eyebrow: string
  date: string
  summary: string
  body: string
  tags: string[]
  published: boolean
}

export interface CompanyContact {
  phoneDisplay: string
  phoneHref: string
  emailDisplay?: string
  emailHref?: string
  zaloHref?: string
  hours: string
  serviceArea: string
}

export interface SiteContent {
  publicNavigation: PublicNavigationItem[]
  companyContact: CompanyContact
  productFamilies: ProductFamily[]
  retailProducts: RetailProduct[]
  solutions: StaticSolution[]
  referenceApplications: ReferenceApplication[]
  posts: ContentPost[]
  consultationChecklist: string[]
}
