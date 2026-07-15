<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)
const pageTitle = computed(() => isNotFound.value ? 'Không tìm thấy trang' : 'Đã xảy ra lỗi')
const pageDescription = computed(() => isNotFound.value
  ? 'Trang bạn đang tìm có thể đã được đổi địa chỉ hoặc không còn tồn tại.'
  : 'Website đang gặp sự cố tạm thời. Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.')

useHead({
  htmlAttrs: { lang: 'vi' },
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  robots: 'noindex, nofollow',
})

const returnHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-panel-ivory text-panel-black">
    <header class="border-b border-panel-line">
      <div class="container-site flex min-h-[4.75rem] items-center">
        <button type="button" class="group flex items-center text-left" aria-label="Về trang chủ Thái Thanh Co., Ltd" @click="returnHome">
          <img
            src="/images/brand/thai-thanh-logo-transparent-480.png"
            srcset="/images/brand/thai-thanh-logo-transparent-480.png 479w, /images/brand/thai-thanh-logo-transparent.png 898w"
            sizes="128px"
            width="479"
            height="325"
            alt="Logo Thái Thanh Co., Ltd"
            class="h-auto w-32 transition group-hover:opacity-85"
          >
        </button>
      </div>
    </header>

    <main class="container-site grid min-h-[calc(100vh-4.75rem)] items-center py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
      <div class="font-mono text-[clamp(6rem,18vw,13rem)] font-semibold leading-none text-emerald-800/15" aria-hidden="true">
        {{ statusCode }}
      </div>

      <section class="max-w-2xl border-t-4 border-accent-lime bg-white p-7 shadow-sm sm:p-10">
        <p class="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Thái Thanh Panel / {{ statusCode }}</p>
        <h1 class="mt-4 text-balance text-4xl font-semibold leading-tight sm:text-5xl">{{ pageTitle }}</h1>
        <p class="mt-5 max-w-xl text-base leading-8 text-neutral-600">{{ pageDescription }}</p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" class="btn-primary" @click="returnHome">Về trang chủ</button>
          <a href="/contact" class="btn-secondary">Liên hệ hỗ trợ</a>
        </div>

        <nav v-if="isNotFound" class="mt-8 border-t border-panel-line pt-6" aria-label="Liên kết gợi ý">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent-steel">Bạn có thể tiếp tục tại</p>
          <div class="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-emerald-800">
            <a href="/solutions" class="py-2 hover:underline">Giải pháp</a>
            <a href="/products" class="py-2 hover:underline">Sản phẩm</a>
            <a href="/posts" class="py-2 hover:underline">Bài viết</a>
          </div>
        </nav>
      </section>
    </main>
  </div>
</template>
