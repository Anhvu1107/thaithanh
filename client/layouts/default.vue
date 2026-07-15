<template>
  <div class="flex min-h-screen flex-col bg-panel-ivory">
    <a
      href="#main-content"
      class="fixed left-4 top-3 z-[100] -translate-y-24 rounded bg-panel-black px-4 py-3 text-sm font-semibold text-white shadow-elevated transition-transform focus:translate-y-0"
    >
      Đi đến nội dung chính
    </a>
    <StaticHeader />
    <main id="main-content" tabindex="-1" class="flex-1">
      <slot />
    </main>
    <StaticFooter />
    <StaticQuickActions />
  </div>
</template>
