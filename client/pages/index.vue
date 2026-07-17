<script setup lang="ts">
const { content } = useSiteContent()
const productFamilies = computed(() => content.value.productFamilies)
const solutions = computed(() => content.value.solutions)
const companyContact = computed(() => content.value.companyContact)
const featuredPostSlugs = [
  'tam-panel-cach-nhiet-eps-la-gi',
  'bao-gia-tam-panel-cach-nhiet-eps',
  'quy-cach-kich-thuoc-panel-eps',
  'tam-cach-nhiet-eps-kho-lanh-nha-xuong-phong-sach',
]
const featuredPosts = computed(() => featuredPostSlugs.flatMap(slug => {
  const post = content.value.posts.find(item => item.slug === slug && item.published)
  return post ? [post] : []
}))

const productFamilyDestinations: Record<string, string> = {
  eps: '/products/panel-eps',
  'doors-accessories': '/products/cua-kho-lanh',
}

const solutionDestinations: Record<string, string> = {
  'cold-storage': '/solutions/panel-kho-lanh',
  freezer: '/solutions/panel-kho-lanh',
  'clean-room': '/solutions/panel-phong-sach',
}

const quickProductChoices = [
  { index: '01', title: 'Panel EPS', note: 'Độ dày 50–200 mm · Có bán lẻ', href: '/products/panel-eps' },
  { index: '02', title: 'Cửa kho lạnh', note: 'Inox 304 · Bản lề hoặc cửa trượt', href: '/products/cua-kho-lanh' },
  { index: '03', title: 'Phụ kiện panel', note: 'Nẹp U, V và vật tư hoàn thiện', href: '/products/phu-kien-kho-lanh' },
  { index: '04', title: 'Phụ kiện cửa', note: 'Khóa, bản lề, gioăng và ray', href: '/products/phu-kien-cua' },
]

const HERO_SLIDE_DURATION = 6500
const heroSlides = [
  {
    image: '/images/insulation/cold-room-installation-documentary.jpg',
    imageSrcset: '/images/insulation/cold-room-installation-documentary-640.webp 640w, /images/insulation/cold-room-installation-documentary-960.webp 960w, /images/insulation/cold-room-installation-documentary.jpg 1672w',
    width: 1672,
    height: 941,
    alt: 'Đội ngũ kỹ thuật đang lắp đặt kho lạnh bằng panel cách nhiệt',
    label: 'Thi công kho lạnh thực tế',
  },
  {
    image: '/images/insulation/eps-panel-step-joint-editorial.jpg',
    imageSrcset: '/images/insulation/eps-panel-step-joint-editorial-640.webp 640w, /images/insulation/eps-panel-step-joint-editorial-960.webp 960w, /images/insulation/eps-panel-step-joint-editorial.jpg 1254w',
    width: 1254,
    height: 1254,
    alt: 'Minh họa cấu tạo tấm panel EPS',
    label: 'Panel EPS theo quy cách',
  },
  {
    image: '/images/insulation/cold-door-editorial.jpg',
    imageSrcset: '/images/insulation/cold-door-editorial-640.webp 640w, /images/insulation/cold-door-editorial-960.webp 960w, /images/insulation/cold-door-editorial.jpg 1254w',
    width: 1254,
    height: 1254,
    alt: 'Minh họa cửa Inox cho hệ kho lạnh',
    label: 'Cửa Inox 304',
  },
]

const activeHeroSlide = ref(0)
const heroPaused = ref(false)
const reduceHeroMotion = ref(false)
const compactHero = ref(false)
let heroTimer: number | undefined
let heroMotionQuery: MediaQueryList | undefined
let compactHeroQuery: MediaQueryList | undefined

const stopHeroAutoplay = () => {
  if (!heroTimer) return
  clearInterval(heroTimer)
  heroTimer = undefined
}

const advanceHero = () => {
  activeHeroSlide.value = (activeHeroSlide.value + 1) % heroSlides.length
}

const startHeroAutoplay = () => {
  stopHeroAutoplay()
  if (heroPaused.value || reduceHeroMotion.value || compactHero.value || document.hidden) return
  heroTimer = window.setInterval(advanceHero, HERO_SLIDE_DURATION)
}

const selectHeroSlide = (index: number) => {
  activeHeroSlide.value = index
  startHeroAutoplay()
}

const toggleHeroAutoplay = () => {
  heroPaused.value = !heroPaused.value
}

const handleHeroVisibility = () => {
  if (document.hidden) stopHeroAutoplay()
  else startHeroAutoplay()
}

const handleMotionPreference = () => {
  reduceHeroMotion.value = Boolean(heroMotionQuery?.matches)
  startHeroAutoplay()
}

const handleCompactHero = () => {
  compactHero.value = Boolean(compactHeroQuery?.matches)
  if (compactHero.value) activeHeroSlide.value = 0
  startHeroAutoplay()
}

watch(heroPaused, (paused) => {
  if (paused) stopHeroAutoplay()
  else startHeroAutoplay()
})

onMounted(() => {
  heroMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  compactHeroQuery = window.matchMedia('(max-width: 639px)')
  reduceHeroMotion.value = heroMotionQuery.matches
  compactHero.value = compactHeroQuery.matches
  heroMotionQuery.addEventListener('change', handleMotionPreference)
  compactHeroQuery.addEventListener('change', handleCompactHero)
  document.addEventListener('visibilitychange', handleHeroVisibility)
  startHeroAutoplay()
})

onBeforeUnmount(() => {
  stopHeroAutoplay()
  heroMotionQuery?.removeEventListener('change', handleMotionPreference)
  compactHeroQuery?.removeEventListener('change', handleCompactHero)
  document.removeEventListener('visibilitychange', handleHeroVisibility)
})

const capabilityFacts = [
  { value: '50–200 mm', label: 'Độ dày panel EPS' },
  { value: '14–25 kg/m³', label: 'Dải tỷ trọng lựa chọn' },
  { value: 'Inox 304', label: 'Cửa theo quy cách' },
  { value: 'Toàn quốc', label: 'Khu vực hỗ trợ' },
]

const principles = [
  { index: '01', title: 'Hiểu điều kiện vận hành', text: 'Bắt đầu từ nhiệt độ, mặt bằng, loại hàng và tần suất sử dụng thực tế.' },
  { index: '02', title: 'Chọn vừa đủ, đúng chỗ', text: 'Độ dày, tỷ trọng, cửa và phụ kiện được đối chiếu như một hệ hoàn chỉnh.' },
  { index: '03', title: 'Xác nhận trước khi cung cấp', text: 'Quy cách, số lượng và tiến độ được làm rõ trước bước báo giá hoặc triển khai.' },
]

usePageSeo({
  title: 'Tấm panel cách nhiệt kho lạnh, phòng sạch',
  description: 'Thái Thanh cung cấp tấm panel EPS cách nhiệt 50–200 mm, cửa kho lạnh Inox 304 và phụ kiện cho kho lạnh, phòng sạch, nhà xưởng trên toàn quốc.',
  path: '/',
})
</script>

<template>
  <div>
    <section class="home-hero relative isolate min-h-[36rem] overflow-hidden bg-panel-black text-white sm:min-h-[100svh]">
      <img
        v-for="(slide, index) in heroSlides"
        :key="slide.image"
        :src="slide.image"
        :srcset="slide.imageSrcset"
        :width="slide.width"
        :height="slide.height"
        :alt="slide.alt"
        :fetchpriority="index === 0 ? 'high' : undefined"
        :loading="index === 0 ? 'eager' : 'lazy'"
        sizes="100vw"
        decoding="async"
        class="home-hero-slide absolute inset-0 -z-20 h-full w-full object-cover"
        :class="[
          index === activeHeroSlide ? 'home-hero-slide-active' : '',
          index === 1 ? 'object-[62%_50%]' : index === 2 ? 'object-[68%_50%]' : 'object-center',
        ]"
        :aria-hidden="index !== activeHeroSlide"
      >
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,23,20,0.9)_0%,rgba(17,23,20,0.72)_52%,rgba(17,23,20,0.28)_100%)] sm:bg-[linear-gradient(90deg,rgba(17,23,20,0.84)_0%,rgba(17,23,20,0.62)_42%,rgba(17,23,20,0.16)_78%,rgba(17,23,20,0.03)_100%)]" aria-hidden="true" />
      <div class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-panel-black/65 to-transparent" aria-hidden="true" />

      <div class="container-site flex min-h-[34rem] flex-col justify-between pb-8 pt-20 sm:min-h-[100svh] sm:pb-14 sm:pt-36 lg:pb-16 lg:pt-40">
        <div class="home-hero-copy max-w-3xl">
          <p class="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/78 sm:gap-3 sm:tracking-[0.2em]">
            <span class="h-px w-6 bg-[#d79068] sm:w-8" aria-hidden="true" />
            Panel EPS 50–200 mm · Có bán lẻ
          </p>
          <h1 class="mt-4 max-w-[15ch] text-balance text-[2.4rem] font-semibold leading-[1] tracking-[-0.05em] text-white min-[360px]:text-[2.65rem] sm:mt-7 sm:max-w-[12ch] sm:text-7xl sm:leading-[0.98] lg:text-[5.4rem] xl:text-[6.2rem]">
            Panel cách nhiệt, cửa và phụ kiện kho lạnh.
          </h1>
          <p class="mt-4 max-w-xl text-base leading-7 text-white/82 sm:mt-7 sm:text-lg sm:leading-8">
            Gửi kích thước, số lượng và nơi giao. Thái Thanh đối chiếu quy cách để báo giá. Tiếp nhận yêu cầu toàn quốc.
          </p>

          <div class="mt-5 grid grid-cols-2 gap-2.5 sm:mt-9 sm:flex sm:items-center sm:gap-3">
            <a
              v-if="companyContact.zaloHref"
              :href="companyContact.zaloHref"
              target="_blank"
              rel="noopener noreferrer"
              class="btn col-span-2 gap-3 bg-[#0876e8] px-5 text-white shadow-elevated hover:bg-[#0561c2] sm:col-auto sm:px-6"
              data-hero-action="zalo"
            >
              Nhắn Zalo nhận báo giá
              <span aria-hidden="true">↗</span>
            </a>
            <a :href="companyContact.phoneHref" class="btn gap-2 border border-white/32 bg-white px-3 text-panel-black hover:bg-[#d79068] hover:text-white sm:px-5" data-hero-action="phone">
              Gọi {{ companyContact.phoneDisplay }}
            </a>
            <NuxtLink to="/products#retail-products" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-3 text-sm font-semibold text-white hover:bg-white/10 sm:border-0 sm:px-2">
              Xem sản phẩm
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>

          <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/18 pt-3 text-[11px] font-semibold text-white/72 sm:mt-10 sm:gap-x-7 sm:gap-y-3 sm:pt-5 sm:text-xs">
            <span>✓ Có bán lẻ</span>
            <span>✓ Quy cách rõ ràng</span>
            <span>✓ Tư vấn theo nhu cầu</span>
          </div>
        </div>

        <div class="hidden flex-col gap-5 sm:flex lg:flex-row lg:items-end lg:justify-between">
          <dl class="grid gap-px overflow-hidden border border-white/16 bg-white/14 backdrop-blur-sm sm:grid-cols-3 lg:w-[46rem]">
            <div class="bg-panel-black/36 p-4 sm:p-5">
              <dt class="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">Độ dày</dt>
              <dd class="mt-2 font-mono text-sm font-bold text-white">50—200 mm</dd>
            </div>
            <div class="bg-panel-black/36 p-4 sm:p-5">
              <dt class="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">Tỷ trọng</dt>
              <dd class="mt-2 font-mono text-sm font-bold text-white">14—25 kg/m³</dd>
            </div>
            <div class="bg-panel-black/36 p-4 sm:p-5">
              <dt class="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">Cửa</dt>
              <dd class="mt-2 font-mono text-sm font-bold text-white">Inox 304</dd>
            </div>
          </dl>

          <div class="flex items-center gap-3 rounded-full border border-white/16 bg-panel-black/30 px-3 py-2 backdrop-blur-md" aria-label="Điều khiển ảnh trình chiếu">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.label"
              type="button"
              class="group flex min-h-8 items-center gap-2 rounded-full px-2 text-[10px] font-bold text-white/55 transition-colors hover:text-white focus-visible:text-white"
              :class="index === activeHeroSlide ? 'text-white' : ''"
              :aria-label="`Xem ảnh: ${slide.label}`"
              :aria-current="index === activeHeroSlide ? 'true' : undefined"
              @click="selectHeroSlide(index)"
            >
              <span>0{{ index + 1 }}</span>
              <span class="relative block h-px w-7 overflow-hidden bg-white/25 sm:w-10">
                <span
                  v-if="index === activeHeroSlide"
                  :key="activeHeroSlide"
                  class="hero-progress-fill absolute inset-0 origin-left bg-white"
                  :class="heroPaused ? 'hero-progress-paused' : ''"
                />
              </span>
            </button>
            <button
              type="button"
              class="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-xs text-white transition hover:border-white hover:bg-white hover:text-panel-black"
              :aria-label="heroPaused ? 'Tiếp tục trình chiếu' : 'Tạm dừng trình chiếu'"
              :aria-pressed="heroPaused"
              @click="toggleHeroAutoplay"
            >
              <span aria-hidden="true">{{ heroPaused ? '▶' : 'Ⅱ' }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-panel-line bg-white" aria-labelledby="quick-product-heading">
      <div class="container-site py-9 sm:py-12">
        <div class="flex items-end justify-between gap-5">
          <div>
            <p class="section-kicker">Bạn đang cần gì?</p>
            <h2 id="quick-product-heading" class="mt-3 text-2xl font-semibold tracking-[-0.03em] text-panel-black sm:text-3xl">
              Chọn nhanh nhóm sản phẩm
            </h2>
          </div>
          <NuxtLink to="/products" class="hidden min-h-11 items-center text-sm font-semibold text-[#874a2d] sm:inline-flex">
            Xem tất cả →
          </NuxtLink>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4" data-quick-product-grid>
          <NuxtLink
            v-for="choice in quickProductChoices"
            :key="choice.href"
            :to="choice.href"
            class="group flex min-h-32 flex-col justify-between rounded-2xl border border-panel-line bg-panel-ivory p-4 transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-[#c9825b] hover:shadow-soft sm:min-h-36 sm:p-5"
          >
            <span class="font-mono text-xs font-bold text-[#9f5f42]">{{ choice.index }}</span>
            <span>
              <strong class="block text-base leading-tight tracking-[-0.02em] text-panel-black sm:text-lg">{{ choice.title }}</strong>
              <span class="mt-2 block text-xs leading-5 text-neutral-600 sm:text-sm">{{ choice.note }}</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="border-b border-panel-line bg-[#f4f1eb] text-panel-black">
      <div class="container-site grid gap-7 py-9 sm:gap-10 sm:py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-16">
        <div data-reveal="left">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f5f42]">Thông tin để chọn nhanh</p>
          <h2 class="mt-3 max-w-md text-2xl font-semibold leading-tight tracking-[-0.035em] text-panel-black sm:mt-4 sm:text-4xl">
            Quy cách chính, nhìn là hiểu.
          </h2>
        </div>
        <dl data-reveal data-reveal-delay="80" class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#d7cec3] shadow-[0_16px_45px_rgba(28,33,30,0.06)]">
          <div v-for="fact in capabilityFacts" :key="fact.label" class="min-h-24 bg-white/85 p-4 sm:min-h-28 sm:p-6">
            <dt class="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500 sm:tracking-[0.16em]">{{ fact.label }}</dt>
            <dd class="mt-3 text-lg font-semibold tracking-[-0.025em] text-panel-black sm:mt-4 sm:text-2xl">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section bg-panel-ivory">
      <div class="container-site">
        <div data-reveal class="max-w-4xl sm:mx-auto sm:text-center">
          <p class="section-kicker sm:justify-center">Sản phẩm cốt lõi</p>
          <h2 class="mt-4 text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-panel-black sm:mt-5 sm:text-5xl lg:text-6xl">
            Hai nhóm chính, đủ cho phần lớn nhu cầu.
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-7 text-neutral-600 sm:mx-auto sm:mt-6 sm:leading-8">
            Xem nhanh quy cách panel EPS, cửa kho lạnh và phụ kiện đi kèm trước khi gửi yêu cầu báo giá.
          </p>
        </div>

        <div class="mt-8 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-12">
          <NuxtLink
            v-for="(family, index) in productFamilies"
            :key="family.id"
            :to="productFamilyDestinations[family.id] || '/products'"
            data-reveal
            :data-reveal-delay="index * 80"
            class="editorial-product group overflow-hidden rounded-3xl bg-white shadow-soft sm:rounded-[2rem]"
            :class="index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'"
          >
            <div data-card-media class="relative aspect-[16/10] overflow-hidden bg-panel-cream" :class="index === 0 ? 'sm:aspect-[7/6]' : 'sm:aspect-[5/6]'">
              <img
                :src="family.image"
                :srcset="family.imageSrcset"
                :width="family.imageWidth"
                :height="family.imageHeight"
                :alt="family.imageAlt"
                sizes="(min-width: 1024px) 55vw, 100vw"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover"
              >
              <span class="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-panel-black sm:left-7 sm:top-7 sm:tracking-[0.16em]">
                0{{ index + 1 }} · {{ family.eyebrow }}
              </span>
            </div>
            <div class="p-5 sm:p-8">
              <div class="flex items-start justify-between gap-5">
                <div>
                  <h3 class="text-2xl font-semibold tracking-[-0.03em] text-panel-black sm:text-3xl">{{ family.name }}</h3>
                  <p class="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:mt-4 sm:leading-7">{{ family.summary }}</p>
                </div>
                <span class="editorial-product-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full border border-panel-line text-lg text-panel-black" aria-hidden="true">↗</span>
              </div>
              <div class="mt-5 flex flex-wrap gap-2 sm:mt-6">
                <span v-for="application in family.applications.slice(0, 4)" :key="application" class="rounded-full bg-panel-frost px-3 py-2 text-[11px] font-semibold text-neutral-700">
                  {{ application }}
                </span>
              </div>
              <span class="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#8d5437] sm:mt-7 sm:text-[11px] sm:tracking-[0.16em]">
                Mở danh mục chi tiết
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <StaticMediaShowcase
      poster="/images/insulation/cold-room-editorial.jpg"
      poster-srcset="/images/insulation/cold-room-editorial-640.webp 640w, /images/insulation/cold-room-editorial-960.webp 960w, /images/insulation/cold-room-editorial.jpg 1672w"
      poster-alt="Minh họa hành lang kho lạnh hoàn thiện bằng panel EPS và cửa Inox"
    />

    <section class="section bg-white">
      <div class="container-site">
        <div data-reveal class="grid gap-5 border-b border-panel-line pb-7 sm:gap-8 sm:pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p class="section-kicker">Ứng dụng</p>
            <p class="mt-3 text-sm text-neutral-500 sm:mt-5">04 nhóm nhu cầu phổ biến</p>
          </div>
          <div>
            <h2 class="max-w-4xl text-balance text-[1.75rem] font-semibold leading-tight tracking-[-0.035em] text-panel-black sm:text-4xl lg:text-5xl">
              Chọn theo môi trường sử dụng thực tế.
            </h2>
          </div>
        </div>

        <div class="divide-y divide-panel-line">
          <NuxtLink
            v-for="(solution, index) in solutions"
            :key="solution.id"
            :to="solutionDestinations[solution.id] || `/solutions#${solution.id}`"
            data-reveal
            :data-reveal-delay="index * 50"
            class="solution-row group grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 gap-y-1 py-5 md:grid-cols-[4rem_1fr_0.75fr_auto] md:gap-7 md:py-7 lg:py-9"
          >
            <span class="font-mono text-sm font-bold text-accent-steel">{{ solution.index }}</span>
            <h3 class="text-lg font-semibold tracking-[-0.02em] text-panel-black sm:text-2xl">{{ solution.name }}</h3>
            <p class="col-start-2 text-sm text-neutral-500 md:col-start-auto">{{ solution.temperature }}</p>
            <span class="solution-row-arrow grid h-11 w-11 place-items-center rounded-full border border-panel-line text-panel-black" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section bg-panel-cream">
      <div class="container-site">
        <div data-reveal class="max-w-4xl">
          <p class="section-kicker">Cách phối hợp</p>
          <h2 class="mt-4 text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-panel-black sm:mt-5 sm:text-5xl lg:text-6xl">
            Đo trước. Chọn đúng. Chốt rõ.
          </h2>
        </div>

        <div class="mt-8 grid gap-px overflow-hidden rounded-3xl bg-panel-line sm:mt-12 md:grid-cols-3">
          <article v-for="(principle, index) in principles" :key="principle.index" data-reveal :data-reveal-delay="index * 70" class="bg-panel-ivory p-5 sm:min-h-72 sm:p-8">
            <p class="font-mono text-sm font-bold text-accent-lime">{{ principle.index }}</p>
            <h3 class="mt-5 text-xl font-semibold tracking-[-0.02em] text-panel-black sm:mt-20 sm:text-2xl">{{ principle.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-neutral-600 sm:mt-4 sm:leading-7">{{ principle.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section border-t border-panel-line bg-white">
      <div class="container-site">
        <div data-reveal class="grid gap-5 border-b border-panel-line pb-7 sm:gap-7 sm:pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p class="section-kicker">Kiến thức tấm cách nhiệt</p>
            <p class="mt-3 text-sm leading-6 text-neutral-500 sm:mt-5 sm:leading-7">Giải đáp theo từng nhu cầu tìm kiếm thực tế.</p>
          </div>
          <div>
            <h2 class="max-w-4xl text-balance text-[1.75rem] font-semibold leading-tight tracking-[-0.035em] text-panel-black sm:text-4xl lg:text-5xl">
              Hiểu nhanh trước khi hỏi giá panel EPS.
            </h2>
            <NuxtLink to="/posts" class="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-[#874a2d]">
              Xem toàn bộ bài viết
              <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2">
          <NuxtLink
            v-for="(post, index) in featuredPosts.slice(0, 2)"
            :key="post.slug"
            :to="`/posts/${post.slug}`"
            data-reveal
            :data-reveal-delay="index * 60"
            class="interactive-card group grid overflow-hidden rounded-2xl border border-panel-line bg-panel-ivory sm:grid-cols-[10rem_1fr]"
          >
            <div data-card-media class="aspect-[16/10] overflow-hidden bg-neutral-100 sm:aspect-auto">
              <img
                :src="post.image"
                :srcset="post.imageSrcset"
                :width="post.imageWidth"
                :height="post.imageHeight"
                :alt="post.imageAlt"
                sizes="(min-width: 768px) 160px, 100vw"
                class="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              >
            </div>
            <div class="p-5 sm:p-6">
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">{{ post.eyebrow }}</p>
              <h3 class="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em] text-panel-black group-hover:text-[#874a2d]">{{ post.title }}</h3>
              <p class="mt-3 line-clamp-2 text-sm leading-7 text-neutral-600">{{ post.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <StaticContactBand />
  </div>
</template>
