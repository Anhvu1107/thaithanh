export interface QuickContactFields {
  name: string
  phone: string
  email: string
  message: string
}

export type QuickContactField = keyof QuickContactFields

export interface QuickContactValidation {
  errors: Partial<Record<QuickContactField, string>>
  normalized: QuickContactFields
  valid: boolean
}

export interface QuickContactPayload {
  access_key: string
  subject: string
  from_name: string
  name: string
  phone: string
  email?: string
  message: string
  consent: string
  source: string
  botcheck: false
}

const PHONE_DIGITS_PATTERN = /\d/g
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeQuickContactFields = (fields: QuickContactFields): QuickContactFields => ({
  name: fields.name.trim(),
  phone: fields.phone.trim(),
  email: fields.email.trim(),
  message: fields.message.trim(),
})

export const validateQuickContact = (fields: QuickContactFields): QuickContactValidation => {
  const normalized = normalizeQuickContactFields(fields)
  const errors: Partial<Record<QuickContactField, string>> = {}

  if (normalized.name.length < 2) {
    errors.name = 'Vui lòng nhập họ tên có ít nhất 2 ký tự.'
  } else if (normalized.name.length > 80) {
    errors.name = 'Họ tên không được dài quá 80 ký tự.'
  }

  const phoneDigits = normalized.phone.match(PHONE_DIGITS_PATTERN)?.join('') || ''
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = 'Vui lòng nhập số điện thoại có từ 8 đến 15 chữ số.'
  }

  if (normalized.email.length > 254 || (normalized.email && !EMAIL_PATTERN.test(normalized.email))) {
    errors.email = 'Vui lòng nhập địa chỉ email hợp lệ hoặc để trống.'
  }

  if (normalized.message.length < 10) {
    errors.message = 'Vui lòng mô tả nhu cầu bằng ít nhất 10 ký tự.'
  } else if (normalized.message.length > 2000) {
    errors.message = 'Nội dung không được dài quá 2.000 ký tự.'
  }

  return {
    errors,
    normalized,
    valid: Object.keys(errors).length === 0,
  }
}

export const buildQuickContactPayload = (
  fields: QuickContactFields,
  accessKey: string,
  source: string,
): QuickContactPayload => {
  const normalized = normalizeQuickContactFields(fields)

  return {
    access_key: accessKey,
    subject: 'Yêu cầu tư vấn mới từ website Thái Thanh Panel',
    from_name: 'Website Thái Thanh Panel',
    name: normalized.name,
    phone: normalized.phone,
    ...(normalized.email ? { email: normalized.email } : {}),
    message: normalized.message,
    consent: 'Đã đồng ý để Thái Thanh liên hệ lại',
    source,
    botcheck: false,
  }
}
