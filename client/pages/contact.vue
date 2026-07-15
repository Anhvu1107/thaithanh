<script setup lang="ts">
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)
const consultationChecklist = computed(() => content.value.consultationChecklist)

const contactMethods = computed(() => {
  const methods = [
    { label: 'Gọi trực tiếp', value: companyContact.value.phoneDisplay, href: companyContact.value.phoneHref, note: 'Trao đổi nhanh trong giờ làm việc' },
  ]

  if (companyContact.value.emailDisplay && companyContact.value.emailHref) {
    methods.push({
      label: 'Gửi email',
      value: companyContact.value.emailDisplay,
      href: companyContact.value.emailHref,
      note: 'Phù hợp khi có bản vẽ hoặc danh sách quy cách',
    })
  }

  if (companyContact.value.zaloHref) {
    methods.push({
      label: 'Nhắn Zalo',
      value: 'Mở cuộc trò chuyện',
      href: companyContact.value.zaloHref,
      note: 'Gửi hình ảnh mặt bằng và thông tin ngắn',
    })
  }

  return methods
})

const contactDescription = computed(() => companyContact.value.zaloHref
  ? 'Gửi form liên hệ nhanh, gọi điện, gửi email hoặc nhắn Zalo để trao đổi yêu cầu công trình.'
  : 'Gửi form liên hệ nhanh hoặc gọi điện để trao đổi yêu cầu công trình; khách hàng không cần mở ứng dụng email.')

usePageSeo({
  title: 'Liên hệ',
  description: contactDescription,
  path: '/contact',
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Liên hệ"
      title="Trao đổi nhanh về panel và phụ kiện công trình."
      :description="contactDescription"
      image="/images/insulation/cold-door-editorial.jpg"
      image-alt="Cửa Inox 304 và hệ panel cách nhiệt"
      primary-label="Gửi yêu cầu nhanh"
      primary-href="#quick-contact-form"
      secondary-label="Gọi 0363 003 507"
      :secondary-href="companyContact.phoneHref"
    />

    <section class="section bg-[#f4f1eb]">
      <div class="container-site grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16">
        <div data-reveal class="min-w-0">
          <p class="section-kicker">Kênh liên hệ</p>
          <h2 class="mt-4 max-w-lg text-3xl font-semibold leading-tight text-panel-black sm:text-4xl">Chọn cách thuận tiện nhất để bắt đầu.</h2>
          <p class="mt-5 max-w-xl text-sm leading-7 text-neutral-600">Gọi trực tiếp khi cần trao đổi nhanh, hoặc gửi yêu cầu để Thái Thanh xem trước quy cách và chủ động liên hệ lại.</p>

          <div class="mt-8 overflow-hidden rounded-2xl border border-[#ddd6cc] bg-white shadow-[0_18px_50px_rgba(28,33,30,0.06)]">
            <a
              v-for="method in contactMethods"
              :key="method.label"
              :href="method.href"
              :target="method.href.startsWith('http') ? '_blank' : undefined"
              :rel="method.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="contact-method group grid min-h-28 gap-3 border-b border-[#e7e1d8] px-5 py-6 last:border-b-0 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:px-6"
            >
              <span class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9f5f42]">{{ method.label }}</span>
              <span class="min-w-0">
                <span class="block break-words text-lg font-semibold text-panel-black transition-colors group-hover:text-[#9f5f42] sm:text-xl">{{ method.value }}</span>
                <span class="mt-2 block text-sm text-neutral-500">{{ method.note }}</span>
                <span v-if="method.href.startsWith('http')" class="sr-only">(mở trong tab mới)</span>
              </span>
              <span class="contact-method-arrow grid h-10 w-10 place-items-center rounded-full border border-[#ddd6cc] text-lg text-panel-black transition-colors group-hover:border-panel-black group-hover:bg-panel-black group-hover:text-white" aria-hidden="true">↗</span>
            </a>
          </div>

          <dl class="mt-6 grid gap-5 rounded-2xl bg-[#0d1714] p-6 text-white sm:grid-cols-2">
            <div>
              <dt class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6906e]">Giờ làm việc</dt>
              <dd class="mt-2 text-sm font-semibold text-white">{{ companyContact.hours }}</dd>
            </div>
            <div>
              <dt class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6906e]">Khu vực hỗ trợ</dt>
              <dd class="mt-2 text-sm font-semibold text-white">{{ companyContact.serviceArea }}</dd>
            </div>
          </dl>
        </div>

        <div class="lg:sticky lg:top-28">
          <StaticContactForm />
        </div>
      </div>
    </section>

    <section class="section bg-panel-black text-white">
      <div data-reveal class="container-site grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-accent-lime">Chuẩn bị trước khi liên hệ</p>
          <h2 class="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">Bốn thông tin giúp trao đổi nhanh hơn.</h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-emerald-100">
            Bạn vẫn có thể gửi yêu cầu từ thông tin sơ bộ; danh sách này giúp bước tư vấn nhanh và sát hơn.
          </p>
        </div>
        <ol class="grid gap-px bg-white/15 sm:grid-cols-2">
          <li v-for="(item, index) in consultationChecklist" :key="item" class="grid min-h-32 grid-cols-[2.5rem_1fr] gap-4 bg-panel-black p-5 text-sm leading-6 text-emerald-50 sm:p-6">
            <span class="font-mono font-bold text-accent-lime">0{{ index + 1 }}</span>
            <span>{{ item }}</span>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>
