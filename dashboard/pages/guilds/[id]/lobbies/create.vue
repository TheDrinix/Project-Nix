<script setup lang="ts">
import CreateForm from '~/components/lobby/CreateForm.vue';

const route = useRoute();

const guildId = computed(() => route.params.id as string);
</script>

<template>
  <div class="w-full">
    <h3 class="text-lg font-medium">Create lobby</h3>
    <USeparator class="my-2" />
    <CreateForm :guild-id="guildId" />
  </div>
</template>

<style scoped>

</style>