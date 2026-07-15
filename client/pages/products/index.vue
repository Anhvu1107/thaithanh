<script setup lang="ts">
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)

const quickCatalogConfig = [
  {
    slug: 'panel-eps',
    sectionId: 'quy-cach-panel',
    category: 'Panel cách nhiệt',
    title: 'Panel EPS 50–200 mm',
    summary: 'Tấm panel theo độ dày và tỷ trọng phù hợp từng hạng mục.',
    facts: ['50–200 mm', '14–25 kg/m³'],
    image: '/images/insulation/panel-eps-construction-diagram.svg',
  },
  {
    slug: 'cua-kho-lanh',
    sectionId: 'kich-thuoc-va-cach-do-o-cho',
    category: 'Cửa Inox 304',
    title: 'Cửa kho lạnh theo ô chờ',
    summary: 'Gia công theo kích thước, hướng mở và điều kiện vận hành.',
    facts: ['600 × 600 × 100 mm', 'Tới 1200 × 1800 mm'],
    image: '/images/insulation/cold-door-measurement-diagram.svg',
  },
  {
    slug: 'cua-kho-lanh',
    sectionId: 'cua-ban-le',
    category: 'Cửa Inox 304',
    title: 'Cửa kho lạnh bản lề',
    summary: 'Kiểu mở quay gọn, phù hợp lối người và xe đẩy nhỏ.',
    facts: ['Mở trái hoặc phải', 'Lõi EPS'],
    image: '/images/insulation/cold-door-types-diagram.svg',
  },
  {
    slug: 'cua-kho-lanh',
    sectionId: 'cua-truot',
    category: 'Cửa Inox 304',
    title: 'Cửa lùa, cửa trượt',
    summary: 'Không chiếm vùng quay, phù hợp ô rộng và luồng xe hàng.',
    facts: ['Ray + bánh xe', 'Lõi EPS'],
    image: '/images/insulation/cold-door-types-diagram.svg',
  },
  {
    slug: 'cua-kho-lanh',
    sectionId: 'song-gai-inox',
    category: 'Cửa Inox 304',
    title: 'Cửa song gài Inox',
    summary: 'Cánh hộp bọc kín Inox 304, cơ cấu gài ép kín nhiều điểm.',
    facts: ['Cánh bọc Inox 304', 'Lõi EPS'],
    image: '/images/insulation/cold-door-types-diagram.svg',
  },
  {
    slug: 'cua-kho-lanh',
    sectionId: 'song-gai-eps',
    category: 'Cửa Inox 304',
    title: 'Cửa song gài EPS',
    summary: 'Cánh panel EPS làm kết cấu chính, viền nẹp U Inox 304.',
    facts: ['Cánh panel EPS', 'Viền Inox 304'],
    image: '/images/insulation/cold-door-types-diagram.svg',
  },
  {
    slug: 'phu-kien-kho-lanh',
    sectionId: 'nep-u-panel',
    category: 'Phụ kiện panel',
    title: 'Nẹp U panel',
    summary: 'Định vị chân vách và hoàn thiện cạnh panel theo quy cách.',
    facts: ['Chân vách', 'Theo dày panel'],
    image: '/images/insulation/accessory-u-profile.svg',
  },
  {
    slug: 'phu-kien-kho-lanh',
    sectionId: 'nep-v-panel',
    category: 'Phụ kiện panel',
    title: 'V trong và V ngoài',
    summary: 'Che và hoàn thiện các góc giao nhau của hệ panel.',
    facts: ['V trong', 'V ngoài'],
    image: '/images/insulation/accessory-v-profiles.svg',
  },
  {
    slug: 'phu-kien-kho-lanh',
    sectionId: 'treo-tran-panel',
    category: 'Phụ kiện panel',
    title: 'Thanh T và bulông dù',
    summary: 'Cụm treo trần cần được chọn theo nhịp và tải thiết kế.',
    facts: ['Treo trần panel', 'Theo tải thiết kế'],
    image: '/images/insulation/accessory-ceiling-hanger.svg',
  },
  {
    slug: 'phu-kien-kho-lanh',
    sectionId: 'van-can-bang-ap',
    category: 'Phụ kiện kho lạnh',
    title: 'Van cân bằng áp',
    summary: 'Hỗ trợ cân bằng chênh áp khi nhiệt độ trong kho thay đổi.',
    facts: ['Theo thể tích kho', 'Theo chênh nhiệt'],
    image: '/images/insulation/accessory-pressure-pipe.svg',
  },
  {
    slug: 'phu-kien-kho-lanh',
    sectionId: 'ong-cach-nhiet',
    category: 'Phụ kiện kho lạnh',
    title: 'Ống cách nhiệt EPS',
    summary: 'Chi tiết bao ống được xác nhận theo đường kính và vị trí lắp.',
    facts: ['Lõi EPS', 'Theo đường kính ống'],
    image: '/images/insulation/accessory-pressure-pipe.svg',
  },
  {
    slug: 'phu-kien-cua',
    sectionId: 'ban-le-cua',
    category: 'Phụ kiện cửa',
    title: 'Phụ kiện cửa kho lạnh',
    summary: 'Bản lề, ray, khóa, gioăng và bộ sưởi theo đúng loại cửa.',
    facts: ['Bản lề · khóa', 'Gioăng · ray'],
    image: '/images/insulation/door-accessories-diagram.svg',
  },
  {
    slug: 'vat-tu-cach-nhiet',
    sectionId: 'inox-304',
    category: 'Vật tư bán lẻ',
    title: 'Inox 304',
    summary: 'Tấm và chi tiết Inox cho cửa, khung hoặc hạng mục hoàn thiện.',
    facts: ['Inox 304', 'Cắt/chấn theo bản vẽ'],
    image: '/images/insulation/cold-room-editorial.jpg',
    imageWidth: 1672,
    imageHeight: 941,
  },
  {
    slug: 'vat-tu-cach-nhiet',
    sectionId: 'xop-eps',
    category: 'Vật tư bán lẻ',
    title: 'Xốp EPS tấm hoặc khối',
    summary: 'Kích thước và tỷ trọng được chọn theo mục đích gia công.',
    facts: ['14–25 kg/m³', 'Tấm hoặc khối'],
    image: '/images/insulation/panel-eps-construction-diagram.svg',
  },
  {
    slug: 'vat-tu-cach-nhiet',
    sectionId: 'ton-ma-mau',
    category: 'Vật tư bán lẻ',
    title: 'Tôn mạ màu',
    summary: 'Bề mặt, màu và quy cách được duyệt theo mẫu công trình.',
    facts: ['Theo mẫu màu', 'Cắt/chấn theo yêu cầu'],
    image: '/images/insulation/panel-eps-construction-diagram.svg',
  },
  {
    slug: 'vat-tu-cach-nhiet',
    sectionId: 'chi-tiet-gia-cong',
    category: 'Gia công theo yêu cầu',
    title: 'Chi tiết cắt chấn theo bản vẽ',
    summary: 'Nẹp và tấm bọc được gia công theo kích thước đã duyệt.',
    facts: ['Inox hoặc tôn màu', 'Theo bản vẽ'],
    image: '/images/insulation/panel-profiles-diagram.svg',
  },
] as const

const quickCatalogItems = computed(() => quickCatalogConfig.flatMap((config) => {
  const product = content.value.retailProducts.find(item => item.slug === config.slug)
  const section = product?.detailSections.find(item => item.id === config.sectionId)

  if (!product || !section) return []

  return [{
    ...config,
    to: `/products/${config.slug}#${config.sectionId}`,
    imageAlt: section.media?.imageAlt || `${config.title} — minh họa kỹ thuật`,
    imageSrcset: section.media?.image === config.image ? section.media.imageSrcset : undefined,
    imageWidth: 'imageWidth' in config ? config.imageWidth : 1200,
    imageHeight: 'imageHeight' in config ? config.imageHeight : 760,
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
          <p class="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-white/[0.5] sm:block">Xem bằng hình · Mở chi tiết khi cần</p>
        </div>

        <div class="page-hero-copy mt-12 max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#e0a17d]">Danh mục bán lẻ</p>
          <h1 class="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.5rem]">
            Nhìn sản phẩm trước. Xem thông số sau.
          </h1>
          <p class="mt-6 max-w-xl text-base leading-8 text-white/[0.75] sm:text-lg">
            Chọn đúng món hàng bằng hình minh họa, rồi mở phần kỹ thuật khi cần đối chiếu quy cách.
          </p>
          <a href="#retail-products" class="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-panel-black transition-colors hover:bg-[#d79068] hover:text-white">
            Xem sản phẩm ngay ↓
          </a>
        </div>
      </div>
    </section>

    <section id="retail-products" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#fbf9f5]">
      <div class="container-site py-12 sm:py-16 lg:py-20">
        <header data-reveal class="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-16">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Xem nhanh bằng hình</p>
            <h2 class="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#20211f] sm:text-5xl">
              Chọn thẳng sản phẩm cần xem.
            </h2>
          </div>
          <p class="max-w-2xl text-base leading-8 text-[#625d56] lg:justify-self-end">
            Mỗi thẻ chỉ giữ thông tin quan trọng nhất. Bấm vào thẻ để đi thẳng đến cấu tạo, quy cách và hướng dẫn chọn của sản phẩm đó.
          </p>
        </header>

        <div data-product-visual-catalog class="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <NuxtLink
            v-for="(card, index) in quickCatalogItems"
            :key="`${card.slug}-${card.sectionId}`"
            :to="card.to"
            data-product-detail-link
            data-product-quick-card
            data-reveal
            :data-reveal-delay="Math.min((index % 4) * 55, 165)"
            class="group flex min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-[#ded6cd] bg-white shadow-[0_14px_40px_rgba(63,52,42,0.06)] transition duration-300 hover:border-[#b98b70] hover:shadow-[0_22px_55px_rgba(63,52,42,0.12)] motion-safe:hover:-translate-y-1"
          >
            <div class="relative aspect-[4/3] overflow-hidden border-b border-[#e2dad1] bg-[#eee9e2]">
              <img
                data-product-card-image
                :src="card.image"
                :srcset="card.imageSrcset"
                :width="card.imageWidth"
                :height="card.imageHeight"
                :alt="card.imageAlt"
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                class="h-full w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.035]"
                :class="card.image.endsWith('.svg') ? 'object-contain p-2' : 'object-cover'"
                :loading="index < 4 ? 'eager' : 'lazy'"
                decoding="async"
              >
              <span class="absolute left-3 top-3 rounded-full border border-white/65 bg-white/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#514b45] shadow-sm backdrop-blur-md">
                {{ card.category }}
              </span>
            </div>

            <div class="flex flex-1 flex-col p-5 sm:p-6">
              <div class="flex items-start justify-between gap-4">
                <h3 data-product-card-title class="min-w-0 text-xl font-semibold leading-tight tracking-[-0.02em] text-[#292926]">
                  {{ card.title }}
                </h3>
                <span class="shrink-0 text-lg text-[#874a2d] transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
              <ul data-product-card-facts class="mt-4 flex flex-wrap gap-2">
                <li
                  v-for="fact in card.facts"
                  :key="fact"
                  data-product-card-fact
                  class="rounded-full bg-[#f1ece6] px-3 py-1.5 text-[10px] font-bold text-[#675f57]"
                >
                  {{ fact }}
                </li>
              </ul>
              <p class="mt-4 line-clamp-2 text-sm leading-6 text-[#625d56]">{{ card.summary }}</p>
              <span class="mt-auto pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">Xem hình và thông số</span>
            </div>
          </NuxtLink>
        </div>

        <p class="mt-6 text-center text-xs leading-6 text-[#766e66]">
          Hình dùng để nhận diện nhanh nhóm sản phẩm; kích thước và cấu hình cuối cùng được xác nhận theo yêu cầu thực tế.
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
