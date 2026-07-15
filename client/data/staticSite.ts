import siteContentJson from './site-content.json'
import type {
  CompanyContact,
  ContentPost,
  ProductDetailSection,
  ProductFrequentlyAskedQuestion,
  ProductFamily,
  ProductSelectionGuideItem,
  ResponsiveImage,
  ProductSpecification,
  PrimaryNavigationRoute,
  PublicNavigationItem,
  ReferenceApplication,
  RetailProduct,
  SiteContent,
  StaticRoute,
  StaticSolution,
} from '~/types/static-site.types'

export const staticRoutes = [
  '/',
  '/solutions',
  '/products',
  '/projects',
  '/posts',
  '/about',
  '/contact',
  '/privacy',
] as const satisfies readonly StaticRoute[]

type UnknownRecord = Record<string, unknown>

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const imagePattern = /^\/images\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:avif|jpe?g|png|svg|webp)$/i
const imageCandidatePattern = /^(\/images\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:avif|jpe?g|png|svg|webp))\s+(\d+)w$/i
const phoneHrefPattern = /^tel:(\+?[0-9]{8,15})$/
const zaloHrefPattern = /^https:\/\/zalo\.me\/([0-9]{8,15})\/?$/
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

const invalid = (path: string, message: string): never => {
  throw new TypeError(`Invalid site content at ${path}: ${message}`)
}

const expectRecord = (value: unknown, path: string): UnknownRecord => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return invalid(path, 'expected an object')
  }
  return value as UnknownRecord
}

const expectExactKeys = (
  value: UnknownRecord,
  path: string,
  requiredKeys: readonly string[],
  optionalKeys: readonly string[] = [],
) => {
  const allowedKeys = new Set([...requiredKeys, ...optionalKeys])
  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) invalid(`${path}.${key}`, 'field is required')
  }
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) invalid(`${path}.${key}`, 'unknown field')
  }
}

const expectArray = (value: unknown, path: string): unknown[] => {
  if (!Array.isArray(value) || value.length === 0) return invalid(path, 'expected a non-empty array')
  return value
}

const expectString = (value: unknown, path: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) return invalid(path, 'expected a non-empty string')
  return value
}

const expectBoolean = (value: unknown, path: string): boolean => {
  if (typeof value !== 'boolean') return invalid(path, 'expected a boolean')
  return value
}

const expectPositiveInteger = (value: unknown, path: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return invalid(path, 'expected a positive integer')
  }
  return value
}

const expectIdentifier = (value: unknown, path: string): string => {
  const identifier = expectString(value, path)
  if (!idPattern.test(identifier)) invalid(path, 'must use lowercase kebab-case')
  return identifier
}

const expectImagePath = (value: unknown, path: string): string => {
  const imagePath = expectString(value, path)
  if (!imagePattern.test(imagePath)) invalid(path, 'must reference an image below /images')
  return imagePath
}

const expectImageSrcset = (value: unknown, path: string): string => {
  const srcset = expectString(value, path)
  const candidates = srcset.split(',').map(candidate => candidate.trim())
  const widths = candidates.map((candidate, index) => {
    const match = candidate.match(imageCandidatePattern)
      || invalid(`${path}[${index}]`, 'must use an /images path followed by a width descriptor')
    return Number(match[2])
  })

  if (!widths.every(width => Number.isSafeInteger(width) && width > 0)) {
    invalid(path, 'width descriptors must be positive integers')
  }
  assertUnique(widths.map(String), path)
  if (!widths.every((width, index) => index === 0 || width > widths[index - 1])) {
    invalid(path, 'width descriptors must be in ascending order')
  }
  return srcset
}

const parseResponsiveImage = (value: UnknownRecord, path: string): ResponsiveImage => ({
  image: expectImagePath(value.image, `${path}.image`),
  ...(value.imageSrcset === undefined ? {} : { imageSrcset: expectImageSrcset(value.imageSrcset, `${path}.imageSrcset`) }),
  imageWidth: expectPositiveInteger(value.imageWidth, `${path}.imageWidth`),
  imageHeight: expectPositiveInteger(value.imageHeight, `${path}.imageHeight`),
  imageAlt: expectString(value.imageAlt, `${path}.imageAlt`),
})

const assertUnique = (values: readonly string[], path: string) => {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) invalid(path, `values must be unique; duplicate "${value}"`)
    seen.add(value)
  }
}

const expectStringArray = (value: unknown, path: string): string[] => {
  const strings = expectArray(value, path).map((item, index) => expectString(item, `${path}[${index}]`))
  assertUnique(strings, path)
  return strings
}

const isStaticRoute = (value: string): value is StaticRoute => staticRoutes.some(route => route === value)

const expectNavigationRoute = (value: unknown, path: string): PrimaryNavigationRoute => {
  const route = expectString(value, path)
  if (isStaticRoute(route) && route !== '/' && route !== '/privacy') return route
  return invalid(path, 'must be a primary public navigation route')
}

const expectPatternMatch = (value: string, pattern: RegExp, path: string, message: string): RegExpMatchArray => {
  const match = value.match(pattern)
  return match || invalid(path, message)
}

const expectIsoDate = (value: unknown, path: string): string => {
  const date = expectString(value, path)
  const parsedDate = new Date(`${date}T00:00:00.000Z`)
  if (!isoDatePattern.test(date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) {
    invalid(path, 'must be a real calendar date in YYYY-MM-DD format')
  }
  return date
}

const parseNavigationItem = (value: unknown, path: string): PublicNavigationItem => {
  const item = expectRecord(value, path)
  expectExactKeys(item, path, ['label', 'href'])
  return {
    label: expectString(item.label, `${path}.label`),
    href: expectNavigationRoute(item.href, `${path}.href`),
  }
}

const parseCompanyContact = (value: unknown, path: string): CompanyContact => {
  const contact = expectRecord(value, path)
  expectExactKeys(contact, path, [
    'phoneDisplay',
    'phoneHref',
    'hours',
    'serviceArea',
  ], ['emailDisplay', 'emailHref', 'zaloHref'])

  const phoneDisplay = expectString(contact.phoneDisplay, `${path}.phoneDisplay`)
  const phoneHref = expectString(contact.phoneHref, `${path}.phoneHref`)
  const phoneMatch = expectPatternMatch(
    phoneHref,
    phoneHrefPattern,
    `${path}.phoneHref`,
    'must be a tel: link containing 8 to 15 digits',
  )

  const displayDigits = phoneDisplay.replace(/\D/g, '')
  const hrefDigits = phoneMatch[1].replace(/^\+/, '')
  if (displayDigits !== hrefDigits) invalid(`${path}.phoneDisplay`, 'must contain the same digits as phoneHref')

  const hasEmailDisplay = contact.emailDisplay !== undefined
  const hasEmailHref = contact.emailHref !== undefined
  if (hasEmailDisplay !== hasEmailHref) invalid(path, 'emailDisplay and emailHref must be provided together')

  let emailFields: Pick<CompanyContact, 'emailDisplay' | 'emailHref'> = {}
  if (hasEmailDisplay && hasEmailHref) {
    const emailDisplay = expectString(contact.emailDisplay, `${path}.emailDisplay`)
    if (!emailPattern.test(emailDisplay)) invalid(`${path}.emailDisplay`, 'must be a valid email address')
    const emailHref = expectString(contact.emailHref, `${path}.emailHref`)
    if (emailHref !== `mailto:${emailDisplay}`) invalid(`${path}.emailHref`, 'must exactly match emailDisplay')
    emailFields = { emailDisplay, emailHref }
  }

  let zaloFields: Pick<CompanyContact, 'zaloHref'> = {}
  if (contact.zaloHref !== undefined) {
    const zaloHref = expectString(contact.zaloHref, `${path}.zaloHref`)
    const zaloMatch = expectPatternMatch(
      zaloHref,
      zaloHrefPattern,
      `${path}.zaloHref`,
      'must be an HTTPS zalo.me link containing a phone number',
    )
    if (zaloMatch[1] !== hrefDigits) invalid(`${path}.zaloHref`, 'must contain the same phone number as phoneHref')
    zaloFields = { zaloHref }
  }

  return {
    phoneDisplay,
    phoneHref,
    ...emailFields,
    ...zaloFields,
    hours: expectString(contact.hours, `${path}.hours`),
    serviceArea: expectString(contact.serviceArea, `${path}.serviceArea`),
  }
}

const parseProductSpecification = (value: unknown, path: string): ProductSpecification => {
  const specification = expectRecord(value, path)
  expectExactKeys(specification, path, ['label', 'value'])
  return {
    label: expectString(specification.label, `${path}.label`),
    value: expectString(specification.value, `${path}.value`),
  }
}

const parseProductFamily = (value: unknown, path: string): ProductFamily => {
  const family = expectRecord(value, path)
  expectExactKeys(family, path, [
    'id',
    'name',
    'eyebrow',
    'image',
    'imageWidth',
    'imageHeight',
    'imageAlt',
    'summary',
    'applications',
    'specifications',
  ], ['imageSrcset'])
  const specifications = expectArray(family.specifications, `${path}.specifications`).map((item, index) =>
    parseProductSpecification(item, `${path}.specifications[${index}]`),
  )
  assertUnique(specifications.map(item => item.label), `${path}.specifications[].label`)
  return {
    id: expectIdentifier(family.id, `${path}.id`),
    name: expectString(family.name, `${path}.name`),
    eyebrow: expectString(family.eyebrow, `${path}.eyebrow`),
    ...parseResponsiveImage(family, path),
    summary: expectString(family.summary, `${path}.summary`),
    applications: expectStringArray(family.applications, `${path}.applications`),
    specifications,
  }
}

const parseProductDetailSection = (value: unknown, path: string): ProductDetailSection => {
  const section = expectRecord(value, path)
  expectExactKeys(section, path, ['id', 'title', 'summary', 'paragraphs', 'specifications', 'points'])
  const specifications = expectArray(section.specifications, `${path}.specifications`).map((item, index) =>
    parseProductSpecification(item, `${path}.specifications[${index}]`),
  )
  assertUnique(specifications.map(item => item.label), `${path}.specifications[].label`)
  return {
    id: expectIdentifier(section.id, `${path}.id`),
    title: expectString(section.title, `${path}.title`),
    summary: expectString(section.summary, `${path}.summary`),
    paragraphs: expectStringArray(section.paragraphs, `${path}.paragraphs`),
    specifications,
    points: expectStringArray(section.points, `${path}.points`),
  }
}

const parseProductFrequentlyAskedQuestion = (value: unknown, path: string): ProductFrequentlyAskedQuestion => {
  const item = expectRecord(value, path)
  expectExactKeys(item, path, ['question', 'answer'])
  return {
    question: expectString(item.question, `${path}.question`),
    answer: expectString(item.answer, `${path}.answer`),
  }
}

const parseProductSelectionGuideItem = (value: unknown, path: string): ProductSelectionGuideItem => {
  const item = expectRecord(value, path)
  expectExactKeys(item, path, ['title', 'summary', 'check'])
  return {
    title: expectString(item.title, `${path}.title`),
    summary: expectString(item.summary, `${path}.summary`),
    check: expectString(item.check, `${path}.check`),
  }
}

const parseRetailProduct = (value: unknown, path: string): RetailProduct => {
  const product = expectRecord(value, path)
  expectExactKeys(product, path, [
    'slug',
    'familyId',
    'name',
    'eyebrow',
    'image',
    'imageWidth',
    'imageHeight',
    'imageAlt',
    'summary',
    'applications',
    'specifications',
    'detailSections',
    'selectionChecklist',
    'selectionGuide',
    'frequentlyAskedQuestions',
  ], ['imageSrcset'])
  const specifications = expectArray(product.specifications, `${path}.specifications`).map((item, index) =>
    parseProductSpecification(item, `${path}.specifications[${index}]`),
  )
  assertUnique(specifications.map(item => item.label), `${path}.specifications[].label`)
  const detailSections = expectArray(product.detailSections, `${path}.detailSections`).map((item, index) =>
    parseProductDetailSection(item, `${path}.detailSections[${index}]`),
  )
  assertUnique(detailSections.map(item => item.id), `${path}.detailSections[].id`)
  const selectionGuide = expectArray(product.selectionGuide, `${path}.selectionGuide`).map((item, index) =>
    parseProductSelectionGuideItem(item, `${path}.selectionGuide[${index}]`),
  )
  assertUnique(selectionGuide.map(item => item.title), `${path}.selectionGuide[].title`)
  const frequentlyAskedQuestions = expectArray(product.frequentlyAskedQuestions, `${path}.frequentlyAskedQuestions`).map((item, index) =>
    parseProductFrequentlyAskedQuestion(item, `${path}.frequentlyAskedQuestions[${index}]`),
  )
  assertUnique(frequentlyAskedQuestions.map(item => item.question), `${path}.frequentlyAskedQuestions[].question`)
  return {
    slug: expectIdentifier(product.slug, `${path}.slug`),
    familyId: expectIdentifier(product.familyId, `${path}.familyId`),
    name: expectString(product.name, `${path}.name`),
    eyebrow: expectString(product.eyebrow, `${path}.eyebrow`),
    ...parseResponsiveImage(product, path),
    summary: expectString(product.summary, `${path}.summary`),
    applications: expectStringArray(product.applications, `${path}.applications`),
    specifications,
    detailSections,
    selectionChecklist: expectStringArray(product.selectionChecklist, `${path}.selectionChecklist`),
    selectionGuide,
    frequentlyAskedQuestions,
  }
}

const parseSolution = (value: unknown, path: string): StaticSolution => {
  const solution = expectRecord(value, path)
  expectExactKeys(solution, path, ['id', 'index', 'name', 'temperature', 'summary', 'recommendedSystem', 'checklist'])
  return {
    id: expectIdentifier(solution.id, `${path}.id`),
    index: expectString(solution.index, `${path}.index`),
    name: expectString(solution.name, `${path}.name`),
    temperature: expectString(solution.temperature, `${path}.temperature`),
    summary: expectString(solution.summary, `${path}.summary`),
    recommendedSystem: expectString(solution.recommendedSystem, `${path}.recommendedSystem`),
    checklist: expectStringArray(solution.checklist, `${path}.checklist`),
  }
}

const parseReferenceApplication = (value: unknown, path: string): ReferenceApplication => {
  const application = expectRecord(value, path)
  expectExactKeys(application, path, ['id', 'sector', 'title', 'brief', 'system', 'note'])
  return {
    id: expectIdentifier(application.id, `${path}.id`),
    sector: expectString(application.sector, `${path}.sector`),
    title: expectString(application.title, `${path}.title`),
    brief: expectString(application.brief, `${path}.brief`),
    system: expectStringArray(application.system, `${path}.system`),
    note: expectString(application.note, `${path}.note`),
  }
}

const parsePost = (value: unknown, path: string): ContentPost => {
  const post = expectRecord(value, path)
  expectExactKeys(post, path, [
    'id',
    'slug',
    'title',
    'eyebrow',
    'date',
    'image',
    'imageWidth',
    'imageHeight',
    'imageAlt',
    'summary',
    'body',
    'tags',
    'published',
  ], ['imageSrcset'])
  return {
    id: expectIdentifier(post.id, `${path}.id`),
    slug: expectIdentifier(post.slug, `${path}.slug`),
    title: expectString(post.title, `${path}.title`),
    eyebrow: expectString(post.eyebrow, `${path}.eyebrow`),
    date: expectIsoDate(post.date, `${path}.date`),
    ...parseResponsiveImage(post, path),
    summary: expectString(post.summary, `${path}.summary`),
    body: expectString(post.body, `${path}.body`),
    tags: expectStringArray(post.tags, `${path}.tags`),
    published: expectBoolean(post.published, `${path}.published`),
  }
}

export const parseSiteContent = (value: unknown): SiteContent => {
  const content = expectRecord(value, 'root')
  expectExactKeys(content, 'root', [
    'publicNavigation',
    'companyContact',
    'productFamilies',
    'retailProducts',
    'solutions',
    'referenceApplications',
    'posts',
    'consultationChecklist',
  ])

  const publicNavigation = expectArray(content.publicNavigation, 'publicNavigation').map((item, index) =>
    parseNavigationItem(item, `publicNavigation[${index}]`),
  )
  const productFamilies = expectArray(content.productFamilies, 'productFamilies').map((item, index) =>
    parseProductFamily(item, `productFamilies[${index}]`),
  )
  const retailProducts = expectArray(content.retailProducts, 'retailProducts').map((item, index) =>
    parseRetailProduct(item, `retailProducts[${index}]`),
  )
  const solutions = expectArray(content.solutions, 'solutions').map((item, index) =>
    parseSolution(item, `solutions[${index}]`),
  )
  const referenceApplications = expectArray(content.referenceApplications, 'referenceApplications').map((item, index) =>
    parseReferenceApplication(item, `referenceApplications[${index}]`),
  )
  const posts = expectArray(content.posts, 'posts').map((item, index) => parsePost(item, `posts[${index}]`))

  assertUnique(staticRoutes, 'staticRoutes')
  assertUnique(publicNavigation.map(item => item.href), 'publicNavigation[].href')
  assertUnique(productFamilies.map(item => item.id), 'productFamilies[].id')
  assertUnique(retailProducts.map(item => item.slug), 'retailProducts[].slug')
  assertUnique(solutions.map(item => item.id), 'solutions[].id')
  assertUnique(solutions.map(item => item.index), 'solutions[].index')
  assertUnique(referenceApplications.map(item => item.id), 'referenceApplications[].id')
  assertUnique(posts.map(item => item.id), 'posts[].id')
  assertUnique(posts.map(item => item.slug), 'posts[].slug')

  const expectedNavigationRoutes = staticRoutes.filter(route => route !== '/' && route !== '/privacy')
  const navigationHrefs = new Set(publicNavigation.map(item => item.href))
  if (!expectedNavigationRoutes.every(route => navigationHrefs.has(route))) {
    invalid('publicNavigation[].href', 'must include every canonical navigation route exactly once')
  }
  const productFamilyIds = new Set(productFamilies.map(item => item.id))
  for (const product of retailProducts) {
    if (!productFamilyIds.has(product.familyId)) {
      invalid(`retailProducts.${product.slug}.familyId`, `must reference an existing product family`)
    }
  }
  if (!posts.some(post => post.published)) invalid('posts[].published', 'at least one post must be published')

  return {
    publicNavigation,
    companyContact: parseCompanyContact(content.companyContact, 'companyContact'),
    productFamilies,
    retailProducts,
    solutions,
    referenceApplications,
    posts,
    consultationChecklist: expectStringArray(content.consultationChecklist, 'consultationChecklist'),
  }
}

export const defaultSiteContent = parseSiteContent(siteContentJson)

export const publicNavigation = defaultSiteContent.publicNavigation
export const companyContact = defaultSiteContent.companyContact
export const productFamilies = defaultSiteContent.productFamilies
export const retailProducts = defaultSiteContent.retailProducts
export const solutions = defaultSiteContent.solutions
export const referenceApplications = defaultSiteContent.referenceApplications
export const posts = defaultSiteContent.posts
export const consultationChecklist = defaultSiteContent.consultationChecklist
