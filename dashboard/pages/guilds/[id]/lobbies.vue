<script setup lang="ts">
const route = useRoute();

const guildId = computed(() => route.params.id as string);

const res = useFetch(`/api/guilds/${guildId.value}/lobbies`)

</script>

<template>
  <div class="w-full">
    <h3 class="text-lg font-medium">Lobbies</h3>
    <UDivider />
    <div class="flex flex-col gap-2">
      <Lobby v-for="lobby in res.data.value" v-bind="lobby" :key="lobby.id" />
    </div>
  </div>
</template>

<style scoped>

</style>