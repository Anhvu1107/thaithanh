<script setup lang="ts">
interface SeoLandingFeature {
  title: string
  description: string
  points: string[]
}

interface SeoLandingCheck {
  label: string
  value: string
  note?: string
}

interface SeoLandingLink {
  eyebrow: string
  title: string
  description: string
  href: string
}

interface SeoLandingProps {
  eyebrow: string
  title: string
  description: string
  heroImage: string
  heroImageSrcset?: string
  heroImageAlt: string
  introEyebrow: string
  introTitle: string
  introText: string
  features: SeoLandingFeature[]
  selectionTitle: string
  selectionDescription: string
  checks: SeoLandingCheck[]
  relatedTitle: string
  relatedDescription: string
  relatedLinks: SeoLandingLink[]
  caution?: string
  contactTitle: string
  contactDescription: string
}

const props = defineProps<SeoLandingProps>()
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)
const phoneLabel = computed(() => `Gọi ${companyContact.value.phoneDisplay}`)
</script>

<template>
  <div class="bg-[#f7f6f2] text-[#242421]">
    <StaticPageHero
      :eyebrow="props.eyebrow"
      :title="props.title"
      :description="props.description"
      :image="props.heroImage"
      :image-srcset="props.heroImageSrcset"
      :image-alt="props.heroImageAlt"
      primary-label="Nhắn Zalo nhận tư vấn"
      :primary-href="companyContact.zaloHref || '/contact#quick-contact-form'"
      :secondary-label="phoneLabel"
      :secondary-href="companyContact.phoneHref"
    />

    <nav aria-label="Đường dẫn trang" class="border-b border-[#ddd6cc] bg-white">
      <div class="container-site flex min-h-12 items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-semibold text-[#625a52]">
        <NuxtLink to="/" class="inline-flex min-h-11 items-center hover:text-[#874a2d]">Trang chủ</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink to="/solutions" class="inline-flex min-h-11 items-center hover:text-[#874a2d]">Giải pháp</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page" class="text-[#292926]">{{ props.eyebrow }}</span>
      </div>
    </nav>

    <main>
      <section class="border-b border-[#d8cfc4] bg-white">
        <div class="container-site grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:py-20">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">{{ props.introEyebrow }}</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#20211f] sm:text-5xl">{{ props.introTitle }}</h2>
          </div>
          <div data-reveal data-reveal-delay="80" class="max-w-3xl lg:justify-self-end">
            <p class="text-base leading-8 text-[#625d56] sm:text-lg sm:leading-9">{{ props.introText }}</p>
            <div class="mt-7 flex flex-wrap gap-2.5">
              <NuxtLink to="/products/panel-eps" class="inline-flex min-h-11 items-center rounded-full border border-[#cfc4b8] bg-[#f7f3ed] px-4 text-xs font-bold text-[#70442f] hover:border-[#874a2d] hover:bg-white">
                Xem panel EPS
                <span class="ml-2" aria-hidden="true">→</span>
              </NuxtLink>
              <NuxtLink to="/contact#quick-contact-form" class="inline-flex min-h-11 items-center rounded-full border border-[#20211f] bg-[#20211f] px-4 text-xs font-bold text-white hover:bg-[#874a2d]">
                Gửi kích thước nhận báo giá
                <span class="ml-2" aria-hidden="true">↗</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-[#d8cfc4] bg-[#f7f3ed]">
        <div class="container-site py-12 sm:py-16 lg:py-20">
          <header data-reveal class="max-w-3xl">
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Chọn theo nhu cầu</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#20211f] sm:text-5xl">Cùng một hệ panel, mỗi công trình cần một cách chốt khác nhau.</h2>
          </header>

          <div class="mt-8 grid gap-4 lg:grid-cols-3">
            <article
              v-for="(feature, index) in props.features"
              :key="feature.title"
              data-reveal
              :data-reveal-delay="Math.min(index * 70, 140)"
              class="flex min-w-0 flex-col rounded-[1.35rem] border border-[#ded6cd] bg-white p-5 shadow-[0_14px_40px_rgba(63,52,42,0.06)] sm:p-7"
            >
              <span class="font-mono text-xs font-bold text-[#874a2d]">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="mt-5 text-2xl font-semibold leading-tight text-[#292926]">{{ feature.title }}</h3>
              <p class="mt-4 text-sm leading-7 text-[#625d56]">{{ feature.description }}</p>
              <ul class="mt-6 grid gap-3 border-t border-[#e2dad1] pt-5">
                <li v-for="point in feature.points" :key="point" class="flex gap-3 text-sm leading-6 text-[#45423d]">
                  <span class="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#874a2d]" aria-hidden="true" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section class="border-b border-[#d8cfc4] bg-white">
        <div class="container-site py-12 sm:py-16 lg:py-20">
          <div class="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div data-reveal>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Đối chiếu trước khi đặt</p>
              <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#20211f] sm:text-5xl">{{ props.selectionTitle }}</h2>
              <p class="mt-5 text-sm leading-7 text-[#625d56] sm:text-base sm:leading-8">{{ props.selectionDescription }}</p>
              <NuxtLink to="/posts/chuan-bi-thong-tin-kho-lanh" class="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-[#874a2d] hover:text-[#292926]">
                Xem danh sách thông tin cần gửi
                <span class="ml-2" aria-hidden="true">→</span>
              </NuxtLink>
            </div>

            <div data-reveal data-reveal-delay="80" class="grid min-w-0 gap-3 sm:grid-cols-2">
              <div
                v-for="check in props.checks"
                :key="check.label"
                class="min-w-0 rounded-[1.15rem] border border-[#ddd4ca] bg-[#fbf9f5] p-5 sm:p-6"
              >
                <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ check.label }}</p>
                <p class="mt-3 break-words text-base font-semibold leading-7 text-[#292926]">{{ check.value }}</p>
                <p v-if="check.note" class="mt-2 text-xs leading-6 text-[#766e66]">{{ check.note }}</p>
              </div>
            </div>
          </div>

          <div v-if="props.caution" class="mt-8 rounded-[1.2rem] border border-[#ddc6b8] bg-[#fff8f3] p-5 sm:p-6">
            <p class="flex gap-3 text-sm leading-7 text-[#60483d]">
              <span class="mt-1 shrink-0 font-bold text-[#a45e3e]" aria-hidden="true">!</span>
              <span>{{ props.caution }}</span>
            </p>
          </div>
        </div>
      </section>

      <section class="border-b border-[#d8cfc4] bg-[#eee8e0]">
        <div class="container-site py-12 sm:py-16 lg:py-20">
          <header data-reveal class="grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Đọc tiếp và xem sản phẩm</p>
              <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#20211f] sm:text-5xl">{{ props.relatedTitle }}</h2>
            </div>
            <p class="max-w-2xl text-sm leading-7 text-[#625d56] lg:justify-self-end sm:text-base sm:leading-8">{{ props.relatedDescription }}</p>
          </header>

          <div class="mt-8 grid gap-4 md:grid-cols-2">
            <NuxtLink
              v-for="(link, index) in props.relatedLinks"
              :key="link.href"
              :to="link.href"
              data-reveal
              :data-reveal-delay="Math.min(index * 60, 180)"
              class="group min-w-0 rounded-[1.25rem] border border-[#d2c8bd] bg-white p-5 transition duration-300 hover:border-[#b98b70] hover:shadow-[0_18px_45px_rgba(63,52,42,0.09)] sm:p-6"
            >
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ link.eyebrow }}</p>
              <div class="mt-3 flex items-start justify-between gap-4">
                <h3 class="min-w-0 text-xl font-semibold leading-snug text-[#292926] group-hover:text-[#874a2d]">{{ link.title }}</h3>
                <span class="shrink-0 text-lg text-[#874a2d] transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
              <p class="mt-3 text-sm leading-7 text-[#625d56]">{{ link.description }}</p>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <StaticContactBand :title="props.contactTitle" :description="props.contactDescription" />
  </div>
</template>
