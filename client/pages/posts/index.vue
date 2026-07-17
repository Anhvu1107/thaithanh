<script setup lang="ts">
import { useSiteContent } from '~/composables/useSiteContent'

const { content } = useSiteContent()
const posts = computed(() => content.value.posts.filter(post => post.published))
const formatPostDate = (date: string) => new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${date}T00:00:00Z`))

usePageSeo({
  title: 'Kiến thức tấm cách nhiệt, panel EPS và kho lạnh',
  description: 'Hướng dẫn từ Tấm cách nhiệt Thái Thanh về panel EPS, báo giá, quy cách, độ dày, kho lạnh, cửa Inox 304 và phụ kiện U/V.',
  path: '/posts',
  webPageType: 'CollectionPage',
  breadcrumbs: [
    { name: 'Bài viết', path: '/posts' },
  ],
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Bài viết"
      title="Thông tin kỹ thuật giúp chuẩn bị yêu cầu công trình."
      description="Tham khảo cách chuẩn bị thông tin về panel, kho lạnh, phòng sạch và công trình lắp ghép. Thông số cuối cùng cần được xác nhận theo điều kiện vận hành thực tế."
      image="/images/insulation/eps-panel-step-joint-editorial.jpg"
      image-alt="Cấu tạo panel cách nhiệt"
    />

    <section class="section bg-white">
      <div class="container-site">
        <div v-if="posts.length" class="grid gap-px border border-panel-line bg-panel-line md:grid-cols-2">
          <NuxtLink
            v-for="(post, index) in posts"
            :key="post.id"
            :to="`/posts/${post.slug}`"
            data-reveal
            :data-reveal-delay="index * 70"
            class="interactive-card group bg-panel-ivory"
          >
            <div data-card-media class="aspect-[16/10] overflow-hidden bg-neutral-100">
              <img
                :src="post.image"
                :srcset="post.imageSrcset"
                :width="post.imageWidth"
                :height="post.imageHeight"
                :alt="post.imageAlt"
                sizes="(min-width: 768px) 50vw, 100vw"
                class="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="p-5 sm:p-6">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                {{ post.eyebrow }} /
                <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
              </p>
              <h2 class="mt-3 text-2xl font-semibold leading-tight text-panel-black">{{ post.title }}</h2>
              <p class="mt-4 text-sm leading-7 text-neutral-600">{{ post.summary }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span v-for="tag in post.tags" :key="tag" class="border border-panel-line bg-white px-3 py-2 text-xs font-semibold text-emerald-800">{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-else class="border border-dashed border-panel-line bg-panel-frost p-8 text-center">
          <h2 class="text-xl font-semibold text-panel-black">Chưa có bài viết được xuất bản.</h2>
          <p class="mt-3 text-sm text-neutral-600">Nội dung mới sẽ được cập nhật trong thời gian tới.</p>
        </div>
      </div>
    </section>

    <StaticContactBand />
  </div>
</template>
