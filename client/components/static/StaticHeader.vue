<script setup lang="ts">
const route = useRoute()
const isMenuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const mobileNavigation = ref<HTMLElement | null>(null)
const desktopNavigation = ref<HTMLElement | null>(null)
const liquidIndicatorElement = ref<HTMLElement | null>(null)
const { content } = useSiteContent()
const publicNavigation = computed(() => content.value.publicNavigation)
const headerNavigation = computed(() => [
  { label: 'Trang chủ', href: '/' },
  ...publicNavigation.value,
])
const companyContact = computed(() => content.value.companyContact)
const hasScrolled = ref(false)
const isHomePage = computed(() => route.path === '/')
const usesHeroHeader = computed(() => isHomePage.value && !hasScrolled.value && !isMenuOpen.value)
const liquidIndicator = reactive({ x: 0, width: 0, visible: false })
const liquidIndicatorHoverIndex = ref<number | null>(null)
const liquidIndicatorFocusIndex = ref<number | null>(null)
const liquidIndicatorTarget = ref('')
const liquidIndicatorReady = ref(false)
const liquidIndicatorMoving = ref(false)
const liquidIndicatorDirection = ref<'left' | 'right'>('right')
const liquidIndicatorMotionVersion = ref(0)
const liquidIndicatorStyle = computed(() => ({
  width: `${liquidIndicator.width}px`,
  opacity: liquidIndicator.visible ? '1' : '0',
  transform: `translate3d(${liquidIndicator.x}px, 0, 0)`,
}))
let liquidIndicatorFrame: number | null = null
let liquidIndicatorReadyFrame: number | null = null
let liquidIndicatorMotionTimer: number | null = null
let desktopNavigationResizeObserver: ResizeObserver | null = null

const syncScrollState = () => {
  hasScrolled.value = window.scrollY > 24
}

const isActiveRoute = (href: string) => href === '/'
  ? route.path === '/'
  : route.path === href || route.path.startsWith(`${href}/`)

const updateLiquidIndicator = () => {
  const navigation = desktopNavigation.value
  const links = navigation?.querySelectorAll<HTMLElement>('[data-desktop-nav-link]')
  const activeIndex = headerNavigation.value.findIndex(item => isActiveRoute(item.href))
  const targetIndex = liquidIndicatorHoverIndex.value ?? liquidIndicatorFocusIndex.value ?? activeIndex
  const target = links?.item(targetIndex)

  if (!target || target.offsetWidth === 0) {
    liquidIndicator.visible = false
    liquidIndicatorMoving.value = false
    liquidIndicatorTarget.value = ''
    return
  }

  const nextTarget = headerNavigation.value[targetIndex]?.href ?? ''
  if (liquidIndicatorReady.value && liquidIndicatorTarget.value && liquidIndicatorTarget.value !== nextTarget) {
    const currentBox = liquidIndicatorElement.value?.getBoundingClientRect()
    const targetBox = target.getBoundingClientRect()
    const currentCenter = currentBox ? currentBox.left + currentBox.width / 2 : liquidIndicator.x + liquidIndicator.width / 2
    const targetCenter = targetBox.left + targetBox.width / 2
    liquidIndicatorDirection.value = targetCenter >= currentCenter ? 'right' : 'left'
    liquidIndicatorMoving.value = true
    liquidIndicatorMotionVersion.value += 1
    if (liquidIndicatorMotionTimer !== null) window.clearTimeout(liquidIndicatorMotionTimer)
    liquidIndicatorMotionTimer = window.setTimeout(() => {
      liquidIndicatorMotionTimer = null
      liquidIndicatorMoving.value = false
    }, 580)
  }

  liquidIndicator.x = target.offsetLeft
  liquidIndicator.width = target.offsetWidth
  liquidIndicator.visible = true
  liquidIndicatorTarget.value = nextTarget

  if (!liquidIndicatorReady.value && liquidIndicatorReadyFrame === null) {
    liquidIndicatorReadyFrame = window.requestAnimationFrame(() => {
      liquidIndicatorReadyFrame = null
      liquidIndicatorReady.value = true
    })
  }
}

const scheduleLiquidIndicatorUpdate = () => {
  if (!import.meta.client) return
  if (liquidIndicatorFrame !== null) window.cancelAnimationFrame(liquidIndicatorFrame)
  liquidIndicatorFrame = window.requestAnimationFrame(() => {
    liquidIndicatorFrame = null
    updateLiquidIndicator()
  })
}

const previewLiquidIndicator = (index: number) => {
  liquidIndicatorHoverIndex.value = index
  scheduleLiquidIndicatorUpdate()
}

const restoreLiquidIndicator = () => {
  liquidIndicatorHoverIndex.value = null
  scheduleLiquidIndicatorUpdate()
}

const focusLiquidIndicator = (index: number) => {
  liquidIndicatorFocusIndex.value = index
  scheduleLiquidIndicatorUpdate()
}

const blurLiquidIndicator = () => {
  liquidIndicatorFocusIndex.value = null
  scheduleLiquidIndicatorUpdate()
}

watch(() => route.fullPath, async () => {
  isMenuOpen.value = false
  liquidIndicatorHoverIndex.value = null
  liquidIndicatorFocusIndex.value = null
  await nextTick()
  syncScrollState()
  scheduleLiquidIndicatorUpdate()
})

async function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    await nextTick()
    mobileNavigation.value?.querySelector<HTMLElement>('a')?.focus()
  }
}

async function handleEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isMenuOpen.value) return

  isMenuOpen.value = false
  await nextTick()
  menuButton.value?.focus()
}

onMounted(() => {
  syncScrollState()
  nextTick(() => {
    scheduleLiquidIndicatorUpdate()
    if (desktopNavigation.value && 'ResizeObserver' in window) {
      desktopNavigationResizeObserver = new ResizeObserver(scheduleLiquidIndicatorUpdate)
      desktopNavigationResizeObserver.observe(desktopNavigation.value)
    }
  })
  window.addEventListener('scroll', syncScrollState, { passive: true })
  window.addEventListener('resize', scheduleLiquidIndicatorUpdate, { passive: true })
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  if (liquidIndicatorFrame !== null) window.cancelAnimationFrame(liquidIndicatorFrame)
  if (liquidIndicatorReadyFrame !== null) window.cancelAnimationFrame(liquidIndicatorReadyFrame)
  if (liquidIndicatorMotionTimer !== null) window.clearTimeout(liquidIndicatorMotionTimer)
  desktopNavigationResizeObserver?.disconnect()
  window.removeEventListener('scroll', syncScrollState)
  window.removeEventListener('resize', scheduleLiquidIndicatorUpdate)
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <header
    class="warm-header top-0 z-50"
    :class="[
      isHomePage ? 'fixed inset-x-0' : 'sticky',
      usesHeroHeader
        ? 'header-hero bg-transparent text-white'
        : 'header-light border-b border-panel-line/80 bg-panel-ivory text-panel-black',
    ]"
    :data-header-mode="usesHeroHeader ? 'hero' : 'light'"
  >
    <div class="container-site flex min-h-20 items-center gap-4 xl:grid xl:grid-cols-[minmax(14rem,1fr)_auto_minmax(14rem,1fr)] xl:gap-8">
      <NuxtLink
        to="/"
        class="group flex min-h-12 shrink-0 items-center gap-3 justify-self-start"
        aria-label="Thái Thanh Co., Ltd - Trang chủ"
      >
        <span
          class="grid h-14 w-[5.75rem] shrink-0 place-items-center"
        >
          <img
            src="/images/brand/thai-thanh-logo-transparent-480.png"
            srcset="/images/brand/thai-thanh-logo-transparent-480.png 479w, /images/brand/thai-thanh-logo-transparent.png 898w"
            sizes="84px"
            width="479"
            height="325"
            alt="Logo Thái Thanh Co., Ltd"
            class="h-14 w-auto object-contain"
            fetchpriority="high"
          >
        </span>
      </NuxtLink>

      <nav
        ref="desktopNavigation"
        class="desktop-navigation relative hidden self-stretch items-center justify-self-center gap-1.5 xl:flex 2xl:gap-2"
        aria-label="Điều hướng chính"
        data-desktop-navigation
        @pointerleave="restoreLiquidIndicator"
      >
        <span
          ref="liquidIndicatorElement"
          class="liquid-nav-indicator"
          :class="[
            usesHeroHeader ? 'liquid-nav-indicator--hero' : 'liquid-nav-indicator--light',
            liquidIndicatorReady ? 'liquid-nav-indicator--ready' : '',
            liquidIndicatorMoving ? `liquid-nav-indicator--moving liquid-nav-indicator--moving-${liquidIndicatorDirection}` : '',
          ]"
          :style="liquidIndicatorStyle"
          :data-liquid-target="liquidIndicatorTarget"
          :data-liquid-ready="liquidIndicatorReady ? 'true' : 'false'"
          :data-liquid-moving="liquidIndicatorMoving ? 'true' : 'false'"
          :data-liquid-direction="liquidIndicatorDirection"
          data-nav-liquid-indicator
          aria-hidden="true"
        >
          <span
            :key="liquidIndicatorMotionVersion"
            class="liquid-nav-surface"
            data-nav-liquid-surface
            aria-hidden="true"
          />
        </span>
        <NuxtLink
          v-for="(item, index) in headerNavigation"
          :key="item.href"
          :to="item.href"
          :aria-current="isActiveRoute(item.href) ? 'page' : undefined"
          :data-nav-active="isActiveRoute(item.href) ? 'true' : 'false'"
          data-desktop-nav-link
          class="desktop-nav-link group relative z-10 flex min-h-11 items-center rounded-full px-4 text-sm font-semibold"
          :class="usesHeroHeader
            ? (isActiveRoute(item.href) ? 'text-white' : 'text-white/[0.72] hover:text-white')
            : (isActiveRoute(item.href) ? 'text-panel-black' : 'text-neutral-600 hover:text-panel-black')"
          @pointerenter="previewLiquidIndicator(index)"
          @focus="focusLiquidIndicator(index)"
          @blur="blurLiquidIndicator"
        >
          <span class="relative z-10">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="hidden shrink-0 items-center justify-self-end gap-4 xl:flex">
        <a :href="companyContact.phoneHref" class="group border-r pr-4 text-right" :class="usesHeroHeader ? 'border-white/20' : 'border-panel-line'">
          <span class="block text-[0.6rem] font-semibold uppercase tracking-[0.14em]" :class="usesHeroHeader ? 'text-white/55' : 'text-neutral-500'">Hotline kỹ thuật</span>
          <span class="mt-1 block text-sm font-bold tracking-[0.025em] transition-colors group-hover:text-[#d79068]" :class="usesHeroHeader ? 'text-white' : 'text-panel-black'">{{ companyContact.phoneDisplay }}</span>
        </a>
        <NuxtLink
          to="/contact"
          class="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-xs font-bold shadow-[0_8px_24px_rgba(32,35,31,0.12)] transition"
          :class="usesHeroHeader ? 'bg-white text-panel-black hover:bg-[#d79068] hover:text-white' : 'bg-panel-black text-white hover:bg-[#b56b48]'"
        >
          Liên hệ
          <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>

      <button
        ref="menuButton"
        type="button"
        class="ml-auto grid h-11 w-11 place-items-center rounded-full border shadow-[0_5px_18px_rgba(44,40,35,0.04)] transition xl:hidden"
        :class="usesHeroHeader ? 'border-white/30 bg-black/10 text-white hover:border-white/60' : 'border-panel-line bg-white/80 text-panel-black hover:border-[#b56b48] hover:text-[#9f5f42]'"
        :aria-expanded="isMenuOpen"
        aria-controls="static-mobile-navigation"
        :aria-label="isMenuOpen ? 'Đóng menu' : 'Mở menu'"
        @click="toggleMenu"
      >
        <span class="relative block h-5 w-5" aria-hidden="true">
          <span class="menu-line absolute left-0 top-1 block h-px w-5 bg-current" :class="isMenuOpen ? 'translate-y-[6px] rotate-45' : ''" />
          <span class="menu-line absolute left-0 top-2.5 block h-px w-5 bg-current" :class="isMenuOpen ? 'scale-x-0 opacity-0' : ''" />
          <span class="menu-line absolute left-0 top-4 block h-px w-5 bg-current" :class="isMenuOpen ? '-translate-y-[6px] -rotate-45' : ''" />
        </span>
      </button>
    </div>

    <Transition name="mobile-nav">
      <div
        v-if="isMenuOpen"
        id="static-mobile-navigation"
        ref="mobileNavigation"
        class="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-panel-line bg-panel-ivory shadow-[0_22px_44px_rgba(44,40,35,0.1)] xl:hidden"
      >
        <nav class="container-site py-3" aria-label="Điều hướng di động">
          <NuxtLink
            v-for="item in headerNavigation"
            :key="item.href"
            :to="item.href"
            :aria-current="isActiveRoute(item.href) ? 'page' : undefined"
            :data-nav-active="isActiveRoute(item.href) ? 'true' : 'false'"
            class="group my-1 flex min-h-14 items-center justify-between rounded-2xl border border-transparent px-4 text-[0.95rem] font-semibold transition"
            :class="isActiveRoute(item.href)
              ? 'border-[#9f5f42]/35 bg-transparent text-[#7e422f] shadow-[0_7px_18px_rgba(126,66,47,0.06)]'
              : 'text-[#30332f] hover:bg-white/55 hover:text-[#9f5f42]'"
          >
            <span>{{ item.label }}</span>
            <span
              v-if="isActiveRoute(item.href)"
              class="inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#7e422f]"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-[#b56b48]" aria-hidden="true" />
              Đang xem
            </span>
            <span v-else class="text-lg text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#9f5f42]" aria-hidden="true">→</span>
          </NuxtLink>

          <div class="grid gap-3 py-5 sm:grid-cols-2">
            <a
              :href="companyContact.phoneHref"
              class="flex min-h-12 items-center justify-between rounded-full border border-[#d8d0c5] bg-white px-5 text-sm font-semibold text-[#20231f] hover:border-[#b77555] hover:text-[#9f5f42]"
            >
              <span>Gọi ngay</span>
              <span class="text-xs">{{ companyContact.phoneDisplay }}</span>
            </a>
            <NuxtLink to="/contact" class="flex min-h-12 items-center justify-between rounded-full bg-[#20231f] px-5 text-sm font-bold text-white hover:bg-[#9f5f42]">
              <span>Gửi yêu cầu</span>
              <span aria-hidden="true">↗</span>
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.warm-header {
  transition:
    color 280ms ease,
    background-color 280ms ease,
    border-color 280ms ease,
    box-shadow 280ms ease;
}

.header-light {
  box-shadow: 0 1px 0 rgba(44, 40, 35, 0.02), 0 8px 24px rgba(44, 40, 35, 0.03);
}

.header-hero {
  box-shadow: none;
}

.header-hero::before {
  position: absolute;
  z-index: -1;
  top: 0;
  right: 0;
  left: 0;
  height: 7rem;
  background: linear-gradient(180deg, rgba(17, 24, 20, 0.72) 0%, rgba(17, 24, 20, 0.38) 56%, rgba(17, 24, 20, 0) 100%);
  content: '';
  pointer-events: none;
}

.desktop-nav-link {
  transition: color 240ms ease;
}

.desktop-navigation {
  isolation: isolate;
}

.liquid-nav-indicator {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 0;
  height: 2.75rem;
  margin-top: -1.375rem;
  overflow: visible;
  border-radius: 9999px;
  pointer-events: none;
  will-change: width, transform;
  transition: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

.liquid-nav-indicator--ready {
  transition:
    width 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 560ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease,
    background-color 280ms ease,
    border-color 280ms ease,
    box-shadow 280ms ease;
}

.liquid-nav-surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: inherit;
  background: transparent;
  pointer-events: none;
  will-change: transform, border-radius;
  transition: border-color 280ms ease, box-shadow 280ms ease;
}

.liquid-nav-surface::after {
  position: absolute;
  top: 0.46rem;
  left: 18%;
  width: 0.46rem;
  height: 0.16rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.28);
  content: '';
  opacity: 0.42;
}

.liquid-nav-indicator--hero .liquid-nav-surface {
  border-color: rgba(255, 255, 255, 0.34);
  background: transparent;
  box-shadow:
    0 0 14px rgba(255, 255, 255, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.14);
}

.liquid-nav-indicator--light .liquid-nav-surface {
  border-color: rgba(44, 40, 35, 0.22);
  background: transparent;
  box-shadow: 0 5px 16px rgba(44, 40, 35, 0.08);
}

.liquid-nav-indicator--light .liquid-nav-surface::after {
  background: rgba(255, 255, 255, 0.72);
  opacity: 0.56;
}

.liquid-nav-indicator--moving-right .liquid-nav-surface {
  transform-origin: left center;
  animation: liquid-drop-right 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.liquid-nav-indicator--moving-left .liquid-nav-surface {
  transform-origin: right center;
  animation: liquid-drop-left 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes liquid-drop-right {
  0%,
  100% {
    border-radius: 9999px;
    transform: scaleX(1) scaleY(1);
  }
  26% {
    border-radius: 48% 62% 62% 48% / 50%;
    transform: scaleX(1.075) scaleY(0.935);
  }
  58% {
    border-radius: 58% 46% 46% 58% / 50%;
    transform: scaleX(0.985) scaleY(1.03);
  }
  80% {
    transform: scaleX(1.01) scaleY(0.995);
  }
}

@keyframes liquid-drop-left {
  0%,
  100% {
    border-radius: 9999px;
    transform: scaleX(1) scaleY(1);
  }
  26% {
    border-radius: 62% 48% 48% 62% / 50%;
    transform: scaleX(1.075) scaleY(0.935);
  }
  58% {
    border-radius: 46% 58% 58% 46% / 50%;
    transform: scaleX(0.985) scaleY(1.03);
  }
  80% {
    transform: scaleX(1.01) scaleY(0.995);
  }
}

.warm-header :focus-visible {
  outline-color: #9f5f42;
}

.menu-line {
  transform-origin: center;
  transition: transform 180ms ease, opacity 180ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .liquid-nav-indicator,
  .liquid-nav-surface,
  .menu-line,
  .warm-header a,
  .warm-header span {
    animation: none !important;
    transition: none !important;
  }
}
</style>
