<script setup lang="ts">
import { useSiteContent } from '~/composables/useSiteContent'

const route = useRoute()
const { content } = useSiteContent()

const post = computed(() => content.value.posts.find(item => item.slug === route.params.slug && item.published))
const paragraphs = computed(() => post.value?.body
  .split(/\n{2,}/)
  .map(item => item.trim())
  .filter(Boolean) || [])
const formatPostDate = (date: string) => new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${date}T00:00:00Z`))

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Không tìm thấy bài viết',
  })
}

usePageSeo({
  title: () => post.value!.title,
  description: () => post.value!.summary,
  path: () => `/posts/${post.value!.slug}`,
  image: () => post.value!.image,
  imageAlt: () => post.value!.imageAlt,
  type: 'article',
  article: {
    publishedTime: () => post.value!.date,
    section: () => post.value!.eyebrow,
    tags: () => post.value!.tags,
  },
})
</script>

<template>
  <div>
    <article v-if="post" class="bg-white">
      <section class="bg-panel-black text-white">
        <div class="container-site grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:py-18">
          <div>
            <NuxtLink to="/posts" class="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.2em] text-accent-lime">Bài viết</NuxtLink>
            <p class="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
              {{ post.eyebrow }} /
              <time :datetime="post.date">{{ formatPostDate(post.date) }}</time>
            </p>
            <h1 class="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">{{ post.title }}</h1>
            <p class="mt-5 max-w-2xl text-base leading-8 text-emerald-50">{{ post.summary }}</p>
          </div>
          <div class="overflow-hidden border border-white/15">
            <img
              :src="post.image"
              :srcset="post.imageSrcset"
              :width="post.imageWidth"
              :height="post.imageHeight"
              :alt="post.imageAlt"
              sizes="(min-width: 1024px) 50vw, 100vw"
              class="aspect-[16/10] h-full w-full object-cover"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section class="section bg-white">
        <div class="container-site grid gap-10 lg:grid-cols-[14rem_minmax(0,48rem)]">
          <aside>
            <div class="sticky top-28 flex flex-wrap gap-2 lg:block lg:space-y-2">
              <span v-for="tag in post.tags" :key="tag" class="inline-block border border-panel-line bg-panel-frost px-3 py-2 text-xs font-semibold text-emerald-800">
                {{ tag }}
              </span>
            </div>
          </aside>
          <div class="text-lg leading-9 text-neutral-700">
            <p v-for="paragraph in paragraphs" :key="paragraph" class="mb-6">{{ paragraph }}</p>
          </div>
        </div>
      </section>
    </article>

    <section v-else class="section bg-white">
      <div class="container-site max-w-2xl">
        <p class="section-kicker">Bài viết</p>
        <h1 class="mt-3 text-3xl font-semibold text-panel-black">Chưa tìm thấy bài viết.</h1>
        <p class="mt-4 text-sm leading-7 text-neutral-600">Bài viết có thể chưa được xuất bản hoặc đường dẫn đã thay đổi.</p>
        <NuxtLink to="/posts" class="btn-primary mt-6">Quay lại danh sách</NuxtLink>
      </div>
    </section>
  </div>
</template>
