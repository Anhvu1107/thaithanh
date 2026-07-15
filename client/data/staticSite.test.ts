import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import siteContentJson from './site-content.json'
import {
  companyContact,
  defaultSiteContent,
  parseSiteContent,
  posts,
  productFamilies,
  publicNavigation,
  referenceApplications,
  solutions,
  staticRoutes,
} from './staticSite'

const forbiddenCommercePath = /^\/(?:shop|cart|checkout|payment|account|auth|admin)(?:\/|$)/
const identifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const dataDirectory = path.dirname(fileURLToPath(import.meta.url))
const publicDirectory = path.resolve(dataDirectory, '..', 'public')

const expectUnique = (values: readonly string[]) => {
  expect(new Set(values).size).toBe(values.length)
}

describe('static site scope', () => {
  it('exposes one complete set of canonical company website routes', () => {
    expect(staticRoutes).toEqual([
      '/',
      '/solutions',
      '/products',
      '/projects',
      '/posts',
      '/about',
      '/contact',
      '/privacy',
    ])
    expectUnique(staticRoutes)
    expect(publicNavigation.map(item => item.href)).toEqual(
      staticRoutes.filter(route => route !== '/' && route !== '/privacy'),
    )
    expect(publicNavigation.every(item => !forbiddenCommercePath.test(item.href))).toBe(true)

    const postRoutes = posts.map(post => `/posts/${post.slug}`)
    const staticRouteSet = new Set<string>(staticRoutes)
    expectUnique(postRoutes)
    expect(postRoutes.some(route => staticRouteSet.has(route))).toBe(false)
  })

  it('uses unique, stable identifiers for every content collection', () => {
    const collections = [productFamilies, solutions, referenceApplications, posts]
    for (const collection of collections) {
      const ids = collection.map(item => item.id)
      expectUnique(ids)
      expect(ids.every(id => identifierPattern.test(id))).toBe(true)
    }

    expectUnique(posts.map(post => post.slug))
    expect(posts.every(post => identifierPattern.test(post.slug))).toBe(true)
    expect(posts.every(post => /^\d{4}-\d{2}-\d{2}$/.test(post.date))).toBe(true)
  })

  it('presents product families as consultation content without commerce fields', () => {
    expect(productFamilies.length).toBeGreaterThanOrEqual(2)
    expect(JSON.stringify(productFamilies)).not.toMatch(/"(?:price|salePrice|stock|checkout|cart)"/i)
    expect(JSON.stringify(productFamilies)).not.toMatch(/\b(?:PU|PIR|Rockwool|PCCC)\b|bông khoáng|chống cháy/i)
  })

  it('publishes the confirmed retail panel, accessory and Inox 304 door specifications', () => {
    const eps = productFamilies.find(item => item.id === 'eps')
    const doorsAndAccessories = productFamilies.find(item => item.id === 'doors-accessories')

    expect(eps?.specifications).toContainEqual({ label: 'Độ dày', value: '50–200 mm' })
    expect(eps?.specifications).toContainEqual({
      label: 'Tỷ trọng',
      value: '14–16 kg/m³; 18–20 kg/m³; 23–25 kg/m³ (tùy loại panel)',
    })
    expect(doorsAndAccessories?.applications).toEqual(['Cửa Inox 304', 'Nẹp U', 'V trong', 'V ngoài'])
    expect(doorsAndAccessories?.specifications).toContainEqual({
      label: 'Kích thước cửa',
      value: '600 × 600 × 100 mm; 700 × 700 mm; 800 × 800 mm; 700 × 1700 mm; 800 × 1800 mm; 900 × 1800 mm; 1000 × 1800 mm; 1100 × 1800 mm; 1200 × 1800 mm',
    })
  })

  it('provides consistent direct contact actions that work without a backend', () => {
    expect(companyContact.phoneHref).toMatch(/^tel:\+?[0-9]{8,15}$/)
    expect(companyContact.phoneDisplay.replace(/\D/g, '')).toBe(companyContact.phoneHref.replace(/^tel:\+?/, ''))
    if (companyContact.emailDisplay || companyContact.emailHref) {
      expect(companyContact.emailHref).toBe(`mailto:${companyContact.emailDisplay}`)
      expect(companyContact.emailDisplay).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    }
    if (companyContact.zaloHref) {
      expect(companyContact.zaloHref).toBe(`https://zalo.me/${companyContact.phoneHref.replace(/^tel:\+?/, '')}`)
    }
  })

  it('references only image files that exist inside public/images', () => {
    const srcsetImages = (srcset?: string) => srcset
      ? srcset.split(',').map(candidate => candidate.trim().split(/\s+/)[0])
      : []
    const imageReferences = [
      ...productFamilies.flatMap(item => [item.image, ...srcsetImages(item.imageSrcset)]),
      ...posts.flatMap(item => [item.image, ...srcsetImages(item.imageSrcset)]),
    ]

    for (const imageReference of imageReferences) {
      const absolutePath = path.resolve(publicDirectory, imageReference.replace(/^\/+/, ''))
      expect(absolutePath.startsWith(`${publicDirectory}${path.sep}`)).toBe(true)
      const exists = fs.existsSync(absolutePath)
      expect(exists, `${imageReference} must resolve to a public file`).toBe(true)
      if (exists) expect(fs.statSync(absolutePath).isFile()).toBe(true)
    }

    for (const item of [...productFamilies, ...posts]) {
      expect(item.imageWidth).toBeGreaterThan(0)
      expect(item.imageHeight).toBeGreaterThan(0)
      expect(item.imageAlt.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('site content validation', () => {
  it('accepts the checked-in content without unsafe type assertions', () => {
    expect(parseSiteContent(siteContentJson)).toEqual(defaultSiteContent)
  })

  it('rejects duplicate ids before they can create unstable Vue keys', () => {
    const invalidContent = structuredClone(siteContentJson)
    invalidContent.productFamilies[1].id = invalidContent.productFamilies[0].id
    expect(() => parseSiteContent(invalidContent)).toThrow(/productFamilies\[\]\.id: values must be unique/)
  })

  it('rejects duplicate navigation routes, post slugs and impossible dates', () => {
    const duplicateRoute = structuredClone(siteContentJson)
    duplicateRoute.publicNavigation[1].href = duplicateRoute.publicNavigation[0].href
    expect(() => parseSiteContent(duplicateRoute)).toThrow(/publicNavigation\[\]\.href: values must be unique/)

    const duplicateSlug = structuredClone(siteContentJson)
    const clonedPost = structuredClone(duplicateSlug.posts[0])
    clonedPost.id = 'another-post-id'
    duplicateSlug.posts.push(clonedPost)
    expect(() => parseSiteContent(duplicateSlug)).toThrow(/posts\[\]\.slug: values must be unique/)

    const impossibleDate = structuredClone(siteContentJson)
    impossibleDate.posts[0].date = '2026-02-30'
    expect(() => parseSiteContent(impossibleDate)).toThrow(/posts\[0\]\.date: must be a real calendar date/)
  })

  it('rejects contact links that disagree with the displayed contact details', () => {
    const missingPair = structuredClone(siteContentJson) as unknown as { companyContact: Record<string, unknown> }
    delete missingPair.companyContact.emailHref
    expect(() => parseSiteContent(missingPair)).toThrow(/companyContact: emailDisplay and emailHref must be provided together/)

    const mismatchedEmail = structuredClone(siteContentJson) as unknown as { companyContact: Record<string, unknown> }
    mismatchedEmail.companyContact.emailDisplay = 'sales@example.com'
    mismatchedEmail.companyContact.emailHref = 'mailto:wrong@example.com'
    expect(() => parseSiteContent(mismatchedEmail)).toThrow(/companyContact\.emailHref: must exactly match emailDisplay/)

    const mismatchedZalo = structuredClone(siteContentJson) as unknown as { companyContact: Record<string, unknown> }
    mismatchedZalo.companyContact.zaloHref = 'https://zalo.me/0909888168'
    expect(() => parseSiteContent(mismatchedZalo)).toThrow(/companyContact\.zaloHref: must contain the same phone number as phoneHref/)
  })

  it('rejects image traversal and unknown content fields', () => {
    const invalidImage = structuredClone(siteContentJson)
    invalidImage.posts[0].image = '/../private.png'
    expect(() => parseSiteContent(invalidImage)).toThrow(/posts\[0\]\.image: must reference an image below \/images/)

    const invalidSrcset = structuredClone(siteContentJson)
    invalidSrcset.productFamilies[0].imageSrcset = '/images/insulation/eps-panel-640.webp 0w'
    expect(() => parseSiteContent(invalidSrcset)).toThrow(/productFamilies\[0\]\.imageSrcset: width descriptors must be positive integers/)

    const unknownField = structuredClone(siteContentJson) as typeof siteContentJson & { admin?: boolean }
    unknownField.admin = true
    expect(() => parseSiteContent(unknownField)).toThrow(/root\.admin: unknown field/)
  })
})
