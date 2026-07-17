<script setup lang="ts">
const { content } = useSiteContent()
const solutions = computed(() => content.value.solutions)

usePageSeo({
  title: 'Giải pháp',
  description: 'Các hướng cấu hình panel cho kho mát, kho lạnh, kho đông, phòng sạch và nhà xưởng.',
  path: '/solutions',
  breadcrumbs: [
    { name: 'Giải pháp', path: '/solutions' },
  ],
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Giải pháp"
      title="Mỗi dải nhiệt cần một cách tiếp cận khác nhau."
      description="Các cấu hình dưới đây là cơ sở trao đổi ban đầu. Độ dày, vật liệu lõi, cửa, nền và phụ kiện sẽ được xác định theo dữ liệu công trình."
      image="/images/insulation/eps-panel-step-joint-editorial.jpg"
      image-srcset="/images/insulation/eps-panel-step-joint-editorial-640.webp 640w, /images/insulation/eps-panel-step-joint-editorial-960.webp 960w, /images/insulation/eps-panel-step-joint-editorial.jpg 1254w"
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

    <section class="border-b border-panel-line bg-[#f7f3ed]">
      <div class="container-site py-12 sm:py-16 lg:py-20">
        <div data-reveal class="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
          <div>
            <p class="section-kicker">Trang theo nhu cầu tìm kiếm</p>
            <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-panel-black sm:text-5xl">Đi thẳng đến cấu hình bạn đang cần.</h2>
          </div>
          <p class="max-w-2xl text-sm leading-7 text-neutral-600 lg:justify-self-end sm:text-base sm:leading-8">
            Hai trang chuyên biệt dưới đây gom sản phẩm, quy cách tham khảo và thông tin cần gửi để khách hàng tìm nhanh hơn trước khi gọi hoặc nhắn Zalo.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <NuxtLink to="/solutions/panel-kho-lanh" data-reveal data-reveal-delay="70" class="group rounded-[1.35rem] border border-[#d8cfc4] bg-white p-6 transition duration-300 hover:border-[#b98b70] hover:shadow-[0_18px_45px_rgba(63,52,42,0.09)] sm:p-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#874a2d]">Panel kho lạnh</p>
            <div class="mt-3 flex items-start justify-between gap-4">
              <h3 class="text-2xl font-semibold leading-tight text-panel-black group-hover:text-[#874a2d]">Panel kho lạnh: chọn đúng độ dày, cửa và phụ kiện</h3>
              <span class="shrink-0 text-xl text-[#874a2d] transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
            </div>
            <p class="mt-4 text-sm leading-7 text-neutral-600">Đối chiếu panel EPS, cửa Inox 304 và vật tư hoàn thiện cho kho mát, kho lạnh và kho đông.</p>
          </NuxtLink>

          <NuxtLink to="/solutions/panel-phong-sach" data-reveal data-reveal-delay="140" class="group rounded-[1.35rem] border border-[#d8cfc4] bg-white p-6 transition duration-300 hover:border-[#b98b70] hover:shadow-[0_18px_45px_rgba(63,52,42,0.09)] sm:p-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#874a2d]">Panel phòng sạch</p>
            <div class="mt-3 flex items-start justify-between gap-4">
              <h3 class="text-2xl font-semibold leading-tight text-panel-black group-hover:text-[#874a2d]">Panel phòng sạch cho vách, trần và khu vực kiểm soát</h3>
              <span class="shrink-0 text-xl text-[#874a2d] transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true">→</span>
            </div>
            <p class="mt-4 text-sm leading-7 text-neutral-600">Chuẩn bị mặt bằng, kích thước, cửa và yêu cầu vận hành trước khi hỏi quy cách panel.</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <StaticContactBand title="Chưa biết công trình thuộc nhóm nào?" description="Chỉ cần chuẩn bị kích thước, nhiệt độ và loại hàng; đội kỹ thuật sẽ giúp xác định hướng cấu hình ban đầu." />
  </div>
</template>
