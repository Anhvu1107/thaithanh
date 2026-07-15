<script setup lang="ts">
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)

interface ProductCategoryPresentation {
  slug: string
  label: string
  title: string
  summary: string
  highlights: string[]
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
}

const categoryPresentation: ProductCategoryPresentation[] = [
  {
    slug: 'panel-eps',
    label: 'Panel cách nhiệt',
    title: 'Panel EPS',
    summary: 'Tấm panel bán lẻ theo độ dày, tỷ trọng và số lượng yêu cầu.',
    highlights: ['50–200 mm', '14–25 kg/m³', 'Vách · trần · mái'],
  },
  {
    slug: 'cua-kho-lanh',
    label: 'Cửa Inox 304',
    title: 'Cửa kho lạnh',
    summary: 'Tách riêng các dòng cửa bản lề, cửa trượt và cửa song gài theo ô chờ.',
    highlights: ['Bản lề', 'Cửa trượt', 'Song gài', 'Theo kích thước'],
  },
  {
    slug: 'phu-kien-kho-lanh',
    label: 'Phụ kiện hệ panel',
    title: 'Phụ kiện kho lạnh',
    summary: 'Nhóm liên kết, hoàn thiện góc, treo trần và cân bằng áp của hệ kho.',
    highlights: ['Nẹp U', 'V trong và V ngoài', 'Thanh T · bulông', 'Van · ống EPS'],
  },
  {
    slug: 'phu-kien-cua',
    label: 'Phụ kiện đóng mở',
    title: 'Phụ kiện cửa',
    summary: 'Bản lề, khóa, ray, gioăng và chi tiết làm kín được gom đúng một nhóm.',
    highlights: ['Bản lề · khóa', 'Ray · bánh xe', 'Gioăng · sưởi'],
    image: '/images/insulation/door-accessories-diagram.svg',
    imageAlt: 'Sơ đồ nhận biết bản lề, ray bánh xe, tay khóa, gioăng và phụ kiện cửa kho lạnh',
    imageWidth: 1200,
    imageHeight: 760,
  },
  {
    slug: 'vat-tu-cach-nhiet',
    label: 'Vật tư bán lẻ',
    title: 'Vật tư cách nhiệt',
    summary: 'Vật liệu và chi tiết gia công được tách khỏi panel thành phẩm và phụ kiện.',
    highlights: ['Inox 304', 'Xốp EPS', 'Tôn mạ màu', 'Cắt chấn'],
    image: '/images/insulation/panel-profiles-diagram.svg',
    imageAlt: 'Sơ đồ các dạng nẹp, tấm bọc và chi tiết vật tư gia công cho hệ panel',
    imageWidth: 1200,
    imageHeight: 760,
  },
]

const productCategories = computed(() => categoryPresentation.flatMap((presentation) => {
  const product = content.value.retailProducts.find(item => item.slug === presentation.slug)
  if (!product) return []

  return [{
    ...presentation,
    to: `/products/${presentation.slug}`,
    image: presentation.image ?? product.image,
    imageAlt: presentation.imageAlt ?? product.imageAlt,
    imageWidth: presentation.imageWidth ?? product.imageWidth,
    imageHeight: presentation.imageHeight ?? product.imageHeight,
    imageSrcset: presentation.image ? undefined : product.imageSrcset,
  }]
}))

usePageSeo({
  title: 'Panel, cửa kho lạnh và phụ kiện',
  description: 'Panel EPS, cửa kho lạnh Inox 304 và phụ kiện U/V bán lẻ; xem nhanh bằng hình và mở thông số chi tiết theo từng sản phẩm.',
  path: '/products',
  image: '/images/insulation/eps-panel.webp',
  imageAlt: 'Minh họa mặt cắt tấm panel EPS',
})
</script>

<template>
  <div class="bg-[#f7f6f2] text-[#242421]">
    <section class="relative isolate min-h-[29rem] overflow-hidden border-b border-[#d8cfc4] bg-panel-black text-white">
      <img
        src="/images/insulation/cold-door-editorial.jpg"
        width="1254"
        height="1254"
        alt="Minh họa cửa Inox 304 và hệ panel cách nhiệt"
        class="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_50%]"
        decoding="async"
        fetchpriority="high"
      >
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(24,27,24,0.9)_0%,rgba(24,27,24,0.72)_44%,rgba(24,27,24,0.2)_82%)]" aria-hidden="true" />

      <div class="container-site flex min-h-[29rem] flex-col justify-between py-10 sm:py-12 lg:py-14">
        <div class="page-hero-marker flex items-center justify-between gap-6 border-b border-white/[0.16] pb-5">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.7]">Thái Thành / Sản phẩm</p>
          <p class="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-white/[0.5] sm:block">5 nhóm rõ ràng · Không trộn danh mục</p>
        </div>

        <div class="page-hero-copy mt-12 max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#e0a17d]">Danh mục theo nhóm</p>
          <h1 class="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.5rem]">
            Chọn đúng nhóm. Tìm sản phẩm nhanh hơn.
          </h1>
          <p class="mt-6 max-w-xl text-base leading-8 text-white/[0.75] sm:text-lg">
            Panel, cửa, phụ kiện và vật tư được tách riêng để khách không phải tìm giữa một danh sách lẫn lộn.
          </p>
          <a href="#retail-products" class="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-panel-black transition-colors hover:bg-[#d79068] hover:text-white">
            Xem 5 nhóm sản phẩm ↓
          </a>
        </div>
      </div>
    </section>

    <section id="retail-products" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#fbf9f5]">
      <div class="container-site py-12 sm:py-16 lg:py-20">
        <header data-reveal class="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-16">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Phân loại sản phẩm</p>
            <h2 class="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#20211f] sm:text-5xl">
              Mỗi nhóm một lối vào riêng.
            </h2>
          </div>
          <p class="max-w-2xl text-base leading-8 text-[#625d56] lg:justify-self-end">
            Chọn nhóm trước, sau đó xem các kiểu sản phẩm, hình minh họa và thông số kỹ thuật nằm đúng trong nhóm đó.
          </p>
        </header>

        <div data-product-category-grid class="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          <NuxtLink
            v-for="(category, index) in productCategories"
            :key="category.slug"
            :to="category.to"
            data-product-category-card
            data-product-category-link
            data-reveal
            :data-product-category="category.slug"
            :data-reveal-delay="Math.min(index * 55, 165)"
            class="group flex min-w-0 flex-col overflow-hidden rounded-[1.55rem] border border-[#ded6cd] bg-white shadow-[0_14px_40px_rgba(63,52,42,0.07)] transition duration-300 hover:border-[#b98b70] hover:shadow-[0_24px_60px_rgba(63,52,42,0.14)] motion-safe:hover:-translate-y-1"
            :class="index < 3
              ? 'lg:col-span-2'
              : (index === 3
                ? 'lg:col-span-2 lg:col-start-2'
                : 'sm:col-span-2 sm:w-[calc(50%-0.625rem)] sm:justify-self-center lg:col-span-2 lg:col-start-4 lg:w-auto')"
          >
            <div class="relative aspect-[16/10] overflow-hidden border-b border-[#e2dad1] bg-[#eee9e2]">
              <img
                data-product-category-image
                :src="category.image"
                :srcset="category.imageSrcset"
                :width="category.imageWidth"
                :height="category.imageHeight"
                :alt="category.imageAlt"
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
                class="h-full w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.035]"
                :class="category.image.endsWith('.svg') ? 'object-contain p-3' : 'object-cover'"
                :loading="index < 3 ? 'eager' : 'lazy'"
                decoding="async"
              >
              <span class="absolute left-4 top-4 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 font-mono text-[10px] font-bold text-[#70442f] shadow-sm backdrop-blur-md">
                {{ String(index + 1).padStart(2, '0') }} / 05
              </span>
            </div>

            <div class="flex flex-1 flex-col p-6 sm:p-7">
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#874a2d]">{{ category.label }}</p>
              <div class="flex items-start justify-between gap-4">
                <h3 data-product-category-title class="mt-2 min-w-0 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#292926] sm:text-[1.7rem]">
                  {{ category.title }}
                </h3>
                <span class="mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d2c5b9] text-lg text-[#874a2d] transition motion-safe:group-hover:translate-x-1 group-hover:border-[#a56c4e]" aria-hidden="true">→</span>
              </div>
              <p class="mt-4 text-sm leading-6 text-[#625d56]">{{ category.summary }}</p>
              <ul data-product-category-highlights class="mt-5 flex flex-wrap gap-2">
                <li
                  v-for="highlight in category.highlights"
                  :key="highlight"
                  data-product-category-highlight
                  class="rounded-full bg-[#f1ece6] px-3 py-1.5 text-[10px] font-bold text-[#675f57]"
                >
                  {{ highlight }}
                </li>
              </ul>
              <span class="mt-auto border-t border-[#e2dad1] pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">Mở danh mục {{ category.title }}</span>
            </div>
          </NuxtLink>
        </div>

        <p class="mt-6 text-center text-xs leading-6 text-[#766e66]">
          Mỗi danh mục có trang riêng để xem loại sản phẩm, cấu tạo, quy cách và hướng dẫn lựa chọn.
        </p>
      </div>
    </section>

    <section class="bg-[#262724] text-[#f7f3ed]">
      <div data-reveal class="container-site grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center lg:py-16">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#d99a73]">Cần chốt đúng quy cách?</p>
          <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Gửi ảnh, kích thước và số lượng cần mua.
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-[#d8cfc4]">
            Thái Thành kiểm tra khả năng cung cấp và phản hồi cấu hình phù hợp với công trình.
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <a :href="companyContact.phoneHref" class="inline-flex min-h-12 items-center justify-center rounded-full border border-[#81786f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#262724]">
            Gọi {{ companyContact.phoneDisplay }}
          </a>
          <NuxtLink to="/contact#quick-contact-form" class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#b46d47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#cf8358]">
            Gửi yêu cầu
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
