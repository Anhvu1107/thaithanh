<script setup lang="ts">
withDefaults(defineProps<{
  reserveMobileDock?: boolean
}>(), {
  reserveMobileDock: false,
})

const { content } = useSiteContent()
const publicNavigation = computed(() => content.value.publicNavigation)
const companyContact = computed(() => content.value.companyContact)
</script>

<template>
  <footer class="quiet-footer bg-[#1d1f1c] text-white">
    <div class="container-site py-14 sm:py-16 lg:py-24">
      <div class="grid gap-14 lg:grid-cols-[1.2fr_0.42fr_0.68fr] lg:gap-12 xl:gap-20">
        <div>
          <NuxtLink
            to="/"
            class="group inline-flex items-center"
            aria-label="Thái Thanh Panel - Trang chủ"
          >
            <img
              src="/images/brand/thai-thanh-logo-transparent-240.png"
              srcset="/images/brand/thai-thanh-logo-transparent-240.png 240w, /images/brand/thai-thanh-logo-transparent-480.png 479w, /images/brand/thai-thanh-logo-transparent.png 898w"
              sizes="144px"
              width="240"
              height="163"
              alt="Logo Thái Thanh Panel"
              class="h-auto w-36 object-contain transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            >
          </NuxtLink>

          <h2 class="mt-9 max-w-2xl text-3xl font-semibold leading-[1.12] text-white sm:text-4xl lg:text-[2.6rem]">
            Tấm panel cách nhiệt và vật tư hoàn thiện cho công trình cần kiểm soát nhiệt.
          </h2>
          <p class="mt-6 max-w-xl text-sm leading-7 text-[#c9cbc5] sm:text-base sm:leading-8">
            Cấu hình panel, cửa và phụ kiện được xác nhận theo mặt bằng, nhiệt độ và yêu cầu vận hành thực tế.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              :href="companyContact.phoneHref"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#20231f] transition hover:bg-[#c28464] hover:text-white"
            >
              {{ companyContact.phoneDisplay }}
            </a>
            <a
              v-if="companyContact.zaloHref"
              :href="companyContact.zaloHref"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0876e8] px-6 text-sm font-bold text-white transition hover:bg-[#0561c2]"
            >
              Nhắn Zalo
            </a>
            <NuxtLink
              to="/contact"
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-[#c28464] hover:text-[#d99a78]"
            >
              Gửi yêu cầu
              <span aria-hidden="true">↗</span>
            </NuxtLink>
          </div>
        </div>

        <nav aria-label="Điều hướng cuối trang">
          <p class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#c28464]">Điều hướng</p>
          <ul class="mt-6 space-y-1">
            <li v-for="item in publicNavigation" :key="item.href">
              <NuxtLink
                :to="item.href"
                class="inline-flex min-h-10 items-center text-sm font-medium text-[#c9cbc5] transition hover:text-white"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <p class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#c28464]">Liên hệ trực tiếp</p>
          <address class="mt-6 not-italic">
            <a :href="companyContact.phoneHref" class="group block">
              <span class="block text-xs text-[#8f928b]">Hotline</span>
              <span class="mt-2 block text-xl font-bold tracking-[0.025em] text-white transition-colors group-hover:text-[#d99a78]">{{ companyContact.phoneDisplay }}</span>
            </a>

            <a
              v-if="companyContact.zaloHref"
              :href="companyContact.zaloHref"
              target="_blank"
              rel="noopener noreferrer"
              class="group mt-6 block"
            >
              <span class="block text-xs text-[#8f928b]">Zalo</span>
              <span class="mt-2 block text-sm font-semibold text-[#d8dad4] transition-colors group-hover:text-[#5ca4ff]">Nhắn qua số {{ companyContact.phoneDisplay }}</span>
            </a>

            <a
              v-if="companyContact.emailHref && companyContact.emailDisplay"
              :href="companyContact.emailHref"
              class="group mt-6 block"
            >
              <span class="block text-xs text-[#8f928b]">Email</span>
              <span class="mt-2 block break-words text-sm font-semibold text-[#d8dad4] transition-colors group-hover:text-[#d99a78]">{{ companyContact.emailDisplay }}</span>
            </a>

            <dl class="mt-8 space-y-6 border-t border-white/10 pt-7">
              <div>
                <dt class="text-xs text-[#8f928b]">Giờ làm việc</dt>
                <dd class="mt-2 text-sm font-medium leading-6 text-[#d8dad4]">{{ companyContact.hours }}</dd>
              </div>
              <div>
                <dt class="text-xs text-[#8f928b]">Khu vực hỗ trợ</dt>
                <dd class="mt-2 text-sm font-medium leading-6 text-[#d8dad4]">{{ companyContact.serviceArea }}</dd>
              </div>
            </dl>
          </address>
        </div>
      </div>

      <div class="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#8f928b] sm:mt-18 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
        <p>© {{ new Date().getFullYear() }} Thái Thanh Panel.</p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <NuxtLink to="/privacy" class="transition-colors hover:text-white">
            Chính sách quyền riêng tư
          </NuxtLink>
          <p>Uy tín, chất lượng tạo nên sự thành công</p>
        </div>
      </div>
      <div v-if="reserveMobileDock" class="h-20 sm:hidden" aria-hidden="true" />
    </div>
  </footer>
</template>

<style scoped>
.quiet-footer {
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.035);
}

.quiet-footer :focus-visible {
  outline-color: #c28464;
}

@media (prefers-reduced-motion: reduce) {
  .quiet-footer a,
  .quiet-footer img,
  .quiet-footer span {
    transition: none;
  }
}
</style>
