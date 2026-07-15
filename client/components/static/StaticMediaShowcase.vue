<script setup lang="ts">
withDefaults(defineProps<{
  videoSrc?: string
  poster: string
  posterAlt: string
}>(), {
  videoSrc: '',
})
</script>

<template>
  <section id="media-showcase" class="section scroll-mt-24 overflow-hidden bg-white">
    <div class="container-site">
      <div class="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div data-reveal="left">
          <p class="section-kicker">Không gian ứng dụng</p>
          <p class="mt-5 text-sm leading-7 text-neutral-500">Hình ảnh minh họa hệ panel và cửa Inox trong môi trường vận hành hoàn thiện.</p>
        </div>
        <h2 data-reveal class="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-panel-black sm:text-5xl lg:text-6xl">
          Không chỉ là từng tấm panel. Đó là một không gian vận hành hoàn chỉnh.
        </h2>
      </div>

      <figure data-reveal="media" class="media-showcase group mt-12 overflow-hidden rounded-[2rem] bg-[#ece8e1] shadow-[0_28px_80px_rgba(28,33,30,0.12)]">
        <div class="relative aspect-[16/10] overflow-hidden sm:aspect-[16/8]">
          <video
            v-if="videoSrc"
            class="media-showcase-asset absolute inset-0 h-full w-full object-cover"
            :poster="poster"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            aria-label="Video minh họa không gian panel cách nhiệt"
          >
            <source :src="videoSrc" type="video/mp4">
          </video>
          <img
            v-else
            :src="poster"
            :alt="posterAlt"
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
            class="media-showcase-asset absolute inset-0 h-full w-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-[#17201c]/55 via-transparent to-transparent" aria-hidden="true" />
          <div class="absolute left-5 top-5 inline-flex items-center gap-3 rounded-full border border-white/30 bg-[#17201c]/55 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:left-7 sm:top-7">
            <span class="h-2 w-2 rounded-full bg-[#d79068]" aria-hidden="true" />
            {{ videoSrc ? 'Video không gian' : 'Hình ảnh minh họa' }}
          </div>
        </div>

        <figcaption class="grid gap-7 bg-[#17201c] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:px-10">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#d79068]">Hệ thống đồng bộ</p>
            <p class="mt-3 max-w-2xl text-base leading-8 text-white/75">Panel, cửa, nẹp và chi tiết hoàn thiện cần được phối hợp theo cùng một mặt bằng và điều kiện sử dụng.</p>
          </div>
          <div class="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
            <span class="rounded-full border border-white/18 px-4 py-2.5">Bề mặt liền mạch</span>
            <span class="rounded-full border border-white/18 px-4 py-2.5">Chi tiết Inox</span>
            <span class="rounded-full border border-white/18 px-4 py-2.5">Dễ vệ sinh</span>
          </div>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
