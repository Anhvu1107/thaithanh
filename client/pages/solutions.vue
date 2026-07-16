<script setup lang="ts">
const { content } = useSiteContent()
const solutions = computed(() => content.value.solutions)

usePageSeo({
  title: 'Giải pháp',
  description: 'Các hướng cấu hình panel cho kho mát, kho lạnh, kho đông, phòng sạch và nhà xưởng.',
  path: '/solutions',
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Giải pháp"
      title="Mỗi dải nhiệt cần một cách tiếp cận khác nhau."
      description="Các cấu hình dưới đây là cơ sở trao đổi ban đầu. Độ dày, vật liệu lõi, cửa, nền và phụ kiện sẽ được xác định theo dữ liệu công trình."
      image="/images/insulation/eps-panel-step-joint-editorial.jpg"
      image-alt="Cấu tạo panel EPS cách nhiệt"
    />

    <section class="section bg-white">
      <div class="container-site space-y-8 lg:space-y-12">
        <article v-for="(solution, index) in solutions" :key="solution.id" :id="solution.id" data-reveal :data-reveal-delay="index * 60" class="grid scroll-mt-28 gap-6 border-t border-panel-black pt-7 lg:grid-cols-[7rem_0.9fr_1.1fr] lg:gap-10 lg:pt-10">
          <p class="font-mono text-3xl font-semibold text-accent-steel">{{ solution.index }}</p>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{{ solution.temperature }}</p>
            <h2 class="mt-3 text-3xl font-semibold leading-tight text-panel-black">{{ solution.name }}</h2>
            <p class="mt-5 text-sm leading-7 text-neutral-600">{{ solution.summary }}</p>
          </div>
          <div class="bg-panel-frost p-6 sm:p-8">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-accent-steel">Hướng cấu hình tham khảo</p>
            <p class="mt-4 text-lg font-semibold leading-8 text-panel-black">{{ solution.recommendedSystem }}</p>
            <ul class="mt-6 grid gap-3 sm:grid-cols-2">
              <li v-for="item in solution.checklist" :key="item" class="flex gap-3 text-sm text-neutral-700">
                <span class="mt-2 h-2 w-2 shrink-0 bg-accent-lime" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <StaticContactBand title="Chưa biết công trình thuộc nhóm nào?" description="Chỉ cần chuẩn bị kích thước, nhiệt độ và loại hàng; đội kỹ thuật sẽ giúp xác định hướng cấu hình ban đầu." />
  </div>
</template>
