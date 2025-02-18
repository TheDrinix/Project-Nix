<script setup lang="ts">
const route = useRoute();

const guildId = computed(() => route.params.id as string);


</script>

<template>
  <div class="w-full">
    <h3 class="text-lg font-medium">Lobbies</h3>
    <UDivider />

  </div>
</template>

<style scoped>

</style>