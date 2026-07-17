<script setup lang="ts">
const { content } = useSiteContent()
const route = useRoute()
const companyContact = computed(() => content.value.companyContact)
</script>

<template>
  <nav
    v-if="route.path !== '/contact'"
    class="contact-dock fixed left-2 right-2 z-40 flex flex-col items-end gap-2 sm:left-auto sm:right-3 sm:max-w-[calc(100vw-1.5rem)]"
    aria-label="Liên hệ nhanh"
    data-quick-actions
  >
    <p class="contact-dock__status hidden items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4f554f] shadow-medium backdrop-blur sm:inline-flex">
      <span>Gọi hoặc nhắn Zalo</span>
      <span class="normal-case tracking-normal text-neutral-500">· Chọn kênh thuận tiện</span>
    </p>

    <div class="contact-dock__actions grid w-full grid-cols-3 items-center gap-1 rounded-2xl border border-white/90 bg-white/95 p-1.5 shadow-[0_12px_36px_rgba(28,33,30,0.24)] backdrop-blur-none sm:flex sm:w-auto sm:gap-2 sm:rounded-full sm:bg-white/90 sm:shadow-[0_18px_55px_rgba(28,33,30,0.24)] sm:backdrop-blur-md">
      <a
        :href="companyContact.phoneHref"
        class="quick-action quick-action--phone group relative isolate inline-flex h-[3.75rem] min-w-0 flex-col items-center justify-center gap-1 overflow-visible rounded-xl px-1 text-center text-[#1c211e] active:scale-[0.97] focus-visible:outline-panel-black sm:h-[3.25rem] sm:min-w-[12.5rem] sm:flex-row sm:justify-start sm:gap-3 sm:rounded-full sm:px-2.5 sm:text-left"
        :aria-label="`Gọi ngay ${companyContact.phoneDisplay}`"
        data-quick-action="phone"
      >
        <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/40 ring-1 ring-inset ring-black/10 sm:h-9 sm:w-9" aria-hidden="true">
          <svg class="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M6.6 3.8 9 3.2l2 4.6-1.7 1.4a14.8 14.8 0 0 0 5.5 5.5l1.4-1.7 4.6 2-.6 2.4a2.8 2.8 0 0 1-3 2.1C10.7 18.6 5.4 13.3 4.5 6.8a2.8 2.8 0 0 1 2.1-3Z" />
          </svg>
        </span>
        <span class="min-w-0 leading-none">
          <span class="block whitespace-nowrap text-xs font-extrabold tracking-[0.02em] sm:text-[11px] sm:uppercase sm:tracking-[0.08em]">Gọi ngay</span>
          <span class="mt-1.5 hidden whitespace-nowrap text-sm font-bold tracking-[0.035em] sm:block">{{ companyContact.phoneDisplay }}</span>
        </span>
      </a>

      <a
        v-if="companyContact.zaloHref"
        :href="companyContact.zaloHref"
        class="quick-action quick-action--zalo inline-flex h-[3.75rem] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-extrabold text-white active:scale-[0.97] focus-visible:outline-white sm:h-[3.25rem] sm:min-w-[6.5rem] sm:flex-row sm:gap-2 sm:rounded-full sm:px-4 sm:text-sm"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`Nhắn Zalo số ${companyContact.phoneDisplay} (mở trong tab mới)`"
        data-quick-action="zalo"
      >
        <span class="grid h-7 w-7 place-items-center rounded-full bg-white text-[11px] font-black text-[#0668e8] shadow-sm" aria-hidden="true">Z</span>
        <span>Zalo</span>
      </a>

      <NuxtLink
        to="/contact#quick-contact-form"
        class="quick-action quick-action--request inline-flex h-[3.75rem] min-w-0 flex-col items-center justify-center gap-1 rounded-xl bg-panel-black px-1 text-xs font-bold text-white active:scale-[0.97] focus-visible:bg-accent-lime sm:h-[3.25rem] sm:w-auto sm:flex-row sm:gap-2 sm:rounded-full sm:px-5 sm:text-sm"
        aria-label="Mở form yêu cầu gọi lại"
        data-quick-action="request"
      >
        <svg class="h-[1.15rem] w-[1.15rem]" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6" />
        </svg>
        <span class="sm:hidden">Báo giá</span>
        <span class="hidden sm:inline">Gửi yêu cầu</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.contact-dock {
  bottom: max(0.5rem, env(safe-area-inset-bottom));
}

.quick-action {
  transition-property: color, background-color, border-color, box-shadow, transform;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.quick-action--phone {
  background: linear-gradient(135deg, #f09a76 0%, #d66f4a 100%);
  box-shadow: 0 12px 28px rgba(181, 84, 52, 0.34);
}

.quick-action--phone::before {
  position: absolute;
  z-index: -1;
  inset: -0.22rem;
  border: 2px solid rgba(214, 111, 74, 0.42);
  border-radius: inherit;
  content: '';
  pointer-events: none;
}

.quick-action--zalo {
  background: linear-gradient(135deg, #0b75f0 0%, #075dc7 100%);
  box-shadow: 0 10px 24px rgba(6, 104, 232, 0.25);
}

.quick-action--request {
  box-shadow: 0 10px 24px rgba(28, 33, 30, 0.2);
}

@media (min-width: 640px) and (prefers-reduced-motion: no-preference) {
  .quick-action--phone::before {
    animation: call-attention 2.4s ease-out 3;
  }
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .quick-action:hover {
    transform: translateY(-3px);
  }

  .quick-action--phone:hover {
    box-shadow: 0 16px 34px rgba(181, 84, 52, 0.42);
  }

  .quick-action--zalo:hover {
    box-shadow: 0 14px 30px rgba(6, 104, 232, 0.34);
  }

  .quick-action--request:hover {
    background: #d66f4a;
    box-shadow: 0 14px 30px rgba(214, 111, 74, 0.28);
  }
}

@keyframes call-attention {
  0%,
  58% {
    opacity: 0.75;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(1.08, 1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .quick-action,
  .quick-action--phone::before {
    animation: none;
    transition: none;
  }
}

@media (min-width: 640px) {
  .contact-dock {
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: max(0.75rem, env(safe-area-inset-bottom));
  }
}
</style>
