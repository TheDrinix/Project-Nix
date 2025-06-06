<script lang="ts" setup>
const preferedColorScheme = usePreferredColorScheme()

const dashboardScreenshotUrl = computed(() => {
  const imageNumber = Math.floor(Math.random() * 2) + 1; // Randomly select an image number between 1 and 3

  return preferedColorScheme.value === 'dark'
    ? `/images/dashboard_screenshot_${imageNumber}_dark.png`
    : `/images/dashboard_screenshot_${imageNumber}_light.png`;
})
</script>

<template>
  <NuxtImg
    :src="dashboardScreenshotUrl"
    preload
    :placeholder="[50, 25]"
    alt="Dashboard Screenshot"
    class="rounded-lg shadow-lg"
  />
</template>

<style>

</style>