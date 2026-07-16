<script setup lang="ts">
const principles = [
  { index: '01', title: 'Hiểu đúng nhu cầu', text: 'Nhiệt độ, mặt bằng, loại hàng và yêu cầu vận hành là cơ sở để trao đổi giải pháp.' },
  { index: '02', title: 'Cấu hình phù hợp', text: 'Độ dày, bề mặt, cửa và phụ kiện được xem xét theo điều kiện sử dụng cụ thể.' },
  { index: '03', title: 'Xác nhận rõ ràng', text: 'Quy cách, tiến độ và báo giá được xác nhận sau khi thống nhất thông tin công trình.' },
]

usePageSeo({
  title: 'Giới thiệu',
  description: 'Định hướng và cách Thái Thanh Panel cung cấp thông tin giải pháp panel cách nhiệt cho công trình.',
  path: '/about',
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Giới thiệu"
      title="Giải pháp panel bắt đầu từ yêu cầu thực tế của công trình."
      description="Thái Thanh Panel tập trung vào panel cách nhiệt, cửa và phụ kiện cho kho lạnh, phòng sạch, nhà xưởng và công trình lắp ghép."
      image="/images/insulation/eps-panel-step-joint-editorial.jpg"
      image-alt="Cấu tạo panel EPS cách nhiệt"
    />

    <section class="section bg-white">
      <div data-reveal class="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div class="lg:sticky lg:top-28">
          <p class="section-kicker">Cách tiếp cận</p>
          <h2 class="mt-3 text-3xl font-semibold leading-tight text-panel-black sm:text-4xl">Chuẩn bị đúng thông tin trước khi lựa chọn cấu hình.</h2>
        </div>
        <div>
          <p class="text-lg leading-9 text-neutral-700">
            Với panel cách nhiệt, tên sản phẩm chưa đủ để ra quyết định. Cùng một nhóm vật liệu có thể cần độ dày, bề mặt, cửa và phụ kiện khác nhau tùy nhiệt độ, tải lạnh và yêu cầu vệ sinh.
          </p>
          <p class="mt-6 text-base leading-8 text-neutral-600">
            Từ thông tin mặt bằng và điều kiện vận hành, các nhóm giải pháp sẽ được đối chiếu trước khi xác nhận quy cách cụ thể.
          </p>
        </div>
      </div>
    </section>

    <section class="section bg-panel-frost">
      <div class="container-site">
        <div class="border-t border-panel-black">
          <article v-for="(principle, index) in principles" :key="principle.index" data-reveal :data-reveal-delay="index * 65" class="grid gap-5 border-b border-panel-line py-7 md:grid-cols-[6rem_0.8fr_1.2fr] md:items-start">
            <p class="font-mono text-2xl font-semibold text-emerald-700">{{ principle.index }}</p>
            <h3 class="text-xl font-semibold text-panel-black">{{ principle.title }}</h3>
            <p class="text-sm leading-7 text-neutral-600">{{ principle.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section bg-panel-black text-white">
      <div data-reveal class="container-site grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-accent-lime">Quy trình trao đổi</p>
          <h2 class="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">Từ thông tin sơ bộ đến cấu hình có thể xác nhận.</h2>
        </div>
        <ol class="space-y-4">
          <li v-for="(step, index) in ['Nhận kích thước và điều kiện vận hành', 'Đề xuất nhóm vật liệu phù hợp', 'Bóc tách quy cách, cửa và phụ kiện', 'Xác nhận lại trước khi báo giá hoặc triển khai']" :key="step" class="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/15 pb-4 text-sm text-emerald-50">
            <span class="font-mono font-bold text-accent-lime">0{{ index + 1 }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
      </div>
    </section>

    <StaticContactBand />
  </div>
</template>
