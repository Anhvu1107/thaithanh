<script setup lang="ts">
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)
const consultationChecklist = computed(() => content.value.consultationChecklist)

const contactMethods = computed(() => {
  const methods = [
    { label: 'Gọi trực tiếp', value: companyContact.value.phoneDisplay, href: companyContact.value.phoneHref, note: 'Bấm gọi để trao đổi nhanh trong giờ làm việc' },
  ]

  if (companyContact.value.zaloHref) {
    methods.push({
      label: 'Nhắn Zalo',
      value: 'Gửi ảnh và kích thước',
      href: companyContact.value.zaloHref,
      note: 'Phù hợp khi bạn có ảnh mặt bằng, bản vẽ hoặc số lượng cần mua',
    })
  }

  if (companyContact.value.emailDisplay && companyContact.value.emailHref) {
    methods.push({
      label: 'Gửi email',
      value: companyContact.value.emailDisplay,
      href: companyContact.value.emailHref,
      note: 'Dùng khi có danh sách quy cách hoặc hồ sơ cần gửi',
    })
  }

  return methods
})

const contactDescription = computed(() => companyContact.value.zaloHref
  ? `Nhắn Zalo để gửi ảnh hoặc kích thước, gọi ${companyContact.value.phoneDisplay} để trao đổi nhanh, hoặc để lại số điện thoại để Thái Thanh liên hệ lại.`
  : `Gọi ${companyContact.value.phoneDisplay} để trao đổi nhanh hoặc để lại số điện thoại để Thái Thanh liên hệ lại.`)

usePageSeo({
  title: 'Liên hệ',
  description: contactDescription,
  path: '/contact',
  webPageType: 'ContactPage',
  breadcrumbs: [
    { name: 'Liên hệ', path: '/contact' },
  ],
})
</script>

<template>
  <div>
    <StaticPageHero
      eyebrow="Liên hệ"
      title="Gọi hoặc nhắn Zalo để nhận tư vấn quy cách."
      :description="contactDescription"
      primary-label="Nhắn Zalo gửi ảnh"
      :primary-href="companyContact.zaloHref"
      :secondary-label="`Gọi ${companyContact.phoneDisplay}`"
      :secondary-href="companyContact.phoneHref"
    />

    <section class="bg-[#f4f1eb] py-10 sm:py-14 lg:py-20">
      <div class="container-site grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-14">
        <div data-reveal class="min-w-0">
          <p class="section-kicker">Kênh liên hệ</p>
          <h2 class="mt-4 max-w-lg text-3xl font-semibold leading-tight text-panel-black sm:text-4xl">Gọi, nhắn Zalo hoặc yêu cầu gọi lại.</h2>
          <p class="mt-5 max-w-xl text-sm leading-7 text-neutral-600">Chọn cách thuận tiện nhất: gọi ngay, gửi ảnh qua Zalo, hoặc điền form để Thái Thanh liên hệ lại theo số điện thoại của bạn.</p>

          <div class="mt-6 overflow-hidden rounded-2xl border border-[#ddd6cc] bg-white shadow-[0_18px_50px_rgba(28,33,30,0.06)]">
            <a
              v-for="method in contactMethods"
              :key="method.label"
              :href="method.href"
              :target="method.href.startsWith('http') ? '_blank' : undefined"
              :rel="method.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="contact-method group grid min-h-24 gap-3 border-b border-[#e7e1d8] px-4 py-5 last:border-b-0 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:px-6"
              :class="method.label === 'Nhắn Zalo'
                ? 'bg-[#eff6ff]'
                : method.label === 'Gọi trực tiếp'
                  ? 'bg-[#fff8f4]'
                  : 'bg-white'"
            >
              <span
                class="text-[10px] font-bold uppercase tracking-[0.18em]"
                :class="method.label === 'Nhắn Zalo' ? 'text-[#0668e8]' : 'text-[#9f5f42]'"
              >{{ method.label }}</span>
              <span class="min-w-0">
                <span class="block break-words text-lg font-semibold text-panel-black transition-colors group-hover:text-[#9f5f42] sm:text-xl">{{ method.value }}</span>
                <span class="mt-2 block text-sm text-neutral-500">{{ method.note }}</span>
                <span v-if="method.href.startsWith('http')" class="sr-only">(mở trong tab mới)</span>
              </span>
              <span
                class="contact-method-arrow grid h-10 w-10 place-items-center rounded-full border text-lg text-panel-black transition-colors group-hover:border-panel-black group-hover:bg-panel-black group-hover:text-white"
                :class="method.label === 'Nhắn Zalo' ? 'border-[#9cc5fa]' : 'border-[#ddd6cc]'"
                aria-hidden="true"
              >↗</span>
            </a>
          </div>

          <a
            href="#quick-contact-form"
            class="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#874a2d] underline decoration-[#b25d3a]/40 underline-offset-4 hover:text-panel-black"
          >
            Yêu cầu gọi lại
            <span aria-hidden="true">↓</span>
          </a>

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

    <section class="bg-panel-black py-10 text-white sm:py-14 lg:py-20">
      <div data-reveal class="container-site grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-10">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-accent-lime">Chuẩn bị trước khi liên hệ</p>
          <h2 class="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">Bốn thông tin giúp báo giá sát hơn.</h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-emerald-100">
            Chưa đủ dữ liệu cũng không sao. Gửi những gì bạn đã có, Thái Thanh sẽ hỏi thêm phần còn thiếu.
          </p>
        </div>
        <ol class="grid gap-px bg-white/15 sm:grid-cols-2">
          <li v-for="(item, index) in consultationChecklist" :key="item" class="grid min-h-24 grid-cols-[2.5rem_1fr] gap-4 bg-panel-black p-4 text-sm leading-6 text-emerald-50 sm:min-h-28 sm:p-5">
            <span class="font-mono font-bold text-accent-lime">0{{ index + 1 }}</span>
            <span>{{ item }}</span>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>
