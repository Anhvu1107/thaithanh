<script setup lang="ts">
useHead({
  titleTemplate: title => title && title !== 'Tấm cách nhiệt Thái Thanh'
    ? `${title} | Tấm cách nhiệt Thái Thanh`
    : 'Tấm cách nhiệt Thái Thanh',
  htmlAttrs: { lang: 'vi' },
  meta: [
    { name: 'theme-color', content: '#0F211B' },
    { name: 'format-detection', content: 'telephone=no' },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
