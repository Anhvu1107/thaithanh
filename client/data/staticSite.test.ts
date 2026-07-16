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
  retailProducts,
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
  it('uses one consistent Thai Thanh brand name in public content', () => {
    const serializedContent = JSON.stringify(defaultSiteContent)
    expect(serializedContent).toContain('Thái Thanh')
    expect(serializedContent).not.toContain('Thái Thành')
  })

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
    const productRoutes = retailProducts.map(product => `/products/${product.slug}`)
    const staticRouteSet = new Set<string>(staticRoutes)
    expectUnique(postRoutes)
    expectUnique(productRoutes)
    expect(postRoutes.some(route => staticRouteSet.has(route))).toBe(false)
    expect(productRoutes.some(route => staticRouteSet.has(route))).toBe(false)
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
    expectUnique(retailProducts.map(product => product.slug))
    expect(retailProducts.every(product => identifierPattern.test(product.slug))).toBe(true)
    expect(retailProducts.every(product => productFamilies.some(family => family.id === product.familyId))).toBe(true)
    expect(posts.every(post => /^\d{4}-\d{2}-\d{2}$/.test(post.date))).toBe(true)
  })

  it('presents product families as consultation content without commerce fields', () => {
    expect(productFamilies.length).toBeGreaterThanOrEqual(2)
    expect(retailProducts).toHaveLength(5)
    expect(JSON.stringify([productFamilies, retailProducts])).not.toMatch(/"(?:price|salePrice|stock|checkout|cart)"/i)
    expect(JSON.stringify([productFamilies, retailProducts])).not.toMatch(/\b(?:PIR|Rockwool|PCCC|PU|PUR)\b|bông khoáng|polyurethane|pu-foam/i)
  })

  it('publishes the confirmed retail panel, accessory and Inox 304 door specifications', () => {
    const eps = productFamilies.find(item => item.id === 'eps')
    const doorsAndAccessories = productFamilies.find(item => item.id === 'doors-accessories')

    expect(eps?.specifications).toContainEqual({ label: 'Độ dày', value: '50–200 mm' })
    expect(eps?.specifications).toContainEqual({
      label: 'Tỷ trọng',
      value: '14–16 kg/m³; 18–20 kg/m³; 23–25 kg/m³ (tùy loại panel)',
    })
    expect(doorsAndAccessories?.applications).toEqual([
      'Cửa kho lạnh Inox 304',
      'Phụ kiện panel',
      'Phụ kiện cửa',
      'Vật tư cách nhiệt',
    ])
    expect(doorsAndAccessories?.specifications).toContainEqual({
      label: 'Kích thước cửa',
      value: '600 × 600 × 100 mm (rộng × cao × dày); các kích thước rộng × cao: 700 × 700, 800 × 800, 700 × 1700, 800 × 1800, 900 × 1800, 1000 × 1800, 1100 × 1800, 1200 × 1800 mm; độ dày xác nhận theo cấu hình',
    })

    expect(retailProducts.map(product => product.slug)).toEqual([
      'panel-eps',
      'cua-kho-lanh',
      'phu-kien-kho-lanh',
      'phu-kien-cua',
      'vat-tu-cach-nhiet',
    ])
    expect(retailProducts.find(product => product.slug === 'panel-eps')?.specifications).toContainEqual({
      label: 'Độ dày',
      value: '50 / 75 / 100 / 125 / 150 / 175 / 200 mm; quy cách thực tế xác nhận theo đơn hàng',
    })
    const panel = retailProducts.find(product => product.slug === 'panel-eps')
    expect(panel?.detailSections.map(section => section.id)).toEqual([
      'cau-tao-panel',
      'quy-cach-panel',
      'chon-do-day-ty-trong',
      'be-mat-va-hoan-thien',
      'ung-dung-panel',
      'thi-cong-va-phu-kien',
      'van-chuyen-bao-quan',
      'gioi-han-va-bao-tri',
    ])
    const panelCopy = JSON.stringify(panel)
    expect(panelCopy).toMatch(/sandwich ba lớp.*50.*75.*100.*125.*150.*175.*200.*14.*16.*18.*20.*23.*25/is)
    expect(panelCopy).toMatch(/Tôn mạ màu.*Inox 304.*ngàm bậc âm–dương.*Nẹp U.*V trong.*V ngoài/is)
    expect(panelCopy).toMatch(/λ.*Uc\/U.*R.*Q = U × A × ΔT/is)
    expect(panelCopy).toMatch(/\+4.*\+10.*4,4.*−4.*\+2.*4,2–5,6.*−23.*−29.*6,2–7,0.*−40.*−46.*7,9–8,8/is)
    expect(panelCopy).toMatch(/ưu điểm|Khối lượng nhẹ/is)
    expect(panelCopy).toMatch(/hạn chế|không tự động đồng nghĩa cách nhiệt tốt hơn|không phải lõi không cháy/is)

    const coldRoomDoor = retailProducts.find(product => product.slug === 'cua-kho-lanh')
    expect(coldRoomDoor?.specifications).toContainEqual({ label: 'Bề mặt cửa', value: 'Inox 304' })
    expect(coldRoomDoor?.detailSections.map(section => section.id)).toEqual([
      'cau-tao-bo-cua',
      'kich-thuoc-va-cach-do-o-cho',
      'cua-ban-le',
      'cua-truot',
      'song-gai-inox',
      'song-gai-eps',
      'lam-kin-suoi-va-an-toan',
    ])
    expect(coldRoomDoor?.selectionChecklist).toHaveLength(12)
    expect(coldRoomDoor?.frequentlyAskedQuestions).toHaveLength(6)

    const coldRoomDoorCopy = JSON.stringify(coldRoomDoor)
    expect(coldRoomDoorCopy).toMatch(/Cửa kho lạnh bản lề.*Cửa lùa, cửa trượt kho lạnh.*Cửa song gài Inox.*Cửa song gài EPS/s)
    expect(coldRoomDoorCopy).toMatch(/lõi EPS.*ray.*bánh xe.*gioăng.*điện trở sưởi.*mở an toàn/is)
    expect(coldRoomDoorCopy).toMatch(/điểm sương.*số lần.*thời gian mở.*luồng người.*xe hàng/is)
    expect(coldRoomDoorCopy).toMatch(/mở từ bên trong.*bên ngoài.*khóa|mở từ trong.*khóa bên ngoài/is)
    expect(coldRoomDoorCopy).toMatch(/Cửa bản lề cần vùng quét cánh.*Cửa trượt cần khoảng vách/is)
    expect(coldRoomDoorCopy).not.toMatch(/1471421817120_1148|tamcachnhiettabi|Tabi|Coolmax|Atimon|-70.*60\s*°C/i)

    const accessoryCatalog = retailProducts.find(product => product.slug === 'phu-kien-kho-lanh')
    expect(accessoryCatalog?.detailSections.map(section => section.id)).toEqual([
      'nep-u-panel',
      'nep-v-panel',
      'treo-tran-panel',
      'van-can-bang-ap',
      'ong-cach-nhiet',
    ])
    expect(JSON.stringify(retailProducts.find(product => product.slug === 'phu-kien-cua'))).toMatch(/Bản lề.*ray.*Gioăng.*Điện trở sưởi.*Tay khóa.*Màn PVC/is)
    const materialCatalogCopy = JSON.stringify(retailProducts.find(product => product.slug === 'vat-tu-cach-nhiet'))
    expect(materialCatalogCopy).toMatch(/Inox 304.*Xốp EPS.*Tôn mạ màu/is)
    expect(materialCatalogCopy).toMatch(/Chi tiết gia công theo bản vẽ/is)

    for (const product of retailProducts) {
      expect(product.specifications.length, `${product.slug} top-level specifications`).toBeGreaterThanOrEqual(4)
      expect(product.selectionGuide.length, `${product.slug} engineering selection guide`).toBeGreaterThanOrEqual(4)
      expect(product.advantages.length, `${product.slug} advantages`).toBeGreaterThanOrEqual(3)
      expect(product.limitations.length, `${product.slug} limitations`).toBeGreaterThanOrEqual(3)
      expect(product.detailSections.length, `${product.slug} detail sections`).toBeGreaterThanOrEqual(4)
      expect(product.selectionChecklist.length, `${product.slug} selection checklist`).toBeGreaterThanOrEqual(8)
      expect(product.frequentlyAskedQuestions.length, `${product.slug} FAQ`).toBeGreaterThanOrEqual(4)
      const sectionMedia = product.detailSections.flatMap(section => section.media ? [section.media] : [])
      expect(sectionMedia.length, `${product.slug} illustrated sections`).toBeGreaterThanOrEqual(1)
      expect(sectionMedia.length, `${product.slug} illustrated browsing coverage`).toBeGreaterThanOrEqual(
        Math.ceil(product.detailSections.length / 2),
      )
      expect(sectionMedia.every(media => media.image !== product.image), `${product.slug} media must add new context`).toBe(true)
      for (const media of sectionMedia) {
        expect(media.caption.trim().length, `${product.slug} media caption`).toBeGreaterThanOrEqual(24)
        expect(media.imageAlt.trim().length, `${product.slug} media alt`).toBeGreaterThanOrEqual(20)
      }
      for (const section of product.detailSections) {
        expect(section.paragraphs.length, `${product.slug}/${section.id} paragraphs`).toBeGreaterThanOrEqual(2)
        expect(section.specifications.length, `${product.slug}/${section.id} specifications`).toBeGreaterThanOrEqual(4)
        expect(section.points.length, `${product.slug}/${section.id} comparison points`).toBeGreaterThanOrEqual(3)
        for (const reference of section.references ?? []) {
          expect(reference.url, `${product.slug}/${section.id} technical reference`).toMatch(/^https:\/\//)
          expect(reference.label.trim().length, `${product.slug}/${section.id} reference label`).toBeGreaterThan(0)
        }
      }
      for (const [index, guide] of product.selectionGuide.entries()) {
        expect(guide.need.trim().length, `${product.slug}/selectionGuide[${index}].need`).toBeGreaterThan(0)
        expect(
          guide.operatingConditions.trim().length,
          `${product.slug}/selectionGuide[${index}].operatingConditions`,
        ).toBeGreaterThan(0)
        expect(
          guide.preliminaryConfiguration.trim().length,
          `${product.slug}/selectionGuide[${index}].preliminaryConfiguration`,
        ).toBeGreaterThan(0)
        expect(guide.confirm.trim().length, `${product.slug}/selectionGuide[${index}].confirm`).toBeGreaterThan(0)
      }
    }

    expect(JSON.stringify(retailProducts)).not.toMatch(/1471421817120_1148|tamcachnhiettabi|Tabi|Coolmax|CM-\d+|Atimon|Antimon|900\s*°C|1000\s*°C|-70.*60\s*°C/i)
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
      ...retailProducts.flatMap(item => [
        item.image,
        ...srcsetImages(item.imageSrcset),
        ...item.detailSections.flatMap(section => section.media
          ? [section.media.image, ...srcsetImages(section.media.imageSrcset)]
          : []),
      ]),
      ...posts.flatMap(item => [item.image, ...srcsetImages(item.imageSrcset)]),
    ]

    for (const imageReference of imageReferences) {
      const absolutePath = path.resolve(publicDirectory, imageReference.replace(/^\/+/, ''))
      expect(absolutePath.startsWith(`${publicDirectory}${path.sep}`)).toBe(true)
      const exists = fs.existsSync(absolutePath)
      expect(exists, `${imageReference} must resolve to a public file`).toBe(true)
      if (exists) expect(fs.statSync(absolutePath).isFile()).toBe(true)
    }

    const responsiveImages = [
      ...productFamilies,
      ...retailProducts,
      ...posts,
      ...retailProducts.flatMap(product => product.detailSections.flatMap(section => section.media ? [section.media] : [])),
    ]
    for (const item of responsiveImages) {
      expect(item.imageWidth).toBeGreaterThan(0)
      expect(item.imageHeight).toBeGreaterThan(0)
      expect(item.imageAlt.trim().length).toBeGreaterThan(0)
    }
  })

  it('locks the approved Thai Thanh EPS step-joint geometry and versioned visuals', () => {
    const panel = retailProducts.find(product => product.slug === 'panel-eps')
    const specificationMedia = panel?.detailSections.find(section => section.id === 'quy-cach-panel')?.media
    const installationMedia = panel?.detailSections.find(section => section.id === 'thi-cong-va-phu-kien')?.media

    expect(panel?.image).toBe('/images/insulation/eps-panel-step-joint-editorial.jpg')
    expect(specificationMedia).toMatchObject({
      image: '/images/insulation/eps-panel-step-joint.webp',
      imageSrcset: '/images/insulation/eps-panel-step-joint-640.webp 640w, /images/insulation/eps-panel-step-joint.webp 1200w',
      imageWidth: 1200,
      imageHeight: 1200,
    })
    expect(specificationMedia?.caption).toMatch(/không phải rãnh U sâu hoặc khung chữ C/i)
    expect(installationMedia).toMatchObject({
      image: '/images/insulation/panel-step-joint-diagram.svg',
      imageWidth: 1200,
      imageHeight: 760,
    })
    expect(installationMedia?.imageAlt).toMatch(/ngàm bậc âm–dương/i)

    const jointDiagramPath = path.resolve(publicDirectory, 'images', 'insulation', 'panel-step-joint-diagram.svg')
    const jointDiagram = fs.readFileSync(jointDiagramPath, 'utf8')
    expect(jointDiagram).toMatch(/id="eps-step-joint"[^>]+data-joint-version="thai-thanh-step-v2"/)
    expect(jointDiagram).toContain('id="male-step-core"')
    expect(jointDiagram).toContain('id="female-step-core"')
    expect(jointDiagram).toContain('id="assembled-step-joint"')
    expect(jointDiagram).toContain('M112 305H410V341H360V377H112Z')
    expect(jointDiagram).toContain('M500 305H740V377H450V341H500Z')
    expect(jointDiagram).not.toContain('M112 305H430V328H486V354H430V377H112Z')
    expect(jointDiagram).not.toContain('M536 305H939V377H536V358H500V324H536Z')
    expect(jointDiagram).not.toMatch(/\b(?:PU|PUR|PIR)\b|polyurethane|pu[-\s]?foam/i)
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

    const duplicateProductSlug = structuredClone(siteContentJson)
    duplicateProductSlug.retailProducts[1].slug = duplicateProductSlug.retailProducts[0].slug
    expect(() => parseSiteContent(duplicateProductSlug)).toThrow(/retailProducts\[\]\.slug: values must be unique/)

    const missingProductFamily = structuredClone(siteContentJson)
    missingProductFamily.retailProducts[0].familyId = 'missing-family'
    expect(() => parseSiteContent(missingProductFamily)).toThrow(/retailProducts\.panel-eps\.familyId: must reference an existing product family/)

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
    invalidSrcset.productFamilies[0].imageSrcset = '/images/insulation/eps-panel-step-joint-640.webp 0w'
    expect(() => parseSiteContent(invalidSrcset)).toThrow(/productFamilies\[0\]\.imageSrcset: width descriptors must be positive integers/)

    const unknownField = structuredClone(siteContentJson) as typeof siteContentJson & { admin?: boolean }
    unknownField.admin = true
    expect(() => parseSiteContent(unknownField)).toThrow(/root\.admin: unknown field/)
  })

  it('validates nested product specifications, selection guides and FAQ identifiers', () => {
    const duplicateDetailSpecification = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{
        detailSections: Array<{ specifications?: Array<{ label: string }> }>
        frequentlyAskedQuestions?: Array<{ question: string }>
      }>
    }
    const door = duplicateDetailSpecification.retailProducts[1]!
    const detailSpecifications = door.detailSections[0]!.specifications!
    detailSpecifications[1]!.label = detailSpecifications[0]!.label
    expect(() => parseSiteContent(duplicateDetailSpecification)).toThrow(
      /retailProducts\[1\]\.detailSections\[0\]\.specifications\[\]\.label: values must be unique/,
    )

    const duplicateFaqQuestion = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ frequentlyAskedQuestions?: Array<{ question: string }> }>
    }
    const faq = duplicateFaqQuestion.retailProducts[1]!.frequentlyAskedQuestions!
    faq[1]!.question = faq[0]!.question
    expect(() => parseSiteContent(duplicateFaqQuestion)).toThrow(
      /retailProducts\[1\]\.frequentlyAskedQuestions\[\]\.question: values must be unique/,
    )

    const duplicateSelectionNeed = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ selectionGuide: Array<{ need: string }> }>
    }
    const selectionGuide = duplicateSelectionNeed.retailProducts[0]!.selectionGuide
    selectionGuide[1]!.need = selectionGuide[0]!.need
    expect(() => parseSiteContent(duplicateSelectionNeed)).toThrow(
      /retailProducts\[0\]\.selectionGuide\[\]\.need: values must be unique/,
    )

    const missingSelectionField = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ selectionGuide: Array<Record<string, unknown>> }>
    }
    delete missingSelectionField.retailProducts[0]!.selectionGuide[0]!.operatingConditions
    expect(() => parseSiteContent(missingSelectionField)).toThrow(
      /retailProducts\[0\]\.selectionGuide\[0\]\.operatingConditions: field is required/,
    )

    const legacySelectionGuide = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ selectionGuide: Array<Record<string, unknown>> }>
    }
    legacySelectionGuide.retailProducts[0]!.selectionGuide[0] = {
      check: 'Legacy check',
      summary: 'Legacy summary',
      title: 'Legacy title',
    }
    expect(() => parseSiteContent(legacySelectionGuide)).toThrow(
      /retailProducts\[0\]\.selectionGuide\[0\]\.need: field is required/,
    )

    const unknownSelectionField = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ selectionGuide: Array<Record<string, unknown>> }>
    }
    unknownSelectionField.retailProducts[0]!.selectionGuide[0]!.title = 'Unknown legacy field'
    expect(() => parseSiteContent(unknownSelectionField)).toThrow(
      /retailProducts\[0\]\.selectionGuide\[0\]\.title: unknown field/,
    )

    const emptyAdvantages = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ advantages: string[] }>
    }
    emptyAdvantages.retailProducts[0]!.advantages = []
    expect(() => parseSiteContent(emptyAdvantages)).toThrow(
      /retailProducts\[0\]\.advantages: expected a non-empty array/,
    )

    const missingLimitations = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<Record<string, unknown>>
    }
    delete missingLimitations.retailProducts[0]!.limitations
    expect(() => parseSiteContent(missingLimitations)).toThrow(
      /retailProducts\[0\]\.limitations: field is required/,
    )

    const missingMediaCaption = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ detailSections: Array<{ media?: Record<string, unknown> }> }>
    }
    delete missingMediaCaption.retailProducts[0]!.detailSections[0]!.media!.caption
    expect(() => parseSiteContent(missingMediaCaption)).toThrow(
      /retailProducts\[0\]\.detailSections\[0\]\.media\.caption: field is required/,
    )

    const unknownMediaField = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ detailSections: Array<{ media?: Record<string, unknown> }> }>
    }
    unknownMediaField.retailProducts[0]!.detailSections[0]!.media!.layout = 'wide'
    expect(() => parseSiteContent(unknownMediaField)).toThrow(
      /retailProducts\[0\]\.detailSections\[0\]\.media\.layout: unknown field/,
    )

    const insecureTechnicalReference = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ detailSections: Array<{ references?: Array<{ url: string }> }> }>
    }
    insecureTechnicalReference.retailProducts[0]!.detailSections[2]!.references![0]!.url = 'http://example.com/reference'
    expect(() => parseSiteContent(insecureTechnicalReference)).toThrow(
      /retailProducts\[0\]\.detailSections\[2\]\.references\[0\]\.url: must use an absolute HTTPS URL/,
    )

    const duplicateTechnicalReference = structuredClone(siteContentJson) as unknown as {
      retailProducts: Array<{ detailSections: Array<{ references?: Array<{ url: string }> }> }>
    }
    const references = duplicateTechnicalReference.retailProducts[0]!.detailSections[2]!.references!
    references[1]!.url = references[0]!.url
    expect(() => parseSiteContent(duplicateTechnicalReference)).toThrow(
      /retailProducts\[0\]\.detailSections\[2\]\.references\[\]\.url: values must be unique/,
    )
  })
})
