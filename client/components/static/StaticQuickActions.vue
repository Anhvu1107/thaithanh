<script setup lang="ts">
const { content } = useSiteContent()
const route = useRoute()
const companyContact = computed(() => content.value.companyContact)
</script>

<template>
  <nav v-if="route.path !== '/contact'" class="fixed bottom-4 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6" aria-label="Liên hệ nhanh">
    <a
      :href="companyContact.phoneHref"
      class="quick-action group relative grid h-12 w-12 place-items-center rounded-full border border-panel-line bg-white text-panel-black shadow-elevated hover:border-panel-black focus-visible:border-panel-black sm:h-14 sm:w-14"
      :aria-label="`Gọi ${companyContact.phoneDisplay}`"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6.6 3.8 9 3.2l2 4.6-1.7 1.4a14.8 14.8 0 0 0 5.5 5.5l1.4-1.7 4.6 2-.6 2.4a2.8 2.8 0 0 1-3 2.1C10.7 18.6 5.4 13.3 4.5 6.8a2.8 2.8 0 0 1 2.1-3Z" />
      </svg>
      <span class="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-panel-black px-3 py-2 text-xs font-semibold text-white shadow-medium group-hover:block group-focus-visible:block sm:block sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
        {{ companyContact.phoneDisplay }}
      </span>
    </a>

    <NuxtLink
      to="/contact#quick-contact-form"
      class="quick-action inline-flex min-h-12 items-center gap-2 rounded-full bg-panel-black px-4 text-xs font-bold text-white shadow-[0_14px_40px_rgba(28,33,30,0.18)] hover:bg-accent-lime focus-visible:bg-accent-lime sm:min-h-14 sm:px-5 sm:text-sm"
      aria-label="Mở form gửi yêu cầu nhanh"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6" />
      </svg>
      <span class="hidden sm:inline">Gửi yêu cầu</span>
      <span class="sm:hidden">Gửi</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.quick-action {
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: 180ms;
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .quick-action:hover {
    transform: translateY(-2px);
  }
}
</style>
