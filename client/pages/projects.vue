<script setup lang="ts">
const { content } = useSiteContent()
const referenceApplications = computed(() => content.value.referenceApplications)

usePageSeo({
  title: 'Ứng dụng',
  description: 'Các cấu hình ứng dụng tham khảo cho kho đông, kho mát, phòng sơ chế và nhà xưởng.',
  path: '/projects',
  breadcrumbs: [
    { name: 'Ứng dụng', path: '/projects' },
  ],
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Ứng dụng tham khảo"
      title="Gợi ý cấu hình cho một số nhóm ứng dụng phổ biến."
      description="Các tình huống dưới đây mang tính minh họa, giúp tham khảo cách phối hợp panel, cửa và phụ kiện. Cấu hình thực tế cần được xác nhận theo từng công trình."
      image="/images/insulation/cold-door-editorial.jpg"
      image-alt="Cửa kho lạnh và hệ panel cách nhiệt"
    />

    <section class="section bg-panel-black text-white">
      <div data-reveal class="container-site">
        <p class="max-w-3xl text-lg leading-8 text-emerald-50">
          Mỗi công trình có điều kiện vận hành riêng. Nhiệt độ, mặt bằng, tải sử dụng và tiến độ cần được xác nhận trước khi lựa chọn cấu hình.
        </p>
      </div>
    </section>

    <section class="bg-white">
      <article v-for="(application, index) in referenceApplications" :key="application.id" class="border-b border-panel-line">
        <div data-reveal :data-reveal-delay="index * 60" class="container-site grid gap-7 py-10 md:grid-cols-[6rem_1fr] lg:grid-cols-[8rem_0.9fr_1.1fr] lg:py-14">
          <p class="font-mono text-3xl font-semibold text-accent-steel">0{{ index + 1 }}</p>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{{ application.sector }}</p>
            <h2 class="mt-3 text-2xl font-semibold leading-tight text-panel-black sm:text-3xl">{{ application.title }}</h2>
            <p class="mt-4 text-sm leading-7 text-neutral-600">{{ application.brief }}</p>
          </div>
          <div class="md:col-start-2 lg:col-start-auto">
            <ul class="grid gap-px border border-panel-line bg-panel-line sm:grid-cols-2">
              <li v-for="item in application.system" :key="item" class="bg-panel-frost p-4 text-sm font-semibold text-panel-black">{{ item }}</li>
            </ul>
            <p class="mt-4 border-l-2 border-accent-lime pl-4 text-xs leading-6 text-neutral-500">{{ application.note }}</p>
          </div>
        </div>
      </article>
    </section>

    <StaticContactBand />
  </div>
</template>
