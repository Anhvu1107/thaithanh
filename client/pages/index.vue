<script setup lang="ts">
const { content } = useSiteContent()
const productFamilies = computed(() => content.value.productFamilies)
const solutions = computed(() => content.value.solutions)

const HERO_SLIDE_DURATION = 6500
const heroSlides = [
  {
    image: '/images/insulation/cold-room-system-cutaway.jpg',
    alt: 'Minh họa cấu tạo đồng bộ vách, trần, nền và cửa kho lạnh',
    label: 'Hệ kho lạnh đồng bộ',
  },
  {
    image: '/images/insulation/eps-panel-editorial.jpg',
    alt: 'Minh họa cấu tạo tấm panel EPS',
    label: 'Panel EPS theo quy cách',
  },
  {
    image: '/images/insulation/cold-door-editorial.jpg',
    alt: 'Minh họa cửa Inox cho hệ kho lạnh',
    label: 'Cửa Inox 304',
  },
]

const activeHeroSlide = ref(0)
const heroPaused = ref(false)
const reduceHeroMotion = ref(false)
let heroTimer: number | undefined
let heroMotionQuery: MediaQueryList | undefined

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
  if (heroPaused.value || reduceHeroMotion.value || document.hidden) return
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

watch(heroPaused, (paused) => {
  if (paused) stopHeroAutoplay()
  else startHeroAutoplay()
})

onMounted(() => {
  heroMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceHeroMotion.value = heroMotionQuery.matches
  heroMotionQuery.addEventListener('change', handleMotionPreference)
  document.addEventListener('visibilitychange', handleHeroVisibility)
  startHeroAutoplay()
})

onBeforeUnmount(() => {
  stopHeroAutoplay()
  heroMotionQuery?.removeEventListener('change', handleMotionPreference)
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
  title: 'Giải pháp panel cách nhiệt',
  description: 'Panel EPS, cửa Inox 304 và phụ kiện U/V cho công trình hoặc nhu cầu mua lẻ từ Thái Thanh Panel.',
  path: '/',
})
</script>

<template>
  <div>
    <section class="home-hero relative isolate min-h-[100svh] overflow-hidden bg-panel-black text-white">
      <img
        v-for="(slide, index) in heroSlides"
        :key="slide.image"
        :src="slide.image"
        width="1672"
        height="941"
        :alt="slide.alt"
        :fetchpriority="index === 0 ? 'high' : undefined"
        :loading="index === 0 ? 'eager' : 'lazy'"
        decoding="async"
        class="home-hero-slide absolute inset-0 -z-20 h-full w-full object-cover"
        :class="[
          index === activeHeroSlide ? 'home-hero-slide-active' : '',
          index === 1 ? 'object-[62%_50%]' : index === 2 ? 'object-[68%_50%]' : 'object-center',
        ]"
        :aria-hidden="index !== activeHeroSlide"
      >
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,23,20,0.84)_0%,rgba(17,23,20,0.62)_42%,rgba(17,23,20,0.16)_78%,rgba(17,23,20,0.03)_100%)]" aria-hidden="true" />
      <div class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-panel-black/65 to-transparent" aria-hidden="true" />

      <div class="container-site flex min-h-[100svh] flex-col justify-between pb-28 pt-32 sm:pb-14 sm:pt-36 lg:pb-16 lg:pt-40">
        <div class="home-hero-copy max-w-3xl">
          <p class="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            <span class="h-px w-8 bg-[#d79068]" aria-hidden="true" />
            Uy tín, chất lượng tạo nên sự thành công
          </p>
          <h1 class="mt-7 max-w-[12ch] text-balance text-[3.3rem] font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.4rem] xl:text-[6.2rem]">
            Panel cách nhiệt Thái Thanh.
          </h1>
          <p class="mt-7 max-w-xl text-base leading-8 text-white/76 sm:text-lg">
            Panel EPS, cửa Inox 304 và phụ kiện U/V được lựa chọn theo điều kiện vận hành — không chỉ theo tên gọi hay đơn giá từng tấm.
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NuxtLink to="/contact#quick-contact-form" class="btn gap-3 bg-white px-6 text-panel-black shadow-elevated hover:bg-[#d79068] hover:text-white">
              Bắt đầu trao đổi
              <span aria-hidden="true">↗</span>
            </NuxtLink>
            <NuxtLink to="/products#retail-products" class="inline-flex min-h-12 items-center gap-3 px-3 text-sm font-semibold text-white/86 hover:text-white">
              Khám phá sản phẩm
              <span class="grid h-8 w-8 place-items-center rounded-full border border-white/28" aria-hidden="true">→</span>
            </NuxtLink>
          </div>

          <div class="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/18 pt-5 text-xs font-semibold text-white/62">
            <span>Có bán lẻ</span>
            <span>Quy cách rõ ràng</span>
            <span>Tư vấn theo thực tế</span>
          </div>
        </div>

        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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

    <section class="border-b border-panel-line bg-[#f4f1eb] text-panel-black">
      <div class="container-site grid gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-16">
        <div data-reveal="left">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9f5f42]">Thông tin có thể đối chiếu</p>
          <h2 class="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-panel-black sm:text-4xl">
            Ít lời hứa. Nhiều thông tin rõ ràng.
          </h2>
        </div>
        <dl data-reveal data-reveal-delay="80" class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#d7cec3] shadow-[0_16px_45px_rgba(28,33,30,0.06)]">
          <div v-for="fact in capabilityFacts" :key="fact.label" class="min-h-28 bg-white/85 p-5 sm:p-6">
            <dt class="text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-500">{{ fact.label }}</dt>
            <dd class="mt-4 text-xl font-semibold tracking-[-0.025em] text-panel-black sm:text-2xl">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <StaticMediaShowcase
      poster="/images/insulation/cold-room-editorial.jpg"
      poster-alt="Minh họa hành lang kho lạnh hoàn thiện bằng panel EPS và cửa Inox"
    />

    <section class="section bg-panel-ivory">
      <div class="container-site">
        <div data-reveal class="mx-auto max-w-4xl text-center">
          <p class="section-kicker justify-center">Sản phẩm cốt lõi</p>
          <h2 class="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-panel-black sm:text-5xl lg:text-6xl">
            Chọn ít hơn. Hiểu kỹ hơn.
          </h2>
          <p class="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-600">
            Thái Thanh tập trung vào những nhóm sản phẩm có thể trao đổi rõ về quy cách và nhu cầu sử dụng.
          </p>
        </div>

        <div class="mt-14 grid gap-6 lg:grid-cols-12">
          <NuxtLink
            v-for="(family, index) in productFamilies"
            :key="family.id"
            :to="`/products#${family.id}`"
            data-reveal
            :data-reveal-delay="index * 80"
            class="editorial-product group overflow-hidden rounded-[2rem] bg-white shadow-soft"
            :class="index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'"
          >
            <div data-card-media class="relative overflow-hidden bg-panel-cream" :class="index === 0 ? 'aspect-[7/6]' : 'aspect-[5/6]'">
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
              <span class="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-panel-black backdrop-blur sm:left-7 sm:top-7">
                0{{ index + 1 }} · {{ family.eyebrow }}
              </span>
            </div>
            <div class="p-6 sm:p-8">
              <div class="flex items-start justify-between gap-5">
                <div>
                  <h3 class="text-2xl font-semibold tracking-[-0.03em] text-panel-black sm:text-3xl">{{ family.name }}</h3>
                  <p class="mt-4 max-w-xl text-sm leading-7 text-neutral-600">{{ family.summary }}</p>
                </div>
                <span class="editorial-product-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full border border-panel-line text-lg text-panel-black" aria-hidden="true">↗</span>
              </div>
              <div class="mt-6 flex flex-wrap gap-2">
                <span v-for="application in family.applications.slice(0, 4)" :key="application" class="rounded-full bg-panel-frost px-3 py-2 text-[11px] font-semibold text-neutral-700">
                  {{ application }}
                </span>
              </div>
              <span class="mt-7 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8d5437]">
                Mở danh mục chi tiết
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-site">
        <div data-reveal class="grid gap-8 border-b border-panel-line pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p class="section-kicker">Ứng dụng</p>
            <p class="mt-5 text-sm text-neutral-500">04 nhóm nhu cầu phổ biến</p>
          </div>
          <div>
            <h2 class="max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-panel-black sm:text-4xl lg:text-5xl">
              Mỗi môi trường vận hành cần một cách phối hợp khác nhau.
            </h2>
          </div>
        </div>

        <div class="divide-y divide-panel-line">
          <NuxtLink
            v-for="(solution, index) in solutions"
            :key="solution.id"
            :to="`/solutions#${solution.id}`"
            data-reveal
            :data-reveal-delay="index * 50"
            class="solution-row group grid gap-4 py-7 md:grid-cols-[4rem_1fr_0.75fr_auto] md:items-center md:gap-7 lg:py-9"
          >
            <span class="font-mono text-sm font-bold text-accent-steel">{{ solution.index }}</span>
            <h3 class="text-xl font-semibold tracking-[-0.02em] text-panel-black sm:text-2xl">{{ solution.name }}</h3>
            <p class="text-sm text-neutral-500">{{ solution.temperature }}</p>
            <span class="solution-row-arrow grid h-11 w-11 place-items-center rounded-full border border-panel-line text-panel-black" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section bg-panel-cream">
      <div class="container-site">
        <div data-reveal class="max-w-4xl">
          <p class="section-kicker">Cách phối hợp</p>
          <h2 class="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-panel-black sm:text-5xl lg:text-6xl">
            Đo trước. Chọn đúng. Chốt rõ.
          </h2>
        </div>

        <div class="mt-12 grid gap-px overflow-hidden rounded-3xl bg-panel-line md:grid-cols-3">
          <article v-for="(principle, index) in principles" :key="principle.index" data-reveal :data-reveal-delay="index * 70" class="min-h-72 bg-panel-ivory p-7 sm:p-8">
            <p class="font-mono text-sm font-bold text-accent-lime">{{ principle.index }}</p>
            <h3 class="mt-20 text-xl font-semibold tracking-[-0.02em] text-panel-black sm:text-2xl">{{ principle.title }}</h3>
            <p class="mt-4 text-sm leading-7 text-neutral-600">{{ principle.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <StaticContactBand />
  </div>
</template>
