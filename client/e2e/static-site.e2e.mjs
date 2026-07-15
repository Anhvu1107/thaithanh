import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const here = path.dirname(fileURLToPath(import.meta.url))
const clientRoot = path.resolve(here, '..')
const outputRoot = path.join(clientRoot, '.output', 'public')
const webHost = '127.0.0.1'
const rawWebPort = process.env.E2E_WEB_PORT || '3200'
assert.match(rawWebPort, /^\d+$/, 'E2E_WEB_PORT must be an integer between 1 and 65535')
const webPort = Number(rawWebPort)
assert.ok(webPort >= 1 && webPort <= 65535, 'E2E_WEB_PORT must be an integer between 1 and 65535')
const webUrl = `http://${webHost}:${webPort}`
const canonicalRoutes = ['/', '/solutions', '/products', '/projects', '/posts', '/about', '/contact', '/privacy']
const canonicalPath = route => route === '/' ? '/' : `${route.replace(/\/$/, '')}/`
const removedRoutes = [
  '/api/admin/content',
  '/api/admin/uploads',
  '/content/site-content.json',
  '/content-live/site-content.json',
  '/uploads-live/removed.png',
]
const forbiddenNavigationPattern = /^\/(?:shop|cart|checkout|payment|account|auth|admin)(?:\/|$)/
const runtimeRequestPattern = /^\/(?:api(?:\/|$)|content(?:-live)?(?:\/|$)|uploads-live(?:\/|$))/
const unsupportedProductPattern = /\b(?:PIR|Rockwool)\b|bông khoáng/i

const contentTypes = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

const isFile = (candidate) => {
  try {
    return fs.statSync(candidate).isFile()
  } catch {
    return false
  }
}

const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
if (executablePath) {
  assert.ok(
    isFile(executablePath),
    `PLAYWRIGHT_EXECUTABLE_PATH does not point to a file: ${executablePath}`,
  )
}

const resolveOutputFile = (requestPath) => {
  let pathname
  try {
    pathname = decodeURIComponent(requestPath)
  } catch {
    return undefined
  }

  const directPath = path.resolve(outputRoot, `.${pathname}`)
  const isInsideOutput = directPath === outputRoot || directPath.startsWith(`${outputRoot}${path.sep}`)
  if (!isInsideOutput) return undefined
  if (isFile(directPath)) return directPath

  const indexPath = path.join(directPath, 'index.html')
  return isFile(indexPath) ? indexPath : undefined
}

assert.ok(
  isFile(path.join(outputRoot, 'index.html')),
  'static artifact is missing; run `npm run generate` before `npm run test:e2e`',
)
const homepageArtifact = fs.readFileSync(path.join(outputRoot, 'index.html'), 'utf8')
const homepageCanonical = homepageArtifact.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1]
assert.ok(homepageCanonical, 'homepage artifact must include a canonical URL')
const productionUrl = new URL(homepageCanonical).origin
assert.match(productionUrl, /^https?:\/\/[^/]+$/, 'canonical URL must use a valid HTTP(S) origin')
assert.equal(productionUrl, 'https://thaithanhpanel.shop', 'canonical URL must use the official production origin')
assert.ok(
  isFile(path.join(outputRoot, '404.html')),
  '404 artifact is missing; run `npm run generate` before `npm run test:e2e`',
)
const notFoundArtifact = fs.readFileSync(path.join(outputRoot, '404.html'), 'utf8')
assert.match(notFoundArtifact, /<meta name="robots" content="noindex, nofollow">/, '404 artifact must be noindex without JavaScript')
assert.match(notFoundArtifact, /<h1>Không tìm thấy trang<\/h1>/, '404 artifact must contain a readable static error message')
assert.doesNotMatch(notFoundArtifact, /<div id="__nuxt"><\/div>/, '404 artifact must not be an empty client-rendered shell')
assert.ok(isFile(path.join(outputRoot, '.htaccess')), 'Hostinger artifact must include .htaccess')
const hostingerConfig = fs.readFileSync(path.join(outputRoot, '.htaccess'), 'utf8')
assert.match(hostingerConfig, /RewriteCond %\{HTTPS\} !=on/, 'Hostinger config must force HTTPS')
assert.match(hostingerConfig, /\^www\\\.thaithanhpanel\\\.shop\$/, 'Hostinger config must canonicalize the www hostname')
assert.match(hostingerConfig, /ErrorDocument 404 \/404\.html/, 'Hostinger config must serve the branded 404 page')

const web = http.createServer((request, response) => {
  const method = request.method || 'GET'
  if (method !== 'GET' && method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    response.end()
    return
  }

  const pathname = new URL(request.url || '/', webUrl).pathname
  const requestedFile = resolveOutputFile(pathname)
  const filePath = requestedFile || path.join(outputRoot, '404.html')
  const status = requestedFile ? 200 : 404
  const contentType = contentTypes[path.extname(filePath)] || 'application/octet-stream'

  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': contentType,
  })
  if (method === 'HEAD') {
    response.end()
    return
  }
  fs.createReadStream(filePath).pipe(response)
})

const waitForUrl = async (url, timeoutMs = 60000) => {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const status = await new Promise((resolve, reject) => {
        const request = http.get(url, (response) => {
          response.resume()
          response.on('end', () => resolve(response.statusCode || 0))
        })
        request.on('error', reject)
        request.setTimeout(3000, () => request.destroy(new Error('timeout')))
      })
      if (status >= 200 && status < 500) return
    } catch {
      // Nuxt is still starting.
    }
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error(`Timed out waiting for ${url}`)
}

let browser
try {
  await new Promise((resolve, reject) => {
    const onError = (error) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(`E2E port ${webPort} is already in use; set E2E_WEB_PORT to another available port`))
        return
      }
      reject(error)
    }
    web.once('error', onError)
    web.listen(webPort, webHost, () => {
      web.off('error', onError)
      resolve()
    })
  })
  await waitForUrl(webUrl)
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  page.setDefaultTimeout(15000)
  page.setDefaultNavigationTimeout(30000)
  const runtimeRequests = []
  const forbiddenLinks = []
  const pageErrors = []
  const consoleErrors = []
  const failedRequests = []

  page.on('request', (request) => {
    const pathname = new URL(request.url()).pathname
    if (runtimeRequestPattern.test(pathname)) runtimeRequests.push(pathname)
  })
  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('requestfailed', (request) => {
    const errorText = request.failure()?.errorText || 'unknown error'
    if (/ERR_ABORTED|NS_BINDING_ABORTED/.test(errorText)) return
    failedRequests.push(`${request.method()} ${request.url()} (${errorText})`)
  })

  for (const route of canonicalRoutes) {
    const response = await page.goto(`${webUrl}${route}`, { waitUntil: 'networkidle' })
    assert.equal(response?.status(), 200, `${route} must render successfully`)
    await page.locator('h1').first().waitFor()

    const pageMetadata = await page.evaluate(() => ({
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      bodyText: document.body.innerText,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      htmlLang: document.documentElement.lang,
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '',
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(script => script.textContent || ''),
      images: [...document.querySelectorAll('img')].map(image => ({
        alt: image.getAttribute('alt') || '',
        height: image.getAttribute('height') || '',
        src: image.getAttribute('src') || '',
        width: image.getAttribute('width') || '',
      })),
      unsafeBlankLinks: [...document.querySelectorAll('a[target="_blank"]')]
        .filter(link => !((link.getAttribute('rel') || '').includes('noopener')))
        .map(link => link.getAttribute('href') || ''),
    }))
    assert.equal(pageMetadata.htmlLang, 'vi', `${route} must declare Vietnamese content`)
    assert.equal(pageMetadata.h1Count, 1, `${route} must contain exactly one h1`)
    assert.equal(await page.locator('.nuxt-route-announcer').count(), 1, `${route} must include a route announcer`)
    assert.ok(pageMetadata.description.trim(), `${route} must include a meta description`)
    assert.doesNotMatch(
      [pageMetadata.bodyText, pageMetadata.description, ...pageMetadata.jsonLd].join('\n'),
      unsupportedProductPattern,
      `${route} must not advertise unsupported panel products`,
    )
    assert.match(pageMetadata.title, / \| Thái Thanh Panel$/, `${route} must include the brand in its title`)
    assert.doesNotMatch(pageMetadata.title, /Thái Thanh Panel \| Thái Thanh Panel$/, `${route} must not repeat the brand in its title`)
    const expectedPageUrl = new URL(canonicalPath(route), `${productionUrl}/`).toString()
    assert.equal(pageMetadata.canonical, expectedPageUrl, `${route} canonical URL must be absolute and use the production trailing-slash format`)
    assert.equal(pageMetadata.ogUrl, expectedPageUrl, `${route} og:url must match the canonical URL`)
    const ogImage = new URL(pageMetadata.ogImage)
    assert.equal(ogImage.origin, productionUrl, `${route} social image must use the configured production origin`)
    assert.match(ogImage.pathname, /^\/images\/.+\.webp$/, `${route} must expose an optimized social image`)
    assert.ok(pageMetadata.jsonLd.length > 0, `${route} must include structured data`)
    pageMetadata.jsonLd.forEach(value => assert.doesNotThrow(() => JSON.parse(value), `${route} JSON-LD must be valid JSON`))
    pageMetadata.images.forEach((image) => {
      assert.ok(image.src.startsWith('/images/'), `${route} image must use a local optimized asset: ${image.src}`)
      assert.ok(image.alt.trim(), `${route} image must have meaningful alt text: ${image.src}`)
      assert.match(image.width, /^\d+$/, `${route} image must declare width: ${image.src}`)
      assert.match(image.height, /^\d+$/, `${route} image must declare height: ${image.src}`)
    })
    for (const image of pageMetadata.images) {
      const imageResponse = await page.request.get(`${webUrl}${image.src}`)
      assert.equal(imageResponse.status(), 200, `${route} image must exist: ${image.src}`)
    }
    assert.deepEqual(pageMetadata.unsafeBlankLinks, [], `${route} target=_blank links must use rel=noopener`)

    const routeForbiddenLinks = await page.locator('a').evaluateAll((links, patternSource) => {
      const pattern = new RegExp(patternSource)
      return links
        .map(link => link.getAttribute('href') || '')
        .filter(href => pattern.test(href))
    }, forbiddenNavigationPattern.source)
    forbiddenLinks.push(...routeForbiddenLinks.map(href => `${route} -> ${href}`))
  }

  await page.goto(webUrl, { waitUntil: 'networkidle' })
  const reducedMotionContract = await page.evaluate(() => {
    const revealElements = [...document.querySelectorAll('[data-reveal]')]
    return {
      matchesPreference: matchMedia('(prefers-reduced-motion: reduce)').matches,
      revealCount: revealElements.length,
      unrevealedCount: revealElements.filter(element => element.getAttribute('data-reveal-state') !== 'revealed').length,
      hiddenCount: revealElements.filter((element) => {
        const style = getComputedStyle(element)
        return style.opacity === '0' || style.visibility === 'hidden'
      }).length,
      longRunningAnimations: document.getAnimations().filter((animation) => {
        const duration = Number(animation.effect?.getTiming().duration || 0)
        return animation.playState === 'running' && duration > 50
      }).length,
    }
  })
  assert.equal(reducedMotionContract.matchesPreference, true, 'E2E must exercise the reduced-motion preference')
  assert.ok(reducedMotionContract.revealCount > 0, 'site must expose progressively enhanced reveal targets')
  assert.equal(reducedMotionContract.unrevealedCount, 0, 'reduced motion must bypass every reveal animation')
  assert.equal(reducedMotionContract.hiddenCount, 0, 'reduced motion must keep reveal content visible')
  assert.equal(reducedMotionContract.longRunningAnimations, 0, 'reduced motion must not leave long animations running')

  await page.goto(`${webUrl}/posts`, { waitUntil: 'networkidle' })
  const postHref = await page.locator('a[href^="/posts/"]').first().getAttribute('href')
  assert.match(postHref || '', /^\/posts\/[^/]+$/, 'posts page must link to a post detail route')
  const postResponse = await page.goto(`${webUrl}${postHref}`, { waitUntil: 'networkidle' })
  assert.equal(postResponse?.status(), 200, 'post detail must render successfully')
  await page.locator('article h1').first().waitFor()

  await page.goto(`${webUrl}/products`, { waitUntil: 'networkidle' })
  const retailProducts = page.locator('#retail-products')
  const retailProductText = await retailProducts.innerText()
  assert.match(retailProductText, /Panel EPS, cửa kho lạnh, phụ kiện và vật tư cách nhiệt/i, 'products page must expose the retail catalog')
  assert.match(retailProductText, /50–200 mm/, 'products page must expose the panel thickness range')
  assert.match(retailProductText, /14–16 kg\/m³.*18–20 kg\/m³.*23–25 kg\/m³/s, 'products page must expose the panel density ranges')
  assert.match(retailProductText, /Nẹp U.*V trong.*V ngoài/s, 'products page must expose the supplied U and V accessories')
  assert.ok(retailProductText.includes('600 × 600 × 100 mm'), 'products page must expose the first supplied door size')
  assert.ok(retailProductText.includes('1200 × 1800 mm'), 'products page must expose the last supplied door size')
  const productsSeoDescription = await page.locator('meta[name="description"]').getAttribute('content') || ''
  assert.match(productsSeoDescription, /bán lẻ/i, 'products SEO description must mention retail supply')
  assert.match(productsSeoDescription, /U\/V/i, 'products SEO description must mention U/V accessories')
  assert.match(productsSeoDescription, /Inox 304/i, 'products SEO description must mention Inox 304 doors')

  const productDetailLinks = page.locator('[data-product-detail-link]')
  assert.equal(await productDetailLinks.count(), 5, 'products page must expose five product detail links')
  const productDetailHrefs = await productDetailLinks.evaluateAll(links => links.map(link => link.getAttribute('href') || ''))
  assert.equal(new Set(productDetailHrefs).size, 5, 'product detail links must use five unique routes')
  assert.deepEqual(
    [...productDetailHrefs].sort(),
    [
      '/products/cua-kho-lanh',
      '/products/panel-eps',
      '/products/phu-kien-cua',
      '/products/phu-kien-kho-lanh',
      '/products/vat-tu-cach-nhiet',
    ],
    'products page must link to every confirmed retail product detail route',
  )

  const panelProductLink = page.locator('[data-product-detail-link][href="/products/panel-eps"]')
  assert.equal(await panelProductLink.count(), 1, 'products page must expose one Panel EPS detail link')
  await Promise.all([
    page.waitForURL(`${webUrl}/products/panel-eps`),
    panelProductLink.click(),
  ])
  const panelProductResponse = await page.request.get(`${webUrl}/products/panel-eps`)
  assert.equal(panelProductResponse.status(), 200, 'Panel EPS detail route must render successfully')
  const panelProductHeading = page.locator('article h1')
  await panelProductHeading.waitFor({ state: 'visible' }).catch(() => {})
  const panelBodyText = (await page.locator('body').innerText()).slice(0, 600).replace(/\s+/g, ' ')
  assert.equal(
    await panelProductHeading.count(),
    1,
    `Panel EPS detail must expose one product h1; url=${page.url()}; pageErrors=${pageErrors.join(' | ')}; consoleErrors=${consoleErrors.join(' | ')}; body=${panelBodyText}`,
  )
  assert.match(await panelProductHeading.innerText(), /Panel EPS/i, 'Panel EPS detail must expose its product name as the h1')
  const panelProductText = await page.locator('article').first().innerText()
  assert.match(panelProductText, /50–200 mm/, 'Panel EPS detail must expose the supplied thickness range')
  assert.match(panelProductText, /14–16 kg\/m³.*18–20 kg\/m³.*23–25 kg\/m³/s, 'Panel EPS detail must expose every supplied density range')
  assert.match(panelProductText, /Cấu tạo sandwich ba lớp.*Bảng quy cách cần đối chiếu.*Chọn độ dày và tỷ trọng.*Bề mặt và hoàn thiện/s, 'Panel EPS detail must explain construction, specifications and selection')
  assert.match(panelProductText, /Thi công và phụ kiện đồng bộ.*Vận chuyển và bảo quản.*Giới hạn sử dụng và bảo trì/s, 'Panel EPS detail must cover installation, handling and limitations')
  assert.match(panelProductText, /Panel EPS có phải panel chống cháy không\?/i, 'Panel EPS detail must answer the fire-safety limitation clearly')
  assert.ok(await page.locator('[data-product-selection-guide]').count() >= 4, 'Panel EPS detail must expose a quick selection guide')
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    `${productionUrl}/products/panel-eps/`,
    'Panel EPS canonical URL must use the production trailing-slash format',
  )

  const inoxDoorResponse = await page.goto(`${webUrl}/products/cua-kho-lanh`, { waitUntil: 'networkidle' })
  assert.equal(inoxDoorResponse?.status(), 200, 'cold-room door detail route must render successfully')
  assert.match(await page.locator('article h1').innerText(), /Cửa kho lạnh Inox 304/i, 'cold-room door detail must expose its product name as the h1')
  const inoxDoorText = await page.locator('article').first().innerText()
  assert.match(inoxDoorText, /Inox 304/i, 'cold-room door detail must expose its confirmed surface material')
  assert.match(inoxDoorText, /Cửa kho lạnh bản lề.*Cửa lùa, cửa trượt kho lạnh.*Cửa song gài Inox.*Cửa song gài EPS/s, 'cold-room door detail must explain all four door configurations')
  assert.match(inoxDoorText, /lõi PU.*ray.*bánh xe.*gioăng.*điện trở sưởi.*mở an toàn/is, 'cold-room door detail must cover the main construction, hardware and safety topics')
  assert.ok(inoxDoorText.includes('600 × 600 × 100 mm'), 'cold-room door detail must expose the first supplied size')
  assert.ok(inoxDoorText.includes('1200 × 1800 mm'), 'cold-room door detail must expose the last supplied size')
  assert.equal(await page.locator('#cua-ban-le').count(), 1, 'cold-room door detail must expose one hinged-door section')
  assert.equal(await page.locator('#cua-truot').count(), 1, 'cold-room door detail must expose one sliding-door section')
  assert.equal(await page.locator('#song-gai-inox').count(), 1, 'cold-room door detail must expose one Inox double-latch section')
  assert.equal(await page.locator('#song-gai-eps').count(), 1, 'cold-room door detail must expose one EPS double-latch section')
  assert.equal(await page.locator('#kich-thuoc-va-cach-do-o-cho').count(), 1, 'cold-room door detail must explain measurements and opening sizes')
  assert.equal(await page.locator('#hoi-dap details').count(), 6, 'cold-room door detail must expose six practical FAQ entries')
  const doorNavigationHrefs = await page.locator('nav[aria-label="Đi nhanh trong trang sản phẩm"] a').evaluateAll(links => links.map(link => link.getAttribute('href')))
  for (const anchor of ['#chon-nhanh', '#cau-tao-bo-cua', '#kich-thuoc-va-cach-do-o-cho', '#cua-ban-le', '#cua-truot', '#song-gai-inox', '#song-gai-eps', '#lam-kin-suoi-va-an-toan', '#chuan-bi', '#hoi-dap']) {
    assert.ok(doorNavigationHrefs.includes(anchor), `cold-room door in-page navigation must include ${anchor}`)
  }
  assert.doesNotMatch(inoxDoorText, /1471421817120_1148|tamcachnhiettabi|Tabi|Coolmax|Atimon|-70.*60\s*°C/i, 'cold-room door content must not copy competitor identifiers or unsupported claims')

  const coldRoomAccessoryResponse = await page.goto(`${webUrl}/products/phu-kien-kho-lanh`, { waitUntil: 'networkidle' })
  assert.equal(coldRoomAccessoryResponse?.status(), 200, 'cold-room accessory catalog must render successfully')
  const coldRoomAccessoryText = await page.locator('article').first().innerText()
  assert.match(coldRoomAccessoryText, /Nẹp U.*V trong.*V ngoài/s, 'cold-room accessory catalog must retain the confirmed U/V profiles')
  assert.match(coldRoomAccessoryText, /Thanh T.*bulong dù.*Van cân bằng áp.*Ống cách nhiệt/s, 'cold-room accessory catalog must explain the referenced technical groups')
  assert.match(coldRoomAccessoryText, /khả năng cung cấp/i, 'cold-room accessory catalog must distinguish items that still need availability confirmation')

  const doorAccessoryResponse = await page.goto(`${webUrl}/products/phu-kien-cua`, { waitUntil: 'networkidle' })
  assert.equal(doorAccessoryResponse?.status(), 200, 'door accessory catalog must render successfully')
  assert.match(await page.locator('article').first().innerText(), /Bản lề.*Ray, bánh xe.*Gioăng.*Điện trở sưởi.*Tay khóa.*Màn PVC/s, 'door accessory catalog must explain the main functional groups')

  const insulationMaterialResponse = await page.goto(`${webUrl}/products/vat-tu-cach-nhiet`, { waitUntil: 'networkidle' })
  assert.equal(insulationMaterialResponse?.status(), 200, 'insulation material catalog must render successfully')
  assert.match(await page.locator('article').first().innerText(), /Inox 304.*Xốp EPS.*PU foam.*Tôn mạ màu/s, 'material catalog must explain every referenced material group')

  for (const href of productDetailHrefs) {
    const response = await page.goto(`${webUrl}${href}`, { waitUntil: 'networkidle' })
    assert.equal(response?.status(), 200, `${href} product detail route must render successfully`)
    assert.equal(await page.locator('article h1').count(), 1, `${href} must expose exactly one product h1`)
    assert.ok(await page.locator('[data-product-specification]').count() >= 4, `${href} must expose at least four top specifications`)
    assert.ok(await page.locator('[data-product-selection-guide]').count() >= 3, `${href} must expose at least three quick-selection items`)
    assert.ok(await page.locator('[data-product-detail-section]').count() >= 4, `${href} must expose at least four detailed sections`)
    assert.ok(await page.locator('[data-product-checklist-item]').count() >= 8, `${href} must expose at least eight preparation items`)
    assert.ok(await page.locator('[data-product-faq]').count() >= 4, `${href} must expose at least four FAQ entries`)

    const inPageAnchors = await page.locator('nav[aria-label="Đi nhanh trong trang sản phẩm"] a').evaluateAll(links => links.map(link => link.getAttribute('href') || ''))
    for (const anchor of inPageAnchors) {
      assert.match(anchor, /^#[a-z0-9-]+$/, `${href} in-page navigation must use a local id anchor`)
      assert.equal(await page.locator(anchor).count(), 1, `${href} in-page anchor ${anchor} must target exactly one section`)
    }
  }

  await page.goto(`${webUrl}/contact`, { waitUntil: 'networkidle' })
  const quickContactForm = page.locator('#quick-contact-form')
  assert.equal(await quickContactForm.count(), 1, 'contact page must expose one quick contact form')
  const formContract = await quickContactForm.evaluate(form => ({
    configured: form.getAttribute('data-configured'),
    noValidate: form.noValidate,
    fields: [...form.querySelectorAll('input:not([type="hidden"]), textarea')].map(field => ({
      autocomplete: field.getAttribute('autocomplete'),
      id: field.id,
      maxLength: field.getAttribute('maxlength'),
      minLength: field.getAttribute('minlength'),
      name: field.getAttribute('name'),
      pattern: field.getAttribute('pattern'),
      required: field.hasAttribute('required'),
      type: field.getAttribute('type') || field.tagName.toLowerCase(),
    })),
    privacyLink: form.querySelector('a[href="/privacy"]')?.getAttribute('href') || '',
    submitText: form.querySelector('button[type="submit"]')?.textContent?.trim() || '',
  }))
  assert.ok(formContract.fields.some(field => field.id === 'quick-contact-name' && field.name === 'name' && field.required && field.minLength === '2'), 'quick contact form must require a name with native constraints')
  assert.ok(formContract.fields.some(field => field.id === 'quick-contact-phone' && field.name === 'phone' && field.type === 'tel' && field.required && field.pattern), 'quick contact form must require a phone number with native constraints')
  assert.ok(formContract.fields.some(field => field.id === 'quick-contact-email' && field.name === 'email' && field.type === 'email' && !field.required && field.autocomplete === 'email'), 'quick contact form must offer a non-required email field')
  assert.ok(formContract.fields.some(field => field.id === 'quick-contact-message' && field.name === 'message' && field.required && field.minLength === '10'), 'quick contact form must require a message with native constraints')
  assert.ok(formContract.fields.some(field => field.id === 'quick-contact-consent' && field.name === 'consent' && field.required), 'quick contact form must require privacy consent')
  assert.equal(formContract.noValidate, true, 'hydrated form must use the accessible client-side validation enhancement')
  assert.equal(formContract.privacyLink, '/privacy', 'quick contact form must link to the privacy policy')
  assert.equal(await page.locator('footer a[href="/privacy"]').count(), 1, 'footer must link to the privacy policy')
  assert.equal(formContract.submitText, 'Gửi yêu cầu nhanh', 'quick contact form must expose a clear submit action')
  assert.match(formContract.configured || '', /^(?:true|false)$/, 'quick contact form must declare whether email delivery is configured')

  await quickContactForm.locator('button[type="submit"]').click()
  assert.equal(await page.locator(':focus').getAttribute('id'), 'quick-contact-name', 'invalid quick contact form must focus the first invalid field')
  assert.match(await quickContactForm.locator('[role="alert"]').innerText(), /kiểm tra lại các trường/i, 'invalid quick contact form must expose accessible feedback')

  await quickContactForm.locator('#quick-contact-name').fill('Khách hàng kiểm thử')
  await quickContactForm.locator('#quick-contact-phone').fill('0363003507')
  await quickContactForm.locator('#quick-contact-message').fill('Cần tư vấn panel cho công trình mới.')
  await quickContactForm.locator('button[type="submit"]').click()
  assert.equal(await quickContactForm.locator('#quick-contact-email-error').count(), 0, 'a blank optional email must not cause a validation error')
  assert.equal(await page.locator(':focus').getAttribute('id'), 'quick-contact-consent', 'a blank optional email must allow validation to continue to consent')

  await quickContactForm.locator('#quick-contact-email').fill('khach-hang@gmail')
  await quickContactForm.locator('button[type="submit"]').click()
  assert.equal(await page.locator(':focus').getAttribute('id'), 'quick-contact-email', 'an invalid optional email must receive focus')
  assert.match(await quickContactForm.locator('#quick-contact-email-error').innerText(), /email hợp lệ hoặc để trống/i, 'an invalid optional email must expose clear feedback')
  assert.match(await quickContactForm.locator('#quick-contact-email').getAttribute('aria-describedby') || '', /quick-contact-email-error/, 'the email input must reference its validation feedback')

  const robotsResponse = await page.request.get(`${webUrl}/robots.txt`)
  assert.equal(robotsResponse.status(), 200, 'robots.txt must exist')
  assert.ok((await robotsResponse.text()).includes(`Sitemap: ${productionUrl}/sitemap.xml`), 'robots.txt must reference the configured production sitemap')

  const sitemapResponse = await page.request.get(`${webUrl}/sitemap.xml`)
  assert.equal(sitemapResponse.status(), 200, 'sitemap.xml must exist')
  const sitemap = await sitemapResponse.text()
  const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  assert.ok(sitemapLocations.includes(`${productionUrl}/`), 'sitemap must include the configured production homepage')
  assert.ok(sitemapLocations.includes(`${productionUrl}/posts/`), 'sitemap must include the posts index')
  assert.ok(sitemapLocations.some(location => location.startsWith(`${productionUrl}/posts/`) && location !== `${productionUrl}/posts/`), 'sitemap must include published posts')
  assert.ok(sitemapLocations.includes(`${productionUrl}/privacy/`), 'sitemap must include the privacy policy')
  for (const href of productDetailHrefs) {
    assert.ok(
      sitemapLocations.includes(`${productionUrl}${canonicalPath(href)}`),
      `sitemap must include the ${href} product detail route`,
    )
  }
  assert.equal(
    sitemapLocations.filter(location => location.startsWith(`${productionUrl}/products/`) && location !== `${productionUrl}/products/`).length,
    5,
    'sitemap must expose exactly five product detail URLs',
  )
  assert.ok(
    sitemapLocations.every(location => location === `${productionUrl}/` || location.endsWith('/')),
    'every non-homepage sitemap URL must use a trailing slash',
  )

  assert.equal(await page.locator('link[rel="manifest"]').getAttribute('href'), '/site.webmanifest', 'public pages must reference the web app manifest')
  const manifestResponse = await page.request.get(`${webUrl}/site.webmanifest`)
  assert.equal(manifestResponse.status(), 200, 'site.webmanifest must exist')
  assert.match(manifestResponse.headers()['content-type'] || '', /^application\/manifest\+json\b/, 'site.webmanifest must use the manifest content type')
  const manifest = await manifestResponse.json()
  assert.equal(manifest.id, `${productionUrl}/`, 'manifest ID must use the configured production origin')
  assert.equal(manifest.start_url, '/', 'manifest must start at the website homepage')

  assert.deepEqual(pageErrors, [], 'public static pages must not throw browser errors')
  assert.deepEqual(consoleErrors, [], 'public static pages must not log console errors')
  assert.deepEqual(failedRequests, [], 'public static pages must not make failed requests')

  await page.goto(`${webUrl}/products/panel-eps`, { waitUntil: 'networkidle' })
  const spaRouterAvailable = await page.evaluate(() => Boolean(
    document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$router,
  ))
  assert.equal(spaRouterAvailable, true, 'the hydrated app must expose Vue Router for the SPA navigation regression check')
  await page.evaluate(async () => {
    const router = document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$router
    await router.push('/products/not-a-product').catch(() => {})
  })
  await page.waitForFunction(() => /Không tìm thấy trang/i.test(document.querySelector('h1')?.textContent || ''))
  assert.match(await page.locator('h1').innerText(), /Không tìm thấy trang/, 'SPA navigation to an unknown product must use the branded 404 page')
  pageErrors.length = 0
  consoleErrors.length = 0
  failedRequests.length = 0

  const missingProductResponse = await page.goto(`${webUrl}/products/not-a-product`, { waitUntil: 'networkidle' })
  assert.equal(missingProductResponse?.status(), 404, 'an unknown product must return HTTP 404')
  assert.match(await page.locator('h1').innerText(), /Không tìm thấy trang/, 'unknown product routes must use the branded 404 page')

  const missingPostResponse = await page.goto(`${webUrl}/posts/khong-ton-tai`, { waitUntil: 'networkidle' })
  assert.equal(missingPostResponse?.status(), 404, 'an unknown post must return HTTP 404')
  assert.match(await page.locator('h1').innerText(), /Không tìm thấy trang/, 'unknown routes must use the branded 404 page')
  pageErrors.length = 0
  consoleErrors.length = 0
  failedRequests.length = 0

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(webUrl, { waitUntil: 'networkidle' })
  const desktopHeaderAlignment = await page.evaluate(() => {
    const container = document.querySelector('header > .container-site')
    const navigation = container?.querySelector(':scope > nav')
    const containerBox = container?.getBoundingClientRect()
    const navigationBox = navigation?.getBoundingClientRect()

    if (!containerBox || !navigationBox || navigationBox.width === 0) return null

    return Math.abs(
      (containerBox.left + containerBox.width / 2)
      - (navigationBox.left + navigationBox.width / 2),
    )
  })
  assert.notEqual(desktopHeaderAlignment, null, 'desktop header navigation must be visible')
  assert.ok(desktopHeaderAlignment <= 2, `desktop header navigation must stay centered; delta was ${desktopHeaderAlignment}px`)

  const siteHeader = page.locator('header[data-header-mode]')
  assert.equal(await siteHeader.getAttribute('data-header-mode'), 'hero', 'homepage header must blend into the hero at the top')
  assert.equal(await siteHeader.evaluate(element => getComputedStyle(element).position), 'fixed', 'homepage header must overlay the hero')
  assert.ok(await page.locator('.home-hero').evaluate(element => Math.abs(element.getBoundingClientRect().top) <= 1), 'homepage hero must begin behind the overlay header')
  const activeHeroNavigation = page.locator('[data-desktop-navigation] a[aria-current="page"]')
  assert.equal(await activeHeroNavigation.count(), 1, 'homepage navigation must expose exactly one current page')
  assert.equal(await activeHeroNavigation.getAttribute('href'), '/', 'homepage navigation must visibly identify Trang chủ')
  const liquidNavigationIndicator = page.locator('[data-nav-liquid-indicator]')
  const liquidNavigationSurface = page.locator('[data-nav-liquid-surface]')
  assert.equal(await liquidNavigationIndicator.count(), 1, 'desktop navigation must use one shared liquid indicator')
  assert.equal(await liquidNavigationSurface.count(), 1, 'liquid indicator must expose one deformable surface')
  assert.equal(await liquidNavigationIndicator.getAttribute('aria-hidden'), 'true', 'liquid indicator must remain decorative')
  await page.waitForFunction(() => document.querySelector('[data-nav-liquid-indicator]')?.getAttribute('data-liquid-target') === '/')
  const heroLiquidNavigation = await page.evaluate(() => {
    const current = document.querySelector('[data-desktop-navigation] a[aria-current="page"]')
    const indicator = document.querySelector('[data-nav-liquid-indicator]')
    const surface = document.querySelector('[data-nav-liquid-surface]')
    const currentBox = current?.getBoundingClientRect()
    const indicatorBox = indicator?.getBoundingClientRect()
    const indicatorStyle = indicator ? getComputedStyle(indicator) : null
    const surfaceStyle = surface ? getComputedStyle(surface) : null

    if (!currentBox || !indicatorBox || !indicatorStyle || !surfaceStyle) return null

    return {
      backdropFilter: surfaceStyle.backdropFilter,
      centerDelta: Math.abs((currentBox.left + currentBox.width / 2) - (indicatorBox.left + indicatorBox.width / 2)),
      decoratedLinkCount: [...document.querySelectorAll('[data-desktop-nav-link]')]
        .filter(link => getComputedStyle(link).textDecorationLine !== 'none').length,
      fillAlpha: Number.parseFloat(surfaceStyle.backgroundColor.match(/[\d.]+/g)?.[3] ?? '1'),
      opacity: Number.parseFloat(indicatorStyle.opacity),
      pointerEvents: indicatorStyle.pointerEvents,
      surfaceAnimationName: surfaceStyle.animationName,
      transitionDuration: indicatorStyle.transitionDuration,
      widthDelta: Math.abs(currentBox.width - indicatorBox.width),
    }
  })
  assert.notEqual(heroLiquidNavigation, null, 'liquid navigation indicator must render over the hero')
  assert.ok(heroLiquidNavigation.opacity > 0.9, 'liquid navigation indicator must be visible')
  assert.ok(heroLiquidNavigation.centerDelta <= 1, 'liquid navigation indicator must align with the current page')
  assert.ok(heroLiquidNavigation.widthDelta <= 1, 'liquid navigation indicator must match the current page width')
  assert.equal(heroLiquidNavigation.fillAlpha, 0, 'hero liquid indicator must have a fully transparent center')
  assert.equal(heroLiquidNavigation.backdropFilter, 'none', 'hero liquid indicator must not create a milky blur')
  assert.equal(heroLiquidNavigation.decoratedLinkCount, 0, 'desktop navigation links must not render underlines')
  assert.equal(heroLiquidNavigation.pointerEvents, 'none', 'liquid navigation indicator must not block link interaction')
  assert.ok(
    heroLiquidNavigation.transitionDuration.split(',').every(value => Number.parseFloat(value) === 0),
    'reduced motion must disable the liquid navigation transition',
  )
  assert.equal(heroLiquidNavigation.surfaceAnimationName, 'none', 'reduced motion must disable droplet deformation')
  assert.equal(await page.locator('.desktop-nav-indicator').count(), 0, 'desktop navigation must not render underline markers')

  const reducedMotionProductsNavigation = page.locator('[data-desktop-nav-link][href="/products"]')
  await reducedMotionProductsNavigation.hover()
  await page.waitForFunction(() => {
    const indicator = document.querySelector('[data-nav-liquid-indicator]')
    return indicator?.getAttribute('data-liquid-target') === '/products'
      && indicator.getAttribute('data-liquid-moving') === 'true'
  })
  assert.equal(await liquidNavigationSurface.evaluate(element => getComputedStyle(element).animationName), 'none', 'reduced motion must keep the droplet surface still')
  await page.mouse.move(8, 180)
  await page.waitForFunction(() => document.querySelector('[data-nav-liquid-indicator]')?.getAttribute('data-liquid-target') === '/')

  await page.evaluate(() => window.scrollTo(0, 160))
  await page.waitForFunction(() => document.querySelector('header[data-header-mode]')?.getAttribute('data-header-mode') === 'light')
  assert.equal(await siteHeader.getAttribute('data-header-mode'), 'light', 'homepage header must become readable after scrolling')
  assert.equal(await activeHeroNavigation.getAttribute('href'), '/', 'current page must remain selected after the header changes appearance')

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForFunction(() => document.querySelector('header[data-header-mode]')?.getAttribute('data-header-mode') === 'hero')

  await page.goto(`${webUrl}/products`, { waitUntil: 'networkidle' })
  assert.equal(await siteHeader.getAttribute('data-header-mode'), 'light', 'inner-page header must always use the light appearance')
  assert.equal(await siteHeader.evaluate(element => getComputedStyle(element).position), 'sticky', 'inner-page header must remain in the page flow')
  const activeDesktopNavigation = page.locator('[data-desktop-navigation] a[aria-current="page"]')
  assert.equal(await activeDesktopNavigation.count(), 1, 'desktop navigation must expose exactly one current page')
  assert.equal(await activeDesktopNavigation.getAttribute('href'), '/products', 'desktop navigation must highlight the current route')
  assert.equal(await activeDesktopNavigation.getAttribute('data-nav-active'), 'true', 'desktop current page must expose its visual state')
  await page.waitForFunction(() => document.querySelector('[data-nav-liquid-indicator]')?.getAttribute('data-liquid-target') === '/products')
  const productLiquidAlignment = await page.evaluate(() => {
    const current = document.querySelector('[data-desktop-navigation] a[aria-current="page"]')?.getBoundingClientRect()
    const indicator = document.querySelector('[data-nav-liquid-indicator]')?.getBoundingClientRect()
    if (!current || !indicator) return null
    return Math.abs((current.left + current.width / 2) - (indicator.left + indicator.width / 2))
  })
  assert.notEqual(productLiquidAlignment, null, 'liquid navigation indicator must render on inner pages')
  assert.ok(productLiquidAlignment <= 1, 'liquid navigation indicator must follow the current inner page')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(webUrl, { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  assert.equal(await page.locator(':focus').getAttribute('href'), '#main-content', 'the skip link must be the first keyboard target')
  await page.keyboard.press('Enter')
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main-content', 'the skip link must focus the main content')
  const mobileMenuButton = page.locator('button[aria-controls="static-mobile-navigation"]')
  await mobileMenuButton.click()
  assert.equal(await mobileMenuButton.getAttribute('aria-expanded'), 'true', 'mobile menu button must expose its open state')
  assert.equal(await siteHeader.getAttribute('data-header-mode'), 'light', 'opening the mobile menu over the hero must switch the header to light mode')
  const mobileNavigation = page.locator('#static-mobile-navigation')
  await mobileNavigation.waitFor({ state: 'visible' })
  await mobileNavigation.locator('a[href="/products"]').waitFor({ state: 'visible' })
  const activeHomeMobileNavigation = mobileNavigation.locator('a[aria-current="page"]')
  assert.equal(await activeHomeMobileNavigation.getAttribute('href'), '/', 'mobile homepage navigation must identify Trang chủ')
  assert.match(await activeHomeMobileNavigation.innerText(), /Đang xem/i, 'mobile homepage navigation must include an explicit state label')
  await page.keyboard.press('Escape')
  await mobileNavigation.waitFor({ state: 'hidden' })
  assert.equal(await mobileMenuButton.getAttribute('aria-expanded'), 'false', 'mobile menu button must expose its closed state')
  assert.equal(await siteHeader.getAttribute('data-header-mode'), 'hero', 'closing the mobile menu at the top must restore the hero header')
  assert.equal(
    await page.locator(':focus').getAttribute('aria-controls'),
    'static-mobile-navigation',
    'Escape must close the mobile menu and return focus to its button',
  )

  await page.goto(`${webUrl}/products`, { waitUntil: 'networkidle' })
  await mobileMenuButton.click()
  await mobileNavigation.waitFor({ state: 'visible' })
  const activeMobileNavigation = mobileNavigation.locator('a[aria-current="page"]')
  await activeMobileNavigation.waitFor({ state: 'visible' })
  assert.equal(await activeMobileNavigation.getAttribute('href'), '/products', 'mobile navigation must highlight the current route')
  assert.match(await activeMobileNavigation.innerText(), /Đang xem/i, 'mobile current page must include an explicit state label')

  const metrics = await page.evaluate(() => ({
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    mainWidth: document.querySelector('main')?.getBoundingClientRect().width || 0,
  }))
  assert.ok(metrics.scrollWidth <= metrics.viewport, 'mobile static site must not overflow horizontally')
  assert.ok(metrics.mainWidth >= metrics.viewport - 10, 'mobile content must use the available width')

  for (const viewport of [
    { width: 320, height: 800, label: 'minimum mobile' },
    { width: 768, height: 1024, label: 'tablet' },
  ]) {
    for (const route of ['/', '/products', '/products/panel-eps', '/products/cua-kho-lanh']) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto(`${webUrl}${route === '/' ? '' : route}`, { waitUntil: 'networkidle' })
      const responsiveMetrics = await page.evaluate(() => ({
        viewport: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        mainWidth: document.querySelector('main')?.getBoundingClientRect().width || 0,
      }))
      assert.ok(responsiveMetrics.scrollWidth <= responsiveMetrics.viewport, `${viewport.label} ${route} layout must not overflow horizontally`)
      assert.ok(responsiveMetrics.mainWidth >= responsiveMetrics.viewport - 10, `${viewport.label} ${route} content must use the available width`)
    }
  }

  assert.deepEqual(forbiddenLinks, [], 'public pages must not link to commerce, customer Auth or Admin routes')
  assert.deepEqual(runtimeRequests, [], 'public pages must not request internal APIs or runtime content endpoints during page load')
  assert.deepEqual(pageErrors, [], 'public static pages must not throw browser errors')
  assert.deepEqual(consoleErrors, [], 'public static pages must not log console errors')
  assert.deepEqual(failedRequests, [], 'public static pages must not make failed requests')

  const adminResponse = await page.goto(`${webUrl}/admin`, { waitUntil: 'domcontentloaded' })
  assert.equal(adminResponse?.status(), 404, '/admin must not exist in the advertising-only site')

  const faviconResponse = await page.request.get(`${webUrl}/favicon.png`)
  assert.equal(faviconResponse.status(), 200, 'brand favicon must be included in the static artifact')

  const logoResponse = await page.request.get(`${webUrl}/images/brand/thai-thanh-logo-transparent.png`)
  assert.equal(logoResponse.status(), 200, 'official company logo must be included in the static artifact')
  const logoAlpha = await page.evaluate(async () => {
    const image = new Image()
    image.src = '/images/brand/thai-thanh-logo-transparent.png'
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    return {
      corner: context.getImageData(0, 0, 1, 1).data[3],
      center: context.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data[3],
    }
  })
  assert.equal(logoAlpha.corner, 0, 'official company logo must have a transparent outer background')
  assert.equal(logoAlpha.center, 255, 'official company logo must preserve its opaque internal artwork')

  for (const route of removedRoutes) {
    const response = await page.request.get(`${webUrl}${route}`)
    assert.equal(response.status(), 404, `${route} must not exist in the static site`)
  }

  const motionContext = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  })
  const motionPage = await motionContext.newPage()
  const motionErrors = []
  motionPage.on('pageerror', error => motionErrors.push(error.message))
  await motionPage.goto(webUrl, { waitUntil: 'networkidle' })
  const motionLiquidIndicator = motionPage.locator('[data-nav-liquid-indicator]')
  await motionPage.waitForFunction(() => {
    const indicator = document.querySelector('[data-nav-liquid-indicator]')
    return indicator?.getAttribute('data-liquid-target') === '/'
      && indicator.getAttribute('data-liquid-ready') === 'true'
  })
  const liquidTransition = await motionLiquidIndicator.evaluate(element => ({
    duration: getComputedStyle(element).transitionDuration,
    property: getComputedStyle(element).transitionProperty,
    transform: getComputedStyle(element).transform,
  }))
  assert.match(liquidTransition.property, /transform/, 'liquid navigation indicator must animate its position')
  assert.ok(
    liquidTransition.duration.split(',').some(value => Number.parseFloat(value) > 0),
    'liquid navigation indicator must use a non-zero motion duration',
  )
  const motionProductsNavigation = motionPage.locator('[data-desktop-nav-link][href="/products"]')
  await motionProductsNavigation.hover()
  await motionPage.waitForFunction(() => {
    const indicator = document.querySelector('[data-nav-liquid-indicator]')
    return indicator?.getAttribute('data-liquid-target') === '/products'
      && indicator.getAttribute('data-liquid-moving') === 'true'
  })
  const dropletSurfaceMotion = await motionPage.locator('[data-nav-liquid-surface]').evaluate(element => ({
    animationDuration: getComputedStyle(element).animationDuration,
    animationName: getComputedStyle(element).animationName,
    backgroundColor: getComputedStyle(element).backgroundColor,
    transformOrigin: getComputedStyle(element).transformOrigin,
  }))
  assert.match(dropletSurfaceMotion.animationName, /liquid-drop-right/, 'droplet surface must stretch toward the hovered item')
  assert.ok(Number.parseFloat(dropletSurfaceMotion.animationDuration) > 0, 'droplet deformation must have a visible duration')
  assert.match(dropletSurfaceMotion.backgroundColor, /rgba\([^)]*, 0\)/, 'droplet surface must remain transparent while moving')
  await motionPage.waitForFunction(() => {
    const target = document.querySelector('[data-desktop-nav-link][href="/products"]')?.getBoundingClientRect()
    const indicator = document.querySelector('[data-nav-liquid-indicator]')?.getBoundingClientRect()
    return document.querySelector('[data-nav-liquid-indicator]')?.getAttribute('data-liquid-target') === '/products'
      && target
      && indicator
      && Math.abs((target.left + target.width / 2) - (indicator.left + indicator.width / 2)) <= 2
  })
  assert.notEqual(
    await motionLiquidIndicator.evaluate(element => getComputedStyle(element).transform),
    liquidTransition.transform,
    'liquid navigation indicator must glide to the hovered item',
  )
  await motionPage.mouse.move(8, 180)
  await motionPage.waitForFunction(() => document.querySelector('[data-nav-liquid-indicator]')?.getAttribute('data-liquid-target') === '/')
  const motionTarget = motionPage.locator('a[href="/products#eps"][data-reveal]')
  await motionTarget.waitFor({ state: 'attached' })
  assert.equal(await motionTarget.getAttribute('data-reveal-state'), 'waiting', 'below-fold content must wait for its reveal trigger')
  const sizeBeforeReveal = await motionTarget.evaluate(element => ({
    height: element.offsetHeight,
    width: element.offsetWidth,
  }))
  await motionTarget.scrollIntoViewIfNeeded()
  await motionPage.waitForFunction(
    element => element?.getAttribute('data-reveal-state') === 'revealed',
    await motionTarget.elementHandle(),
  )
  const sizeAfterReveal = await motionTarget.evaluate(element => ({
    height: element.offsetHeight,
    width: element.offsetWidth,
  }))
  assert.deepEqual(sizeAfterReveal, sizeBeforeReveal, 'reveal motion must not change layout dimensions')
  assert.deepEqual(motionErrors, [], 'motion-enabled pages must not throw browser errors')
  await motionContext.close()

  const noScriptContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
    locale: 'vi-VN',
  })
  const noScriptPage = await noScriptContext.newPage()
  const noScriptResponse = await noScriptPage.goto(`${webUrl}/products`, { waitUntil: 'load' })
  assert.equal(noScriptResponse?.status(), 200, 'products page must render without JavaScript')
  await noScriptPage.locator('h1').waitFor({ state: 'visible' })
  await noScriptPage.locator('#retail-products').waitFor({ state: 'visible' })
  assert.match(await noScriptPage.locator('#retail-products').innerText(), /Panel EPS, cửa kho lạnh, phụ kiện và vật tư cách nhiệt/i, 'retail content must remain readable without JavaScript')

  const noScriptDoorResponse = await noScriptPage.goto(`${webUrl}/products/cua-kho-lanh`, { waitUntil: 'load' })
  assert.equal(noScriptDoorResponse?.status(), 200, 'cold-room door detail must render without JavaScript')
  const noScriptDoorText = await noScriptPage.locator('article').first().innerText()
  assert.match(noScriptDoorText, /Cửa kho lạnh bản lề.*Cửa lùa, cửa trượt kho lạnh.*Cửa song gài Inox.*Cửa song gài EPS/s, 'all cold-room door configurations must remain readable without JavaScript')
  assert.match(noScriptDoorText, /Nên chọn cửa bản lề hay cửa trượt\?/i, 'cold-room door FAQ must remain readable without JavaScript')

  const noScriptPanelResponse = await noScriptPage.goto(`${webUrl}/products/panel-eps`, { waitUntil: 'load' })
  assert.equal(noScriptPanelResponse?.status(), 200, 'Panel EPS detail must render without JavaScript')
  const noScriptPanelText = await noScriptPage.locator('article').first().innerText()
  assert.match(noScriptPanelText, /Cấu tạo sandwich ba lớp.*Chọn độ dày và tỷ trọng.*Thi công và phụ kiện đồng bộ/s, 'Panel EPS technical guidance must remain readable without JavaScript')
  assert.match(noScriptPanelText, /Panel EPS có phải panel chống cháy không\?/i, 'Panel EPS safety FAQ must remain readable without JavaScript')

  const noScriptContactResponse = await noScriptPage.goto(`${webUrl}/contact`, { waitUntil: 'load' })
  assert.equal(noScriptContactResponse?.status(), 200, 'contact page must render without JavaScript')
  const noScriptForm = noScriptPage.locator('#quick-contact-form')
  assert.equal(await noScriptForm.getAttribute('novalidate'), null, 'server-rendered form must keep native HTML validation enabled')
  assert.equal(await noScriptForm.locator('#quick-contact-email').getAttribute('required'), null, 'email must remain optional without JavaScript')
  assert.notEqual(await noScriptForm.locator('#quick-contact-consent').getAttribute('required'), null, 'consent must remain required without JavaScript')
  await noScriptForm.locator('button[type="submit"]').click()
  assert.equal(await noScriptPage.locator(':focus').getAttribute('id'), 'quick-contact-name', 'native validation must block an empty no-JavaScript form at the name field')
  await noScriptForm.locator('#quick-contact-name').fill('Khách hàng kiểm thử')
  await noScriptForm.locator('#quick-contact-phone').fill('0363003507')
  await noScriptForm.locator('#quick-contact-message').fill('Cần tư vấn panel cho công trình mới.')
  await noScriptForm.locator('button[type="submit"]').click()
  assert.equal(await noScriptPage.locator(':focus').getAttribute('id'), 'quick-contact-consent', 'native validation must not bypass consent when JavaScript is disabled')
  assert.equal(noScriptPage.url(), `${webUrl}/contact`, 'invalid no-JavaScript form must not leave the contact page')
  await noScriptContext.close()

  const browserSource = executablePath ? `custom executable ${executablePath}` : `Playwright Chromium ${browser.version()}`
  console.log(`E2E PASS on ${browserSource}, ${webUrl}: public routes, privacy policy, motion preferences, no-JS content and form validation, SEO, 404, keyboard navigation and 320/390/768px layouts`)
} finally {
  if (browser) await browser.close()
  await new Promise(resolve => web.close(resolve))
}
