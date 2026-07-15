<script setup lang="ts">
import { retailProducts as staticRetailProducts } from '~/data/staticSite'

definePageMeta({
  validate: route => staticRetailProducts.some(item => item.slug === String(route.params.slug))
    || {
      statusCode: 404,
      statusMessage: 'Không tìm thấy sản phẩm',
    },
})

const route = useRoute()
const { content } = useSiteContent()

const product = computed(() => content.value.retailProducts.find(item => item.slug === route.params.slug))
const productIndex = computed(() => content.value.retailProducts.findIndex(item => item.slug === route.params.slug))
const family = computed(() => content.value.productFamilies.find(item => item.id === product.value?.familyId))
const relatedProducts = computed(() => content.value.retailProducts
  .filter(item => item.slug !== product.value?.slug)
  .sort((left, right) => Number(right.familyId === product.value?.familyId) - Number(left.familyId === product.value?.familyId))
  .slice(0, 3))
const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

usePageSeo({
  title: () => product.value!.name,
  description: () => product.value!.summary,
  path: () => `/products/${product.value!.slug}`,
  image: () => product.value!.image,
  imageAlt: () => product.value!.imageAlt,
})
</script>

<template>
  <div v-if="product" class="bg-[#f7f6f2] text-[#242421]">
    <article>
      <section class="border-b border-[#d8cfc4] bg-[#f3eee7]">
        <div class="container-site py-8 sm:py-10 lg:py-14">
          <nav aria-label="Đường dẫn trang" class="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#625a52]">
            <NuxtLink to="/products" class="inline-flex min-h-10 items-center transition-colors hover:text-[#874a2d]">
              Sản phẩm
            </NuxtLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page" class="text-[#292926]">{{ product.name }}</span>
          </nav>

          <div class="mt-7 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16">
            <div data-reveal>
              <div class="flex items-center gap-4">
                <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(productIndex) }}</span>
                <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">{{ product.eyebrow }}</p>
              </div>
              <h1 class="mt-5 text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.035em] text-[#20211f] sm:text-6xl lg:text-[4.75rem]">
                {{ product.name }}
              </h1>
              <p class="mt-6 max-w-2xl text-base leading-8 text-[#625d56] sm:text-lg">
                {{ product.summary }}
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <NuxtLink
                  to="/contact#quick-contact-form"
                  class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#262724] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#874a2d]"
                >
                  Gửi quy cách cần mua
                </NuxtLink>
                <a
                  :href="content.companyContact.phoneHref"
                  class="inline-flex min-h-12 items-center justify-center rounded-full border border-[#bdb2a7] bg-white/55 px-6 py-3 text-sm font-semibold text-[#292926] transition-colors hover:border-[#292926] hover:bg-white"
                >
                  Gọi {{ content.companyContact.phoneDisplay }}
                </a>
              </div>
            </div>

            <figure data-reveal data-reveal-delay="90" class="overflow-hidden rounded-[2rem] border border-[#d1c6bb] bg-[#ded5cc] p-2 shadow-[0_24px_70px_rgba(65,53,43,0.12)] sm:p-3">
              <img
                :src="product.image"
                :srcset="product.imageSrcset"
                :width="product.imageWidth"
                :height="product.imageHeight"
                :alt="product.imageAlt"
                sizes="(min-width: 1024px) 52vw, 100vw"
                class="aspect-[4/3] h-auto w-full rounded-[1.5rem] object-cover"
                fetchpriority="high"
                decoding="async"
              >
              <figcaption class="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#625a52]">
                Ảnh minh họa · Quy cách thực tế được xác nhận theo yêu cầu
              </figcaption>
            </figure>
          </div>

          <dl class="mt-10 grid overflow-hidden rounded-[1.5rem] border border-[#d2c8bd] bg-white/60 sm:grid-cols-3 lg:mt-14">
            <div class="border-b border-[#d2c8bd] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Nhóm sản phẩm</dt>
              <dd class="mt-2 text-base font-semibold text-[#292926]">{{ family?.name }}</dd>
            </div>
            <div class="border-b border-[#d2c8bd] p-5 sm:border-b-0 sm:border-r sm:p-6">
              <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Phạm vi</dt>
              <dd class="mt-2 text-base font-semibold text-[#292926]">Tư vấn và xác nhận toàn quốc</dd>
            </div>
            <div class="p-5 sm:p-6">
              <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Xác nhận</dt>
              <dd class="mt-2 text-base font-semibold text-[#292926]">Theo quy cách thực tế</dd>
            </div>
          </dl>

          <nav aria-label="Đi nhanh trong trang sản phẩm" class="mt-5 flex gap-2 overflow-x-auto rounded-full border border-[#d2c8bd] bg-white/50 p-1.5 backdrop-blur-sm">
            <a href="#thong-so" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Thông số</a>
            <a href="#chon-nhanh" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Chọn nhanh</a>
            <a
              v-for="section in product.detailSections"
              :key="`nav-${section.id}`"
              :href="`#${section.id}`"
              class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]"
            >
              {{ section.title }}
            </a>
            <a href="#chuan-bi" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Thông tin cần gửi</a>
            <a href="#hoi-dap" class="inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-xs font-bold text-[#514b45] transition-colors hover:bg-white hover:text-[#8d5437]">Hỏi đáp</a>
          </nav>
        </div>
      </section>

      <section id="thong-so" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#fbf9f5]">
        <div class="container-site grid gap-12 py-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-18 lg:py-22">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Phạm vi sử dụng</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-4xl">
              Dùng đúng vị trí, xác nhận đúng quy cách.
            </h2>
            <ul class="mt-7 flex flex-wrap gap-2">
              <li
                v-for="application in product.applications"
                :key="application"
                class="rounded-full border border-[#cfc4b8] bg-white px-4 py-2.5 text-xs font-semibold text-[#514b45]"
              >
                {{ application }}
              </li>
            </ul>
          </div>

          <div data-reveal data-reveal-delay="80">
            <div class="flex items-end justify-between gap-5 border-b border-[#aaa096] pb-4">
              <h2 class="text-2xl font-semibold text-[#242421] sm:text-3xl">Thông số hiện có</h2>
              <p class="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55] sm:block">Đối chiếu trước khi đặt</p>
            </div>
            <dl class="mt-4 grid gap-3 sm:grid-cols-2">
              <div
                v-for="specification in product.specifications"
                :key="specification.label"
                data-product-specification
                class="min-w-0 rounded-[1.25rem] border border-[#ddd4ca] bg-white p-5 sm:p-6"
                :class="specification.value.length > 72 ? 'sm:col-span-2' : ''"
              >
                <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ specification.label }}</dt>
                <dd class="mt-3 break-words text-base font-semibold leading-7 text-[#292926]">{{ specification.value }}</dd>
              </div>
            </dl>
            <p class="mt-5 text-sm leading-7 text-[#625a52]">
              Thông số trên dùng để đối chiếu yêu cầu ban đầu. Những giá trị có chữ “tham khảo” không phải cấu hình mặc định; quy cách cuối cùng được xác nhận lại theo số lượng, vị trí lắp và điều kiện công trình.
            </p>
          </div>
        </div>
      </section>

      <section id="chon-nhanh" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#eee8e0]">
        <div class="container-site py-14 lg:py-20">
          <div data-reveal class="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Chọn nhanh theo nhu cầu</p>
              <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-5xl">
                Khoanh đúng nhóm trước khi chốt quy cách.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#625d56] lg:justify-self-end">
              Các gợi ý dưới đây giúp sàng lọc ban đầu. Cấu hình cuối cùng vẫn cần đối chiếu kích thước, môi trường sử dụng và điều kiện lắp đặt thực tế.
            </p>
          </div>

          <ol class="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <li
              v-for="(item, index) in product.selectionGuide"
              :key="item.title"
              data-product-selection-guide
              data-reveal
              :data-reveal-delay="Math.min(index * 60, 180)"
              class="flex min-h-full flex-col rounded-[1.5rem] border border-[#d2c8bd] bg-white/80 p-6 sm:p-7"
            >
              <div class="flex items-center justify-between gap-4">
                <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(index) }}</span>
                <span class="h-px w-10 bg-[#c8b7aa]" aria-hidden="true" />
              </div>
              <h3 class="mt-6 text-xl font-semibold leading-tight text-[#292926]">{{ item.title }}</h3>
              <p class="mt-4 flex-1 text-sm leading-7 text-[#625d56]">{{ item.summary }}</p>
              <div class="mt-6 border-t border-[#d8cfc4] pt-4">
                <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">Cần xác nhận</p>
                <p class="mt-2 text-sm font-semibold leading-6 text-[#373632]">{{ item.check }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section id="cau-hinh" class="scroll-mt-24 border-b border-[#d8cfc4] bg-white">
        <div class="container-site py-14 lg:py-22">
          <div data-reveal class="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Thông tin kỹ thuật</p>
              <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-5xl">
                Cấu tạo, quy cách và cách lựa chọn.
              </h2>
            </div>
            <p class="max-w-2xl text-base leading-8 text-[#625d56] lg:justify-self-end">
              Mỗi nhóm sản phẩm có vật liệu, kích thước và điều kiện sử dụng khác nhau. Nội dung dưới đây giúp đối chiếu trước khi chốt báo giá hoặc bản duyệt kỹ thuật.
            </p>
          </div>

          <div class="mt-9 grid gap-4 lg:grid-cols-2">
            <article
              v-for="(section, index) in product.detailSections"
              :id="section.id"
              :key="section.id"
              data-product-detail-section
              data-reveal
              :data-reveal-delay="Math.min(index * 60, 180)"
              class="scroll-mt-28 rounded-[1.5rem] border border-[#ded7cf] bg-[#f7f3ed] p-6 sm:p-8 lg:col-span-2 lg:p-10"
            >
              <div class="grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-12">
                <div>
                  <div class="flex items-center justify-between gap-4">
                    <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(index) }}</span>
                    <span class="h-px w-12 bg-[#c8b7aa]" aria-hidden="true" />
                  </div>
                  <h3 class="mt-6 text-2xl font-semibold tracking-[-0.025em] text-[#292926] sm:text-3xl lg:text-4xl">{{ section.title }}</h3>
                  <p class="mt-4 text-base font-medium leading-8 text-[#555049]">{{ section.summary }}</p>
                  <div class="mt-5 space-y-4">
                    <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-sm leading-7 text-[#625d56]">
                      {{ paragraph }}
                    </p>
                  </div>
                </div>

                <div>
                  <dl class="grid gap-px overflow-hidden rounded-[1.25rem] border border-[#d5cbc0] bg-[#d5cbc0] sm:grid-cols-2">
                    <div
                      v-for="specification in section.specifications"
                      :key="specification.label"
                      class="bg-white p-5"
                    >
                      <dt class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ specification.label }}</dt>
                      <dd class="mt-2 break-words text-sm font-semibold leading-6 text-[#34332f]">{{ specification.value }}</dd>
                    </div>
                  </dl>

                  <div class="mt-6">
                    <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#655d55]">Điểm cần đối chiếu</p>
                    <ul class="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      <li v-for="point in section.points" :key="point" class="flex gap-3 text-sm leading-7 text-[#45423d]">
                        <span class="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#874a2d]" aria-hidden="true" />
                        <span>{{ point }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="chuan-bi" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#eee8e0]">
        <div class="container-site grid gap-10 py-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-18 lg:py-20">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Chuẩn bị yêu cầu</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-4xl">
              Gửi đúng dữ liệu để báo giá không phải đoán.
            </h2>
          </div>
          <ol class="grid gap-3 sm:grid-cols-2">
            <li
              v-for="(item, index) in product.selectionChecklist"
              :key="item"
              data-product-checklist-item
              data-reveal
              :data-reveal-delay="Math.min(index * 55, 180)"
              class="flex min-h-28 gap-4 rounded-[1.25rem] border border-[#d2c8bd] bg-white/[0.72] p-5 sm:p-6"
            >
              <span class="font-mono text-xs font-bold text-[#874a2d]">{{ formatIndex(index) }}</span>
              <span class="text-sm font-semibold leading-7 text-[#373632]">{{ item }}</span>
            </li>
          </ol>
        </div>
      </section>

      <section id="hoi-dap" class="scroll-mt-24 border-b border-[#d8cfc4] bg-[#fbf9f5]">
        <div class="container-site grid gap-10 py-14 lg:grid-cols-[0.66fr_1.34fr] lg:gap-18 lg:py-20">
          <div data-reveal>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Hỏi đáp nhanh</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#20211f] sm:text-4xl">
              Những câu hỏi thường gặp trước khi đặt sản phẩm.
            </h2>
            <p class="mt-5 max-w-xl text-sm leading-7 text-[#625d56]">
              Nếu công trình có yêu cầu vận hành riêng, hãy gửi bản vẽ, kích thước và thông số liên quan để được kiểm tra đúng cấu hình.
            </p>
          </div>

          <div class="divide-y divide-[#d8cfc4] border-y border-[#d8cfc4]">
            <details
              v-for="(item, index) in product.frequentlyAskedQuestions"
              :key="item.question"
              data-product-faq
              :open="index === 0"
              class="group py-1"
            >
              <summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-base font-semibold text-[#292926] marker:hidden">
                <span>{{ item.question }}</span>
                <span aria-hidden="true" class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c8bcb0] text-lg font-normal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p class="max-w-3xl pb-5 pr-12 text-sm leading-7 text-[#625d56]">{{ item.answer }}</p>
            </details>
          </div>
        </div>
      </section>
    </article>

    <section class="bg-white">
      <div class="container-site py-14 lg:py-20">
        <div data-reveal class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-[#874a2d]">Sản phẩm liên quan</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#20211f] sm:text-4xl">Xem thêm trong danh mục.</h2>
          </div>
          <NuxtLink to="/products" class="inline-flex min-h-11 items-center text-sm font-semibold text-[#7f4d32] hover:text-[#292926]">
            Tất cả sản phẩm →
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="(related, index) in relatedProducts"
            :key="related.slug"
            :to="`/products/${related.slug}`"
            data-reveal
            :data-reveal-delay="index * 65"
            class="group overflow-hidden rounded-[1.5rem] border border-[#ded7cf] bg-[#f7f3ed] transition-transform duration-300 motion-safe:hover:-translate-y-1"
          >
            <img
              :src="related.image"
              :srcset="related.imageSrcset"
              :width="related.imageWidth"
              :height="related.imageHeight"
              :alt="related.imageAlt"
              sizes="(min-width: 768px) 33vw, 100vw"
              class="aspect-[16/10] h-auto w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
              loading="lazy"
              decoding="async"
            >
            <div class="p-5 sm:p-6">
              <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#874a2d]">{{ related.eyebrow }}</p>
              <div class="mt-3 flex items-start justify-between gap-4">
                <h3 class="text-xl font-semibold text-[#292926]">{{ related.name }}</h3>
                <span aria-hidden="true" class="text-lg transition-transform motion-safe:group-hover:translate-x-1">→</span>
              </div>
              <span class="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.14em] text-[#625a52]">Xem chi tiết</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-[#262724] text-white">
      <div data-reveal class="container-site grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center lg:py-16">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#d99a73]">Cần xác nhận quy cách?</p>
          <h2 class="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">Gửi kích thước và số lượng để Thái Thanh kiểm tra.</h2>
        </div>
        <NuxtLink
          to="/contact#quick-contact-form"
          class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#b46d47] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#cf8358]"
        >
          Gửi yêu cầu nhanh
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
