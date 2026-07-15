<script setup lang="ts">
const { content } = useSiteContent()
const productFamilies = computed(() => content.value.productFamilies)
const companyContact = computed(() => content.value.companyContact)

usePageSeo({
  title: 'Sản phẩm bán lẻ',
  description: 'Panel EPS dày 50–200 mm, phụ kiện U/V và cửa Inox 304 bán lẻ theo quy cách.',
  path: '/products',
  image: '/images/insulation/eps-panel.webp',
  imageAlt: 'Minh họa mặt cắt tấm panel EPS',
})
</script>

<template>
  <div class="bg-[#f7f6f2] text-[#242421]">
    <section class="relative isolate min-h-[34rem] overflow-hidden border-b border-[#d8cfc4] bg-panel-black text-white">
      <img
        src="/images/insulation/cold-door-editorial.jpg"
        width="1254"
        height="1254"
        alt="Minh họa cửa Inox 304 và vật liệu panel"
        class="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_50%]"
        decoding="async"
        fetchpriority="high"
      >
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(24,27,24,0.88)_0%,rgba(24,27,24,0.70)_44%,rgba(24,27,24,0.22)_78%,rgba(24,27,24,0.06)_100%)]" aria-hidden="true" />

      <div class="container-site flex min-h-[34rem] flex-col justify-between py-10 sm:py-14 lg:py-16">
        <div class="page-hero-marker flex items-center justify-between gap-6 border-b border-white/16 pb-5">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-white/68">Thái Thanh / Sản phẩm</p>
          <p class="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-white/48 sm:block">Panel · Phụ kiện · Cửa Inox</p>
        </div>

        <div class="page-hero-copy mt-12 max-w-4xl">
          <h1 class="max-w-4xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.025em] text-white sm:text-6xl lg:text-[5.25rem]">
            Sản phẩm panel, phụ kiện và cửa Inox.
          </h1>
          <p class="mt-7 max-w-xl text-base leading-8 text-white/74 sm:text-lg">
            Panel EPS, cửa Inox 304 và phụ kiện U/V cho công trình hoặc nhu cầu mua lẻ theo quy cách.
          </p>
          <div class="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#retail-products"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-panel-black transition-colors hover:bg-[#d79068] hover:text-white"
            >
              Khám phá sản phẩm
            </a>
            <NuxtLink
              to="/contact#quick-contact-form"
              class="inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-panel-black"
            >
              Gửi quy cách cần mua
            </NuxtLink>
          </div>
        </div>

        <nav class="mt-12 grid border border-white/16 bg-panel-black/34 backdrop-blur-sm sm:grid-cols-2" aria-label="Đi đến từng nhóm sản phẩm">
          <a
            v-for="(family, index) in productFamilies"
            :key="family.id"
            :href="`#${family.id}`"
            :aria-label="`Xem ${family.name}`"
            class="group flex min-h-24 items-center justify-between gap-5 border-b border-white/16 px-5 py-5 text-white transition-colors last:border-b-0 hover:bg-white/10 sm:min-h-28 sm:border-b-0 sm:first:border-r"
          >
            <span class="flex min-w-0 items-center gap-4">
              <span class="font-mono text-xs font-bold text-[#d79068]">0{{ index + 1 }}</span>
              <span class="min-w-0 text-lg font-semibold leading-tight sm:text-xl">{{ family.name }}</span>
            </span>
            <span class="shrink-0 text-xl transition-transform motion-safe:group-hover:translate-y-1" aria-hidden="true">↓</span>
          </a>
        </nav>
      </div>
    </section>

    <section id="retail-products" aria-label="Sản phẩm bán lẻ" class="scroll-mt-24">
      <div class="border-b border-[#d8cfc4] bg-[#f7f3ed]">
        <div data-reveal class="container-site flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a5c3b]">Danh mục bán lẻ</p>
          <p class="text-sm font-semibold text-[#514b45] sm:text-base">Panel, nẹp U/V và cửa Inox 304.</p>
        </div>
      </div>

      <article
        v-for="(family, index) in productFamilies"
        :id="family.id"
        :key="family.id"
        :aria-labelledby="`product-${family.id}-title`"
        class="scroll-mt-24 border-b border-[#d8cfc4]"
        :class="index % 2 ? 'bg-[#ece6de]' : 'bg-[#fbf9f5]'"
      >
        <div class="container-site py-14 sm:py-18 lg:py-24">
          <header data-reveal :data-reveal-delay="index * 70" class="grid gap-5 lg:grid-cols-[5rem_minmax(0,0.9fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-10">
            <p class="font-mono text-sm font-bold text-[#a9633f]" aria-hidden="true">0{{ index + 1 }}</p>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#9a5c3b]">{{ family.eyebrow }}</p>
              <h2 :id="`product-${family.id}-title`" class="mt-3 text-4xl font-semibold leading-[1.06] tracking-[-0.02em] text-[#20211f] sm:text-5xl lg:text-6xl">
                {{ family.name }}
              </h2>
            </div>
            <p class="max-w-xl text-base leading-8 text-[#625d56] lg:pb-1">{{ family.summary }}</p>
          </header>

          <figure data-reveal :data-reveal-delay="Math.min(index * 70 + 80, 220)" class="mt-10 bg-[#dfd6cc] p-2 sm:mt-12 sm:p-4 lg:mt-14">
            <img
              :src="family.image"
              :srcset="family.imageSrcset"
              :width="family.imageWidth"
              :height="family.imageHeight"
              :alt="family.imageAlt"
              sizes="(min-width: 1280px) 1216px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              class="aspect-[16/10] h-auto w-full object-cover sm:aspect-[16/9]"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
            >
          </figure>

          <div class="mt-10 grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div data-reveal :data-reveal-delay="Math.min(index * 70 + 100, 220)">
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b8177]">Phạm vi cung cấp</p>
              <ul class="mt-4 flex flex-wrap gap-2">
                <li
                  v-for="application in family.applications"
                  :key="application"
                  class="rounded-full border border-[#cfc4b8] bg-white/60 px-4 py-2 text-xs font-semibold text-[#514b45]"
                >
                  {{ application }}
                </li>
              </ul>

              <NuxtLink
                to="/contact#quick-contact-form"
                class="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#262724] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a9633f]"
                :aria-label="`Gửi quy cách ${family.name} để được xác nhận`"
              >
                Gửi quy cách để xác nhận
              </NuxtLink>
            </div>

            <div data-reveal :data-reveal-delay="Math.min(index * 70 + 140, 220)">
              <div class="flex items-end justify-between gap-5 border-b border-[#aaa096] pb-4">
                <h3 class="text-xl font-semibold text-[#242421] sm:text-2xl">Thông tin cần đối chiếu</h3>
                <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8177] sm:block">Xác nhận trước khi đặt</p>
              </div>

              <dl class="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                  v-for="spec in family.specifications"
                  :key="spec.label"
                  class="min-w-0 bg-white/65 p-5 sm:p-6"
                  :class="spec.value.length > 72 ? 'sm:col-span-2' : ''"
                >
                  <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a5c3b]">{{ spec.label }}</dt>
                  <dd class="mt-3 break-words text-base font-semibold leading-7 text-[#292926]">{{ spec.value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="bg-[#262724] text-[#f7f3ed]">
      <div data-reveal class="container-site grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center lg:py-16">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#d99a73]">Trao đổi trực tiếp</p>
          <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Có quy cách hoặc số lượng cụ thể?
          </h2>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-[#d8cfc4]">
            Gửi tên sản phẩm, kích thước và số lượng để Thái Thanh xác nhận khả năng cung cấp.
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <a
            :href="companyContact.phoneHref"
            class="inline-flex min-h-12 items-center justify-center rounded-full border border-[#81786f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-[#262724]"
          >
            Gọi {{ companyContact.phoneDisplay }}
          </a>
          <NuxtLink
            to="/contact#quick-contact-form"
            class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#b46d47] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#cf8358]"
          >
            Gửi yêu cầu
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
