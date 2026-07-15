<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Có mặt bằng hoặc yêu cầu nhiệt độ cụ thể?',
  description: 'Gửi thông tin công trình để đội kỹ thuật trao đổi cấu hình panel, cửa và phụ kiện phù hợp.',
})

const { content } = useSiteContent()
const companyContact = computed(() => content.value.companyContact)
</script>

<template>
  <section class="border-y border-panel-line bg-white py-14 sm:py-18 lg:py-24">
    <div class="container-site">
      <div data-reveal class="contact-band grid gap-9 border border-panel-line bg-panel-ivory p-6 shadow-[0_22px_70px_rgba(28,33,30,0.08)] sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:p-14">
        <div>
          <p class="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-accent-steel">
            <span class="h-px w-8 bg-[#d79068]" aria-hidden="true" />
            Bắt đầu từ nhu cầu thực tế
          </p>
          <h2 class="mt-5 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-panel-black sm:text-4xl lg:text-5xl">{{ title }}</h2>
          <p class="mt-5 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">{{ description }}</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
          <a :href="companyContact.phoneHref" class="btn border border-panel-line bg-white text-panel-black hover:border-panel-black hover:bg-panel-black hover:text-white">
            {{ companyContact.phoneDisplay }}
          </a>
          <NuxtLink to="/contact#quick-contact-form" class="btn gap-2 border border-panel-black bg-panel-black text-white shadow-soft hover:border-[#d79068] hover:bg-[#d79068]">
            Gửi yêu cầu
            <span aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
