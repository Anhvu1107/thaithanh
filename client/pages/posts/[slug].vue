<script setup lang="ts">
import { useSiteContent } from '~/composables/useSiteContent'

const route = useRoute()
const { content } = useSiteContent()

const post = computed(() => content.value.posts.find(item => item.slug === route.params.slug && item.published))
type PostContentBlock =
  | { type: 'heading', text: string }
  | { type: 'paragraph', text: string }
  | { type: 'ordered-list', items: string[] }

const contentBlocks = computed<PostContentBlock[]>(() => post.value?.body
  .split(/\n{2,}/)
  .map(item => item.trim())
  .filter(Boolean)
  .map((block): PostContentBlock => {
    if (block.startsWith('## ')) {
      return { type: 'heading', text: block.slice(3).trim() }
    }

    const lines = block.split('\n').map(line => line.trim()).filter(Boolean)
    if (lines.length > 1 && lines.every(line => /^\d+\.\s+/.test(line))) {
      return {
        type: 'ordered-list',
        items: lines.map(line => line.replace(/^\d+\.\s+/, '')),
      }
    }

    return { type: 'paragraph', text: block }
  }) || [])
const relatedPosts = computed(() => {
  if (!post.value) return []
  const currentTags = new Set(post.value.tags)

  return content.value.posts
    .filter(item => item.published && item.slug !== post.value!.slug)
    .map(item => ({
      ...item,
      sharedTags: item.tags.filter(tag => currentTags.has(tag)).length,
    }))
    .sort((left, right) => right.sharedTags - left.sharedTags || right.date.localeCompare(left.date))
    .slice(0, 3)
})
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
  breadcrumbs: [
    { name: 'Bài viết', path: '/posts' },
    { name: () => post.value!.title, path: () => `/posts/${post.value!.slug}` },
  ],
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
          <div>
            <div class="text-lg leading-9 text-neutral-700">
              <template v-for="(block, index) in contentBlocks" :key="`${block.type}-${index}`">
                <h2 v-if="block.type === 'heading'" class="mb-5 mt-10 text-2xl font-semibold leading-tight tracking-[-0.025em] text-panel-black first:mt-0 sm:text-3xl">
                  {{ block.text }}
                </h2>
                <ol v-else-if="block.type === 'ordered-list'" class="mb-7 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-[#874a2d]">
                  <li v-for="item in block.items" :key="item" class="pl-2">{{ item }}</li>
                </ol>
                <p v-else class="mb-6">{{ block.text }}</p>
              </template>
            </div>

            <nav aria-label="Nội dung sản phẩm liên quan" class="mt-10 border-t border-panel-line pt-8">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Xem thông tin sản phẩm</p>
              <div class="mt-4 grid gap-3 sm:grid-cols-3">
                <NuxtLink to="/products/panel-eps" class="inline-flex min-h-12 items-center justify-between rounded-xl border border-panel-line bg-panel-ivory px-4 text-sm font-semibold text-panel-black transition-colors hover:border-[#874a2d] hover:text-[#874a2d]">
                  Panel EPS cách nhiệt
                  <span aria-hidden="true">→</span>
                </NuxtLink>
                <NuxtLink to="/products/cua-kho-lanh" class="inline-flex min-h-12 items-center justify-between rounded-xl border border-panel-line bg-panel-ivory px-4 text-sm font-semibold text-panel-black transition-colors hover:border-[#874a2d] hover:text-[#874a2d]">
                  Cửa kho lạnh Inox 304
                  <span aria-hidden="true">→</span>
                </NuxtLink>
                <NuxtLink to="/products" class="inline-flex min-h-12 items-center justify-between rounded-xl border border-panel-line bg-panel-ivory px-4 text-sm font-semibold text-panel-black transition-colors hover:border-[#874a2d] hover:text-[#874a2d]">
                  Toàn bộ sản phẩm
                  <span aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </nav>

            <nav v-if="relatedPosts.length" aria-label="Bài viết liên quan" class="mt-10 border-t border-panel-line pt-8">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Tìm hiểu thêm</p>
              <h2 class="mt-3 text-2xl font-semibold tracking-[-0.025em] text-panel-black">Bài viết liên quan</h2>
              <div class="mt-5 grid gap-3">
                <NuxtLink
                  v-for="relatedPost in relatedPosts"
                  :key="relatedPost.slug"
                  :to="`/posts/${relatedPost.slug}`"
                  class="group grid gap-2 rounded-xl border border-panel-line bg-panel-ivory p-5 transition-colors hover:border-[#874a2d] sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{{ relatedPost.eyebrow }}</p>
                    <h3 class="mt-2 text-lg font-semibold leading-snug text-panel-black group-hover:text-[#874a2d]">{{ relatedPost.title }}</h3>
                  </div>
                  <span class="text-xl text-[#874a2d]" aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </nav>
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
