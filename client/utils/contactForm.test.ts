import { describe, expect, it } from 'vitest'
import { buildQuickContactPayload, validateQuickContact } from './contactForm'

describe('quick contact validation', () => {
  it('accepts Vietnamese names and common phone formatting', () => {
    const result = validateQuickContact({
      name: '  Nguyễn Văn An  ',
      phone: ' 0363 003 507 ',
      email: '  an.nguyen@gmail.com  ',
      message: ' Tôi cần tư vấn panel cho kho mát. ',
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual({})
    expect(result.normalized).toEqual({
      name: 'Nguyễn Văn An',
      phone: '0363 003 507',
      email: 'an.nguyen@gmail.com',
      message: 'Tôi cần tư vấn panel cho kho mát.',
    })
  })

  it('accepts an international phone number', () => {
    expect(validateQuickContact({
      name: 'Khách hàng',
      phone: '+84 (363) 003-507',
      email: '',
      message: 'Cần trao đổi về cửa kho lạnh.',
    }).valid).toBe(true)
  })

  it('accepts a blank optional email', () => {
    const result = validateQuickContact({
      name: 'Khách hàng',
      phone: '0363003507',
      email: '   ',
      message: 'Cần tư vấn panel cho công trình.',
    })

    expect(result.valid).toBe(true)
    expect(result.normalized.email).toBe('')
    expect(result.errors.email).toBeUndefined()
  })

  it('rejects an invalid optional email', () => {
    const result = validateQuickContact({
      name: 'Khách hàng',
      phone: '0363003507',
      email: 'khach-hang@gmail',
      message: 'Cần tư vấn panel cho công trình.',
    })

    expect(result.valid).toBe(false)
    expect(result.errors.email).toMatch(/email hợp lệ hoặc để trống/)
  })

  it('rejects missing or undersized fields', () => {
    const result = validateQuickContact({ name: 'A', phone: '123', email: '', message: 'Ngắn' })

    expect(result.valid).toBe(false)
    expect(result.errors.name).toMatch(/ít nhất 2 ký tự/)
    expect(result.errors.phone).toMatch(/8 đến 15 chữ số/)
    expect(result.errors.message).toMatch(/ít nhất 10 ký tự/)
  })

  it('rejects oversized fields and phone numbers', () => {
    const result = validateQuickContact({
      name: 'A'.repeat(81),
      phone: '1'.repeat(16),
      email: `${'a'.repeat(245)}@example.com`,
      message: 'A'.repeat(2001),
    })

    expect(result.valid).toBe(false)
    expect(Object.keys(result.errors)).toEqual(['name', 'phone', 'email', 'message'])
  })

  it('omits a blank email from the Web3Forms payload', () => {
    const payload = buildQuickContactPayload({
      name: ' Khách hàng ',
      phone: ' 0363003507 ',
      email: '   ',
      message: ' Cần tư vấn panel cho công trình. ',
    }, 'test-key', 'http://localhost/contact')

    expect(payload).not.toHaveProperty('email')
    expect(payload.name).toBe('Khách hàng')
    expect(payload.phone).toBe('0363003507')
  })

  it('includes a trimmed email in the Web3Forms payload', () => {
    const payload = buildQuickContactPayload({
      name: 'Khách hàng',
      phone: '0363003507',
      email: '  khach.hang@gmail.com ',
      message: 'Cần tư vấn panel cho công trình.',
    }, 'test-key', 'http://localhost/contact')

    expect(payload.email).toBe('khach.hang@gmail.com')
  })
})
