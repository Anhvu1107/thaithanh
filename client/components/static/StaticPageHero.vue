<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}>()
</script>

<template>
  <section class="relative isolate overflow-hidden border-b border-[#ddd6cc] bg-[#f4f1eb] text-[#1d211e]">
    <div class="pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden="true">
      <div class="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.7)_0%,transparent_48%,rgba(181,107,72,0.08)_100%)]" />
      <div class="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
    </div>

    <div class="container-site grid min-h-[36rem] lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:gap-12 xl:gap-20">
      <div class="page-hero-copy relative z-10 flex flex-col justify-center py-16 sm:py-20 lg:py-24">
        <p class="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9f5f42] sm:text-[11px]">
          <span class="h-px w-10 bg-[#b56b48]" aria-hidden="true" />
          {{ eyebrow }}
        </p>

        <h1 class="mt-7 max-w-[14ch] text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#171a18] sm:text-6xl lg:text-[4.4rem]">
          {{ title }}
        </h1>
        <p class="mt-7 max-w-xl text-base leading-8 text-neutral-600 sm:text-lg sm:leading-9">
          {{ description }}
        </p>

        <div v-if="primaryLabel || secondaryLabel" class="mt-9 flex flex-wrap gap-3">
          <a
            v-if="primaryLabel && primaryHref"
            :href="primaryHref"
            class="btn bg-[#1d211e] text-white shadow-[0_12px_30px_rgba(28,33,30,0.15)] hover:bg-[#a96343]"
          >
            {{ primaryLabel }}
            <span class="ml-2" aria-hidden="true">→</span>
          </a>
          <a
            v-if="secondaryLabel && secondaryHref"
            :href="secondaryHref"
            class="btn border border-[#cfc6bb] bg-white/60 text-[#1d211e] hover:border-[#1d211e] hover:bg-[#1d211e] hover:text-white"
          >
            {{ secondaryLabel }}
          </a>
        </div>

        <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#d7cfc4] pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 sm:gap-x-8">
          <span>Panel cách nhiệt</span>
          <span>Cửa Inox 304</span>
          <span>Phụ kiện đồng bộ</span>
        </div>
      </div>

      <div v-if="image" class="page-hero-media relative min-h-[24rem] overflow-hidden border-x border-[#d6cec3] bg-white sm:min-h-[30rem] lg:my-8 lg:min-h-0 lg:border">
        <img
          :src="image"
          :alt="imageAlt || ''"
          class="absolute inset-0 h-full w-full object-cover"
          width="1200"
          height="900"
          fetchpriority="high"
          decoding="async"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-[#1d211e]/20 via-transparent to-white/10" aria-hidden="true" />
        <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-5 border-t border-white/70 bg-white/85 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1d211e] backdrop-blur-md sm:px-6">
          <span>Tư vấn theo nhu cầu thực tế</span>
          <span class="h-2 w-2 shrink-0 rounded-full bg-[#b56b48] shadow-[0_0_0_5px_rgba(181,107,72,0.14)]" aria-hidden="true" />
        </div>
      </div>

      <div v-else class="page-hero-media relative hidden overflow-hidden border-x border-[#d6cec3] bg-white lg:my-8 lg:block lg:border" aria-hidden="true">
        <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(181,107,72,0.04)_0%,transparent_42%,rgba(181,107,72,0.13)_100%)]" />
        <div class="absolute left-[14%] top-[16%] h-[58%] w-[62%] border border-[#d6cec3]" />
        <div class="absolute bottom-[14%] right-[10%] h-[48%] w-[52%] border border-[#d6906e]/40" />
      </div>
    </div>
  </section>
</template>
