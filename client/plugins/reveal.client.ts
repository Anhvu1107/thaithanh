const REVEAL_SELECTOR = '[data-reveal]'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const clampDelay = (value: string | undefined) => {
  const parsed = Number(value || 0)
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 240) : 0
}

export default defineNuxtPlugin((nuxtApp) => {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
  const observedElements = new Set<HTMLElement>()
  const activeAnimations = new Map<HTMLElement, Animation>()

  const markRevealed = (element: HTMLElement) => {
    element.dataset.revealState = 'revealed'
    observedElements.delete(element)
  }

  const revealElement = (element: HTMLElement) => {
    if (element.dataset.revealState === 'revealed') return

    observer?.unobserve(element)
    observedElements.delete(element)

    if (reducedMotion.matches || typeof element.animate !== 'function') {
      markRevealed(element)
      return
    }

    element.dataset.revealState = 'animating'
    const variant = element.dataset.reveal || 'default'
    const keyframes: Keyframe[] = variant === 'media'
      ? [
          { opacity: 0, transform: 'scale(1.035) translate3d(0, 18px, 0)', clipPath: 'inset(0 0 10% 0)' },
          { opacity: 1, transform: 'scale(1) translate3d(0, 0, 0)', clipPath: 'inset(0 0 0 0)' },
        ]
      : variant === 'left'
        ? [
            { opacity: 0, transform: 'translate3d(-24px, 0, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' },
          ]
        : [
            { opacity: 0, transform: 'translate3d(0, 22px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' },
          ]

    const animation = element.animate(keyframes, {
      duration: variant === 'media' ? 820 : 620,
      delay: clampDelay(element.dataset.revealDelay),
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both',
    })

    activeAnimations.set(element, animation)
    void animation.finished
      .catch(() => undefined)
      .then(() => {
        activeAnimations.delete(element)
        animation.cancel()
        markRevealed(element)
      })
  }

  const observer = typeof IntersectionObserver === 'undefined'
    ? undefined
    : new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) revealElement(entry.target as HTMLElement)
        }
      }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      })

  const prepareRevealElements = () => {
    for (const element of observedElements) {
      if (!element.isConnected) {
        observer?.unobserve(element)
        observedElements.delete(element)
      }
    }

    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
      if (element.dataset.revealState) return

      if (reducedMotion.matches || !observer || typeof element.animate !== 'function') {
        markRevealed(element)
        return
      }

      element.dataset.revealState = 'waiting'
      observedElements.add(element)
      observer.observe(element)
    })
  }

  const handleMotionPreference = () => {
    if (!reducedMotion.matches) return

    observer?.disconnect()
    for (const animation of activeAnimations.values()) animation.cancel()
    activeAnimations.clear()
    document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(markRevealed)
  }

  reducedMotion.addEventListener('change', handleMotionPreference)
  nuxtApp.hook('app:mounted', prepareRevealElements)
  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(prepareRevealElements)
  })
})
