<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} | Thái Thanh Panel` : 'Thái Thanh Panel',
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
