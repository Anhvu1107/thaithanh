<script setup lang="ts">
import { retailProducts as staticRetailProducts } from '~/data/staticSite'

definePageMeta({
  validate: route => staticRetailProducts.some(item => item.slug === String(route.params.slug))
    || {
      statusCode: 404,
      statusMessage: 'Không tìm thấy sản phẩm',
    },
})

const route = useRoute()
const { content } = useSiteContent()

const product = computed(() => content.value.retailProducts.find(item => item.slug === route.params.slug))
const productIndex = computed(() => content.value.retailProducts.findIndex(item => item.slug === route.params.slug))
const family = computed(() => content.value.productFamilies.find(item => item.id === product.value?.familyId))
const visualSections = computed(() => product.value?.detailSections.filter(section => section.media) ?? [])
const relatedProducts = computed(() => content.value.retailProducts
  .filter(item => item.slug !== product.value?.slug)
  .sort((left, right) => Number(right.familyId === product.value?.familyId) - Number(left.familyId === product.value?.familyId))
  .slice(0, 3))
const relatedGuideSlugs: Record<string, string[]> = {
  'panel-eps': [
    'tam-panel-cach-nhiet-eps-la-gi',
    'bao-gia-tam-panel-cach-nhiet-eps',
    'quy-cach-kich-thuoc-panel-eps',
    'tam-cach-nhiet-eps-kho-lanh-nha-xuong-phong-sach',
  ],
  'cua-kho-lanh': ['cua-kho-lanh-inox-304', 'chon-do-day-panel-kho-lanh'],
  'phu-kien-kho-lanh': ['nep-u-v-trong-v-ngoai-phu-kien-panel', 'chuan-bi-thong-tin-kho-lanh'],
  'phu-kien-cua': ['cua-kho-lanh-inox-304', 'nep-u-v-trong-v-ngoai-phu-kien-panel'],
  'vat-tu-cach-nhiet': ['quy-cach-kich-thuoc-panel-eps', 'nep-u-v-trong-v-ngoai-phu-kien-panel'],
}
const relatedGuides = computed(() => (relatedGuideSlugs[product.value?.slug || ''] || []).flatMap(slug => {
  const guide = content.value.posts.find(item => item.slug === slug && item.published)
  return guide ? [guide] : []
}))
const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

const openDisclosure = async (id: string) => {
  await nextTick()
  const target = document.getElementById(id)

  if (!(target instanceof HTMLDetailsElement)) return

  document
    .querySelectorAll<HTMLDetailsElement>('[data-product-detail-disclosure][open]')
    .forEach((disclosure) => {
      if (disclosure !== target) disclosure.open = false
    })

  target.open = true
  await nextTick()
  target.scrollIntoView({
    block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
  target.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true })
}

const openHashedDisclosure = () => {
  const rawHash = route.hash.replace(/^#/, '')
  if (!rawHash) return

  try {
    void openDisclosure(decodeURIComponent(rawHash))
  }
  catch {
    // Ignore malformed hashes instead of breaking the product page.
  }
}

onMounted(openHashedDisclosure)

watch(
  () => route.hash,
  openHashedDisclosure,
  { flush: 'post' },
)

usePageSeo({
  title: () => product.value!.name,
  description: () => product.value!.summary,
  path: () => `/products/${product.value!.slug}`,
  image: () => product.value!.image,
  imageAlt: () => product.value!.imageAlt,
  breadcrumbs: [
    { name: 'Sản phẩm', path: '/products' },
    { name: () => product.value!.name, path: () => `/products/${product.value!.slug}` },
  ],
  catalogItem: {
    category: () => family.value?.name || 'Panel cách nhiệt và kho lạnh',
    applications: () => product.value!.applications,
    specifications: () => product.value!.specifications,
  },
})
</script>

<template>
  <div v-if="product" class="bg-[#f7f6f2] text-[#242421]">
    <article>
      <section class="border-b border-[#d8cfc4] bg-[#f3eee7]">
        <div class="container-site py-8 sm:py-10 lg:py-14">
          <nav aria-label="Đường dẫn trang" class="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#625a52]">
            <NuxtLink to="/products" class="inline-flex min-h-10 items-center transition-colors hover:text-[#874a2d]">
              Sản phẩm
            </NuxtLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page" class="text-[#292926]">{{ product.name }}</span>
          </nav>

          <div class="mt-7 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16">
            <div data-reveal>
              <div class="flex items-center gap-4">
                <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(productIndex) }}</span>
                <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">{{ product.eyebrow }}</p>
              </div>
              <h1 class="mt-5 text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-[#20211f] sm:text-6xl lg:text-[4.75rem]">
                {{ product.name }}
              </h1>
              <p class="mt-6 max-w-2xl text-base leading-8 text-[#625d56] sm:text-lg">
                {{ product.summary }}
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <NuxtLink
                  to="/contact#quick-contact-form"
                  class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#262724] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#874a2d]"
                >
                  Gửi quy cách cần mua
                </NuxtLink>
                <a
                  :href="content.companyContact.phoneHref"
                  class="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bdb2a7] bg-white/55 px-6 py-3 text-sm font-semibold text-[#292926] transition-colors hover:border-[#292926] hover:bg-white"
                >
                  Gọi {{ content.companyContact.phoneDisplay }}
                </a>
              </div>
            </div>

            <figure data-reveal data-reveal-delay="90" class="overflow-hidden rounded-[2rem] border border-[#d1c6bb] bg-[#ded5cc] p-2 shadow-[0_24px_70px_rgba(65,53,43,0.12)] sm:p-3">
              <img
                :src="product.image"
                :srcset="product.imageSrcset"
                :width="product.imageWidth"
                :height="product.imageHeight"
                :alt="product.imageAlt"
                sizes="(min-width: 1024px) 52vw, 100vw"
                class="aspect-[4/3] h-auto w-full rounded-[1.5rem] object-cover"
                fetchpriority="high"
                decoding="async"
              >
              <figcaption class="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#625a52]">
                Ảnh minh họa · Quy cách thực tế được xác nhận theo yêu cầu
              </figcaption>
            </figure>
          </div>

          <dl class="mt-10 grid overflow-hidden rounded-[1.5rem] border border-[#d2c8bd] bg-white/60 sm:grid-cols-3 lg:mt-14">
            <div class="border-b border-[#d2c8bd] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Nhóm sản phẩm</dt>
              <dd class="mt-2 text-base font-semibold text-[#292926]">{{ family?.name }}</dd>
            </div>
            <div class="border-b border-[#d2c8bd] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Phạm vi</dt>
              <dd class="mt-2 text-base font-semibold text-[#292926]">Tư vấn và xác nhận toàn quốc</dd>
            </div>
            <div class="p-5 sm:p-6">
              <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Xác nhận</dt>
              <dd class="mt-2 text-base font-semibold text-[#292926]">Theo quy cách thực tế</dd>
            </div>
          </dl>

          <nav aria-label="Đi nhanh trong trang sản phẩm" class="mt-5 flex gap-2 overflow-x-auto rounded-full border border-[#d2c8bd] bg-white/50 p-1.5 backdrop-blur-sm">
            <a href="#hinh-anh" class="inline-flex min-h-10 shrink-0 items-center rounded-full bg-white px-4 text-xs font-bold text-[#8d5437] shadow-sm">Xem bằng hình</a>
            <a href="#thong-so" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Thông số</a>
            <a href="#chon-nhanh" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Thiết kế sơ bộ</a>
            <a href="#cau-hinh" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Chi tiết kỹ thuật</a>
            <a href="#chuan-bi" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Thông tin cần gửi</a>
            <a href="#hoi-dap" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Hỏi đáp</a>
          </nav>
        </div>
      </section>

      <section id="hinh-anh" data-product-visual-browser class="scroll-mt-24 border-b border-[#d8cfc4] bg-white">
        <div class="container-site py-12 sm:py-16 lg:py-20">
          <header data-reveal class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Xem nhanh bằng hình</p>
              <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#20211f] sm:text-4xl">Chọn mục cần tìm trước.</h2>
            </div>
            <p class="max-w-xl text-sm leading-7 text-[#625d56]">Bấm vào hình để đi thẳng đến phần cấu tạo và thông số tương ứng.</p>
          </header>

          <div
            class="mt-8 grid gap-4 sm:grid-cols-2"
            :class="visualSections.length === 5 || visualSections.length === 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'"
          >
            <NuxtLink
              v-for="(section, index) in visualSections"
              :key="`visual-${section.id}`"
              :to="{ hash: `#${section.id}` }"
              data-product-visual-card
              data-reveal
              :data-reveal-delay="Math.min(index * 55, 165)"
              class="group min-w-0 overflow-hidden rounded-[1.25rem] border border-[#ded7cf] bg-[#f7f3ed] transition duration-300 hover:border-[#b98b70] hover:bg-white motion-safe:hover:-translate-y-1"
              @click="openDisclosure(section.id)"
            >
              <div class="aspect-[4/3] overflow-hidden border-b border-[#ded7cf] bg-[#ece6de]">
                <img
                  v-if="section.media"
                  data-product-visual-image
                  :src="section.media.image"
                  :srcset="section.media.imageSrcset"
                  :width="section.media.imageWidth"
                  :height="section.media.imageHeight"
                  :alt="section.media.imageAlt"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  class="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.035]"
                  :loading="index < 4 ? 'eager' : 'lazy'"
                  decoding="async"
                >
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-4">
                  <h3 data-product-visual-title class="text-lg font-semibold leading-tight text-[#292926]">{{ section.title }}</h3>
                  <span class="shrink-0 text-[#874a2d] transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true">↓</span>
                </div>
                <p class="mt-3 line-clamp-2 text-sm leading-6 text-[#625d56]">{{ section.summary }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section id="thong-so" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#fbf9f5]">
        <div class="container-site grid gap-12 py-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-18 lg:py-22">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Phạm vi sử dụng</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-4xl">
              Dùng đúng vị trí, xác nhận đúng quy cách.
            </h2>
            <ul class="mt-7 flex flex-wrap gap-2">
              <li
                v-for="application in product.applications"
                :key="application"
                class="rounded-full border border-[#cfc4b8] bg-white px-4 py-2.5 text-xs font-semibold text-[#514b45]"
              >
                {{ application }}
              </li>
            </ul>
          </div>

          <div data-reveal data-reveal-delay="80">
            <div class="flex items-end justify-between gap-5 border-b border-[#aaa096] pb-4">
              <h2 class="text-2xl font-semibold text-[#242421] sm:text-3xl">Thông số kỹ thuật cần đối chiếu</h2>
              <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55] sm:block">Đối chiếu trước khi đặt</p>
            </div>
            <dl class="mt-4 grid gap-3 sm:grid-cols-2">
              <div
                v-for="specification in product.specifications"
                :key="specification.label"
                data-product-specification
                class="min-w-0 rounded-[1.25rem] border border-[#ddd4ca] bg-white p-5 sm:p-6"
                :class="specification.value.length > 72 ? 'sm:col-span-2' : ''"
              >
                <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ specification.label }}</dt>
                <dd class="mt-3 break-words text-base font-semibold leading-7 text-[#292926]">{{ specification.value }}</dd>
              </div>
            </dl>
            <p class="mt-5 text-sm leading-7 text-[#625a52]">
              Thông số trên dùng để đối chiếu yêu cầu ban đầu. Những giá trị có chữ “tham khảo” không phải cấu hình mặc định; quy cách cuối cùng được xác nhận lại theo số lượng, vị trí lắp và điều kiện công trình.
            </p>
          </div>
        </div>
      </section>

      <section id="chon-nhanh" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#eee8e0]">
        <div class="container-site py-14 lg:py-20">
          <div data-reveal class="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Hướng dẫn thiết kế sơ bộ</p>
              <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-5xl">
                Đối chiếu nhu cầu với điều kiện vận hành.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#625d56] lg:justify-self-end">
              Cấu hình dưới đây chỉ dùng để sàng lọc ban đầu, không thay thế tính tải nhiệt hoặc bản duyệt kỹ thuật. Quy cách cuối cùng phải được xác nhận theo kích thước, môi trường sử dụng và điều kiện lắp đặt thực tế.
            </p>
          </div>

          <ol data-product-engineering-guide class="mt-9 grid min-w-0 gap-4">
            <li
              v-for="(item, index) in product.selectionGuide"
              :key="item.need"
              data-product-selection-guide
              data-reveal
              :data-reveal-delay="Math.min(index * 60, 180)"
              class="min-w-0 overflow-hidden rounded-[1.35rem] border border-[#d2c8bd] bg-white/80"
            >
              <details data-product-guide-disclosure class="group">
                <summary class="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 marker:hidden sm:p-6">
                  <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(index) }}</span>
                  <span data-selection-need class="min-w-0 break-words text-base font-semibold leading-7 text-[#292926]">{{ item.need }}</span>
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c8bcb0] text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <dl class="grid min-w-0 gap-5 border-t border-[#d8cfc4] p-5 sm:grid-cols-3 sm:p-6 xl:gap-7">
                  <div class="min-w-0">
                    <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Điều kiện vận hành</dt>
                    <dd data-selection-conditions class="mt-2 break-words text-sm leading-7 text-[#514c46]">{{ item.operatingConditions }}</dd>
                  </div>
                  <div class="min-w-0">
                    <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Cấu hình sơ bộ</dt>
                    <dd data-selection-configuration class="mt-2 break-words text-sm font-semibold leading-7 text-[#373632]">{{ item.preliminaryConfiguration }}</dd>
                  </div>
                  <div class="min-w-0 border-t border-[#d8cfc4] pt-4 sm:border-t-0 sm:pt-0">
                    <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">Cần xác nhận</dt>
                    <dd data-selection-confirm class="mt-2 break-words text-sm font-semibold leading-7 text-[#373632]">{{ item.confirm }}</dd>
                  </div>
                </dl>
              </details>
            </li>
          </ol>

          <div class="mt-8 grid min-w-0 gap-4 md:grid-cols-2">
            <details data-product-advantages data-reveal class="group min-w-0 overflow-hidden rounded-[1.35rem] border border-[#cbd0c7] bg-[#f7f9f5]">
              <summary class="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 p-5 marker:hidden sm:p-6">
                <span>
                  <span class="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#53634f]">Ưu điểm</span>
                  <span class="mt-2 block text-xl font-semibold text-[#292926]">Điểm phù hợp của sản phẩm</span>
                </span>
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#b8c4b4] text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <ul class="grid gap-3 border-t border-[#cbd0c7] p-5 sm:p-6">
                <li
                  v-for="advantage in product.advantages"
                  :key="advantage"
                  data-product-advantage
                  class="flex min-w-0 gap-3 text-sm leading-7 text-[#454b42]"
                >
                  <span class="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#6d7d67]" aria-hidden="true" />
                  <span class="min-w-0 break-words">{{ advantage }}</span>
                </li>
              </ul>
            </details>

            <details data-product-limitations data-reveal data-reveal-delay="80" class="group min-w-0 overflow-hidden rounded-[1.35rem] border border-[#d7c7bc] bg-[#fbf6f1]">
              <summary class="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 p-5 marker:hidden sm:p-6">
                <span>
                  <span class="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">Hạn chế</span>
                  <span class="mt-2 block text-xl font-semibold text-[#292926]">Điều kiện cần cân nhắc</span>
                </span>
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d2bfb2] text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <ul class="grid gap-3 border-t border-[#d7c7bc] p-5 sm:p-6">
                <li
                  v-for="limitation in product.limitations"
                  :key="limitation"
                  data-product-limitation
                  class="flex min-w-0 gap-3 text-sm leading-7 text-[#514740]"
                >
                  <span class="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#a76b4c]" aria-hidden="true" />
                  <span class="min-w-0 break-words">{{ limitation }}</span>
                </li>
              </ul>
            </details>
          </div>
        </div>
      </section>

      <section id="cau-hinh" class="scroll-mt-24 border-b border-[#d8cfc4] bg-white">
        <div class="container-site py-14 lg:py-22">
          <div data-reveal class="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Thông tin kỹ thuật</p>
              <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-5xl">
                Cấu tạo, quy cách và cách lựa chọn.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#625d56] lg:justify-self-end">
              Mỗi nhóm sản phẩm có vật liệu, kích thước và điều kiện sử dụng khác nhau. Nội dung dưới đây giúp đối chiếu trước khi chốt báo giá hoặc bản duyệt kỹ thuật.
            </p>
          </div>

          <div class="mt-9 grid gap-3">
            <details
              v-for="(section, index) in product.detailSections"
              :id="section.id"
              :key="section.id"
              data-product-detail-section
              data-product-detail-disclosure
              data-reveal
              :data-reveal-delay="Math.min(index * 60, 180)"
              class="group scroll-mt-28 overflow-hidden rounded-[1.35rem] border border-[#ded7cf] bg-[#f7f3ed] open:bg-white"
            >
              <summary class="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-5 marker:hidden sm:gap-6 sm:p-7">
                <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(index) }}</span>
                <span class="min-w-0">
                  <span class="block text-lg font-semibold leading-tight text-[#292926] sm:text-xl">{{ section.title }}</span>
                  <span class="mt-2 line-clamp-2 block text-sm leading-6 text-[#625d56]">{{ section.summary }}</span>
                </span>
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c8bcb0] text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>

              <div class="border-t border-[#ded7cf] p-5 sm:p-7 lg:p-10">
                <div class="grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-12">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">Mô tả và lưu ý</p>
                  <div class="mt-4 space-y-4">
                    <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-sm leading-7 text-[#625d56]">
                      {{ paragraph }}
                    </p>
                  </div>

                  <div
                    v-if="section.references?.length"
                    data-product-technical-references
                    class="mt-6 rounded-[1.1rem] border border-[#d8cfc4] bg-white/60 p-4 sm:p-5"
                  >
                    <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Cơ sở kỹ thuật tham khảo</p>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <a
                        v-for="reference in section.references"
                        :key="reference.url"
                        :href="reference.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-product-technical-reference
                        class="inline-flex min-h-10 max-w-full items-center rounded-full border border-[#cabdb1] bg-white px-4 text-xs font-bold leading-5 text-[#514b45] transition-colors hover:border-[#9d6a50] hover:text-[#874a2d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#874a2d]"
                      >
                        <span class="min-w-0 break-words">{{ reference.label }}</span>
                        <span class="ml-2 shrink-0" aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>

                  <figure
                    v-if="section.media"
                    data-product-section-media
                    class="mt-7 overflow-hidden rounded-[1.25rem] border border-[#d5cbc0] bg-[#e8e0d7]"
                  >
                    <img
                      :src="section.media.image"
                      :srcset="section.media.imageSrcset"
                      :width="section.media.imageWidth"
                      :height="section.media.imageHeight"
                      :alt="section.media.imageAlt"
                      sizes="(min-width: 1024px) 34vw, (min-width: 640px) calc(100vw - 96px), calc(100vw - 64px)"
                      class="h-auto w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    >
                    <figcaption class="flex flex-col gap-3 border-t border-[#d5cbc0] bg-[#f2ece5] px-4 py-3 text-xs leading-5 text-[#655d55] sm:flex-row sm:items-start sm:justify-between sm:px-5">
                      <span>{{ section.media.caption }}</span>
                      <a
                        :href="section.media.image"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-product-section-media-zoom
                        class="inline-flex min-h-8 shrink-0 items-center font-bold text-[#874a2d] transition-colors hover:text-[#292926] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#874a2d]"
                        :aria-label="`Mở hình lớn: ${section.media.imageAlt}`"
                      >
                        Mở hình lớn ↗
                      </a>
                    </figcaption>
                  </figure>
                </div>

                <div>
                  <dl class="grid gap-px overflow-hidden rounded-[1.25rem] border border-[#d5cbc0] bg-[#d5cbc0] sm:grid-cols-2">
                    <div
                      v-for="specification in section.specifications"
                      :key="specification.label"
                      class="bg-white p-5"
                    >
                      <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ specification.label }}</dt>
                      <dd class="mt-2 break-words text-sm font-semibold leading-6 text-[#34332f]">{{ specification.value }}</dd>
                    </div>
                  </dl>

                  <div class="mt-6">
                    <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Điểm cần đối chiếu</p>
                    <ul class="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      <li v-for="point in section.points" :key="point" class="flex gap-3 text-sm leading-7 text-[#45423d]">
                        <span class="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#874a2d]" aria-hidden="true" />
                        <span>{{ point }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section id="chuan-bi" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#eee8e0]">
        <div class="container-site grid gap-10 py-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-18 lg:py-20">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Chuẩn bị yêu cầu</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-4xl">
              Gửi đúng dữ liệu để báo giá không phải đoán.
            </h2>
          </div>
          <details data-product-checklist-disclosure data-reveal class="group overflow-hidden rounded-[1.35rem] border border-[#d2c8bd] bg-white/[0.72]">
            <summary class="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 p-5 marker:hidden sm:p-6">
              <span>
                <span class="block text-lg font-semibold text-[#292926]">Danh sách cần chuẩn bị</span>
                <span class="mt-1 block text-sm text-[#625d56]">{{ product.selectionChecklist.length }} mục — bấm để mở</span>
              </span>
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c8bcb0] text-lg transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <ol class="grid gap-px border-t border-[#d2c8bd] bg-[#d8cfc4] sm:grid-cols-2">
              <li
                v-for="(item, index) in product.selectionChecklist"
                :key="item"
                data-product-checklist-item
                class="flex min-h-24 gap-4 bg-white p-5 sm:p-6"
              >
                <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(index) }}</span>
                <span class="text-sm font-semibold leading-7 text-[#373632]">{{ item }}</span>
              </li>
            </ol>
          </details>
        </div>
      </section>

      <section id="hoi-dap" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#fbf9f5]">
        <div class="container-site grid gap-10 py-14 lg:grid-cols-[0.66fr_1.34fr] lg:gap-18 lg:py-20">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Hỏi đáp nhanh</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-4xl">
              Những câu hỏi thường gặp trước khi đặt sản phẩm.
            </h2>
            <p class="mt-5 max-w-xl text-sm leading-7 text-[#625d56]">
              Nếu công trình có yêu cầu vận hành riêng, hãy gửi bản vẽ, kích thước và thông số liên quan để được kiểm tra đúng cấu hình.
            </p>
          </div>

          <div class="divide-y divide-[#d8cfc4] border-y border-[#d8cfc4]">
            <details
              v-for="(item, index) in product.frequentlyAskedQuestions"
              :key="item.question"
              data-product-faq
              :open="index === 0"
              class="group py-1"
            >
              <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-base font-semibold text-[#292926] marker:hidden">
                <span>{{ item.question }}</span>
                <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c8bcb0] text-lg font-normal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p class="max-w-3xl pb-5 pr-12 text-sm leading-7 text-[#625d56]">{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>
    </article>

    <section class="bg-white">
      <div class="container-site py-14 lg:py-20">
        <div data-reveal class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Sản phẩm liên quan</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#20211f] sm:text-4xl">Xem thêm trong danh mục.</h2>
          </div>
          <NuxtLink to="/products" class="inline-flex min-h-11 items-center text-sm font-semibold text-[#7f4d32] hover:text-[#292926]">
            Tất cả sản phẩm →
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="(related, index) in relatedProducts"
            :key="related.slug"
            :to="`/products/${related.slug}`"
            data-reveal
            :data-reveal-delay="index * 65"
            class="group overflow-hidden rounded-[1.5rem] border border-[#ded7cf] bg-[#f7f3ed] transition-transform duration-300 motion-safe:hover:-translate-y-1"
          >
            <img
              :src="related.image"
              :srcset="related.imageSrcset"
              :width="related.imageWidth"
              :height="related.imageHeight"
              :alt="related.imageAlt"
              sizes="(min-width: 768px) 33vw, 100vw"
              class="aspect-[16/10] h-auto w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
              loading="lazy"
              decoding="async"
            >
            <div class="p-5 sm:p-6">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ related.eyebrow }}</p>
              <div class="mt-3 flex items-start justify-between gap-4">
                <h3 class="text-xl font-semibold text-[#292926]">{{ related.name }}</h3>
                <span aria-hidden="true" class="text-lg transition-transform motion-safe:group-hover:translate-x-1">→</span>
              </div>
              <span class="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.14em] text-[#625a52]">Xem chi tiết</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="relatedGuides.length" class="border-t border-[#d8cfc4] bg-[#f7f3ed]">
      <div class="container-site py-14 lg:py-20">
        <div data-reveal class="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Hướng dẫn liên quan</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#20211f] sm:text-4xl">Đọc trước khi chọn quy cách.</h2>
          </div>
          <p class="max-w-2xl text-sm leading-7 text-[#625d56] lg:justify-self-end">
            Nội dung giải thích cấu tạo, ứng dụng, cách chuẩn bị yêu cầu và những dữ liệu cần có để nhận báo giá rõ ràng.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <NuxtLink
            v-for="(guide, index) in relatedGuides"
            :key="guide.slug"
            :to="`/posts/${guide.slug}`"
            data-related-guide
            data-reveal
            :data-reveal-delay="index * 55"
            class="group rounded-[1.35rem] border border-[#ded7cf] bg-white p-6 transition duration-300 hover:border-[#b98b70] hover:shadow-[0_18px_45px_rgba(63,52,42,0.09)]"
          >
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{{ guide.eyebrow }}</p>
            <div class="mt-3 flex items-start justify-between gap-5">
              <h3 class="text-xl font-semibold leading-snug text-[#292926] group-hover:text-[#874a2d]">{{ guide.title }}</h3>
              <span aria-hidden="true" class="text-lg text-[#874a2d] transition-transform motion-safe:group-hover:translate-x-1">→</span>
            </div>
            <p class="mt-4 line-clamp-2 text-sm leading-7 text-[#625d56]">{{ guide.summary }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="product-contact-cta border-y border-white/10 bg-[#262724] text-white" data-product-contact-cta>
      <div data-reveal class="container-site grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center lg:py-16">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#d99a73]">Cần xác nhận quy cách?</p>
          <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">Gửi kích thước và số lượng để Thái Thanh kiểm tra.</h2>
        </div>
        <NuxtLink
          to="/contact#quick-contact-form"
          class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#9f5737] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#87462d] focus-visible:outline-white"
          data-product-contact-link
        >
          Gửi yêu cầu nhanh
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
