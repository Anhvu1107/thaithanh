<script setup lang="ts">
import type { QuickContactField } from '~/utils/contactForm'
import { buildQuickContactPayload, validateQuickContact } from '~/utils/contactForm'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

interface Web3FormsResponse {
  success?: boolean
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const runtimeConfig = useRuntimeConfig()
const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)
const accessKey = computed(() => String(runtimeConfig.public.contactFormAccessKey || '').trim())
const isConfigured = computed(() => accessKey.value.length > 0)

const fields = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})
const consent = ref(false)
const botcheck = ref(false)
const errors = ref<Partial<Record<QuickContactField | 'consent', string>>>({})
const submitState = ref<SubmitState>('idle')
const submitMessage = ref('')
const isClientValidationEnhanced = ref(false)

const nameInput = ref<HTMLInputElement | null>(null)
const phoneInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)
const consentInput = ref<HTMLInputElement | null>(null)

const isSubmitting = computed(() => submitState.value === 'submitting')

onMounted(() => {
  // Keep native HTML validation in the server-rendered form. Once Vue is active,
  // the existing accessible inline validation provides the enhanced experience.
  isClientValidationEnhanced.value = true
})

const clearSubmitFeedback = () => {
  if (submitState.value === 'submitting') return
  submitState.value = 'idle'
  submitMessage.value = ''
}

const clearFieldError = (field: QuickContactField | 'consent') => {
  if (errors.value[field]) {
    const nextErrors = { ...errors.value }
    delete nextErrors[field]
    errors.value = nextErrors
  }
  clearSubmitFeedback()
}

const focusFirstError = async () => {
  await nextTick()
  const inputByField = {
    name: nameInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
    message: messageInput.value,
    consent: consentInput.value,
  }
  const firstInvalidField = (['phone', 'name', 'email', 'message', 'consent'] as const)
    .find(field => errors.value[field])
  if (firstInvalidField) inputByField[firstInvalidField]?.focus()
}

const submitContactForm = async () => {
  clearSubmitFeedback()

  if (botcheck.value) {
    submitState.value = 'success'
    submitMessage.value = 'Yêu cầu đã được ghi nhận.'
    return
  }

  const validation = validateQuickContact(fields)
  errors.value = {
    ...validation.errors,
    ...(!consent.value ? { consent: 'Vui lòng đồng ý để chúng tôi sử dụng thông tin này nhằm liên hệ lại.' } : {}),
  }

  if (!validation.valid || !consent.value) {
    submitState.value = 'error'
    submitMessage.value = 'Vui lòng kiểm tra lại các trường được đánh dấu.'
    await focusFirstError()
    return
  }

  if (!isConfigured.value) {
    submitState.value = 'error'
    submitMessage.value = `Kênh nhận yêu cầu đang chờ kích hoạt. Vui lòng gọi ${companyContact.value.phoneDisplay}.`
    return
  }

  submitState.value = 'submitting'
  submitMessage.value = 'Đang gửi yêu cầu...'
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildQuickContactPayload(
        validation.normalized,
        accessKey.value,
        window.location.href,
      )),
      signal: controller.signal,
    })
    const result = await response.json() as Web3FormsResponse
    if (!response.ok || !result.success) throw new Error('Contact form submission failed')

    fields.name = ''
    fields.phone = ''
    fields.email = ''
    fields.message = ''
    consent.value = false
    errors.value = {}
    submitState.value = 'success'
    submitMessage.value = 'Đã nhận yêu cầu. Thái Thanh sẽ liên hệ lại theo số điện thoại bạn cung cấp.'
  } catch {
    submitState.value = 'error'
    submitMessage.value = `Chưa thể gửi yêu cầu gọi lại. Vui lòng thử lại hoặc gọi ${companyContact.value.phoneDisplay}.`
  } finally {
    window.clearTimeout(timeoutId)
  }
}
</script>

<template>
  <section
    aria-labelledby="quick-contact-heading"
    class="relative overflow-hidden rounded-2xl border border-[#ddd6cc] border-t-[#9f5f42] bg-white p-6 text-panel-black shadow-[0_24px_70px_rgba(28,33,30,0.1)] sm:p-8 lg:p-9"
  >
    <p class="text-xs font-bold uppercase tracking-[0.2em] text-accent-steel">Yêu cầu gọi lại</p>
    <h2 id="quick-contact-heading" class="mt-4 text-2xl font-semibold leading-tight text-panel-black sm:text-3xl">
      Để lại số điện thoại, Thái Thanh sẽ liên hệ lại.
    </h2>
    <p class="mt-4 text-sm leading-7 text-neutral-600">
      Số điện thoại là thông tin chính. Nếu có, hãy ghi thêm sản phẩm, kích thước, số lượng và nơi giao; email không bắt buộc.
    </p>

    <div class="mt-5 flex items-start gap-3 rounded-xl border border-[#e8b99e] bg-[#fff8f4] px-4 py-3 text-sm leading-6 text-[#6f3925]">
      <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#d66f4a] text-xs font-black text-white" aria-hidden="true">1</span>
      <p><strong>Số điện thoại để gọi lại</strong> · Ghi nội dung sơ bộ để Thái Thanh chuẩn bị trước khi trao đổi.</p>
    </div>

    <p
      v-if="!isConfigured"
      class="mt-5 border border-amber-300/50 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900"
    >
      Form đang chờ kích hoạt kênh nhận yêu cầu. Nếu cần trao đổi ngay, vui lòng gọi hotline bên cạnh.
    </p>

    <form
      id="quick-contact-form"
      class="mt-6 scroll-mt-48 space-y-5"
      :data-configured="isConfigured"
      :action="isConfigured ? WEB3FORMS_ENDPOINT : undefined"
      method="POST"
      :novalidate="isClientValidationEnhanced"
      @submit.prevent="submitContactForm"
    >
      <input type="hidden" name="access_key" :value="accessKey">
      <input type="hidden" name="subject" value="Yêu cầu tư vấn mới từ website Thái Thanh Panel">
      <input type="hidden" name="from_name" value="Website Thái Thanh Panel">
      <input v-model="botcheck" type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

      <div>
        <label for="quick-contact-phone" class="block text-xs font-bold uppercase tracking-[0.16em] text-neutral-600">
          Số điện thoại để gọi lại <span class="text-[#b25d3a]" aria-hidden="true">*</span>
        </label>
        <input
          id="quick-contact-phone"
          ref="phoneInput"
          v-model="fields.phone"
          name="phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          pattern="(?=(?:[^0-9]*[0-9]){8,15}[^0-9]*$)[0-9+().\s-]+"
          maxlength="24"
          required
          title="Nhập số điện thoại gồm 8 đến 15 chữ số."
          :aria-invalid="Boolean(errors.phone)"
          :aria-describedby="errors.phone ? 'quick-contact-phone-error' : undefined"
          class="mt-2 min-h-12 w-full border border-[#d79068] bg-[#fffaf7] px-4 py-3 text-base font-semibold text-panel-black placeholder:font-normal placeholder:text-neutral-400 focus:border-panel-black focus:outline-none focus:ring-2 focus:ring-[#d79068]/20"
          placeholder="0901 234 567"
          @input="clearFieldError('phone')"
        >
        <p v-if="errors.phone" id="quick-contact-phone-error" class="mt-2 text-xs leading-5 text-red-700">{{ errors.phone }}</p>
      </div>

      <div>
        <label for="quick-contact-name" class="block text-xs font-bold uppercase tracking-[0.16em] text-neutral-600">
          Họ và tên <span class="text-[#b25d3a]" aria-hidden="true">*</span>
        </label>
        <input
          id="quick-contact-name"
          ref="nameInput"
          v-model="fields.name"
          name="name"
          type="text"
          autocomplete="name"
          minlength="2"
          maxlength="80"
          required
          :aria-invalid="Boolean(errors.name)"
          :aria-describedby="errors.name ? 'quick-contact-name-error' : undefined"
          class="mt-2 min-h-12 w-full border border-panel-line bg-white px-4 py-3 text-base text-panel-black placeholder:text-neutral-400 focus:border-panel-black focus:outline-none focus:ring-2 focus:ring-panel-black/10"
          placeholder="Nguyễn Văn An"
          @input="clearFieldError('name')"
        >
        <p v-if="errors.name" id="quick-contact-name-error" class="mt-2 text-xs leading-5 text-red-700">{{ errors.name }}</p>
      </div>

      <div>
        <label for="quick-contact-email" class="block text-xs font-bold uppercase tracking-[0.16em] text-neutral-600">
          Email <span class="normal-case tracking-normal text-neutral-500">(không bắt buộc)</span>
        </label>
        <input
          id="quick-contact-email"
          ref="emailInput"
          v-model="fields.email"
          name="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          maxlength="254"
          spellcheck="false"
          :aria-invalid="Boolean(errors.email)"
          :aria-describedby="errors.email ? 'quick-contact-email-help quick-contact-email-error' : 'quick-contact-email-help'"
          class="mt-2 min-h-12 w-full border border-panel-line bg-white px-4 py-3 text-base text-panel-black placeholder:text-neutral-400 focus:border-panel-black focus:outline-none focus:ring-2 focus:ring-panel-black/10"
          placeholder="tenban@gmail.com"
          @input="clearFieldError('email')"
        >
        <p id="quick-contact-email-help" class="mt-2 text-xs leading-5 text-neutral-500">
          Để nhận phản hồi qua email; nếu để trống, chúng tôi sẽ gọi lại.
        </p>
        <p v-if="errors.email" id="quick-contact-email-error" class="mt-2 text-xs leading-5 text-red-700">{{ errors.email }}</p>
      </div>

      <div>
        <label for="quick-contact-message" class="block text-xs font-bold uppercase tracking-[0.16em] text-neutral-600">
          Thông tin cần báo giá <span class="text-[#b25d3a]" aria-hidden="true">*</span>
        </label>
        <textarea
          id="quick-contact-message"
          ref="messageInput"
          v-model="fields.message"
          name="message"
          rows="5"
          minlength="10"
          maxlength="2000"
          required
          :aria-invalid="Boolean(errors.message)"
          :aria-describedby="errors.message ? 'quick-contact-message-error' : undefined"
          class="mt-2 w-full resize-y border border-panel-line bg-white px-4 py-3 text-base text-panel-black placeholder:text-neutral-400 focus:border-panel-black focus:outline-none focus:ring-2 focus:ring-panel-black/10"
          placeholder="Ví dụ: Panel EPS khoảng 100 m², giao tại Bình Dương..."
          @input="clearFieldError('message')"
        />
        <p v-if="errors.message" id="quick-contact-message-error" class="mt-2 text-xs leading-5 text-red-700">{{ errors.message }}</p>
      </div>

      <div>
        <label class="flex cursor-pointer items-start gap-3 text-xs leading-6 text-neutral-600">
          <input
            id="quick-contact-consent"
            ref="consentInput"
            v-model="consent"
            type="checkbox"
            name="consent"
            value="Đã đồng ý Chính sách quyền riêng tư"
            required
            class="mt-1 h-4 w-4 shrink-0 accent-[#b25d3a]"
            :aria-invalid="Boolean(errors.consent)"
            :aria-describedby="errors.consent ? 'quick-contact-consent-help quick-contact-consent-error' : 'quick-contact-consent-help'"
            @change="clearFieldError('consent')"
          >
          <span>
            Tôi đồng ý để Thái Thanh sử dụng thông tin này nhằm liên hệ và tư vấn theo yêu cầu, theo
            <NuxtLink
              to="/privacy"
              class="font-semibold text-[#8f4d31] underline decoration-[#b25d3a]/40 underline-offset-2 hover:text-panel-black"
              @click.stop
            >
              Chính sách quyền riêng tư
            </NuxtLink>.
          </span>
        </label>
        <p id="quick-contact-consent-help" class="mt-2 text-xs leading-5 text-neutral-500">
          Bạn có thể rút lại đồng ý hoặc yêu cầu xóa thông tin qua email hay hotline của Thái Thanh.
        </p>
        <p v-if="errors.consent" id="quick-contact-consent-error" class="mt-2 text-xs leading-5 text-red-700">{{ errors.consent }}</p>
      </div>

      <button type="submit" class="btn-primary w-full disabled:cursor-wait disabled:opacity-60" :disabled="isSubmitting">
        {{ isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu gọi lại' }}
      </button>

      <p
        v-if="submitState !== 'idle'"
        :role="submitState === 'error' ? 'alert' : 'status'"
        aria-live="polite"
        class="border px-4 py-3 text-sm leading-6"
        :class="submitState === 'success'
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
          : submitState === 'error'
            ? 'border-red-300 bg-red-50 text-red-800'
            : 'border-panel-line bg-white text-neutral-700'"
      >
        {{ submitMessage }}
      </p>

    </form>
  </section>
</template>
