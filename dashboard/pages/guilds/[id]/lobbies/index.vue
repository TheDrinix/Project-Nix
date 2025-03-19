<script setup lang="ts">
import { useLobbyStore } from '~/stores/lobbyStore';

const route = useRoute();
const lobbyStore = useLobbyStore();

const guildId = computed(() => route.params.id as string);

const { data, status, error } = useLazyAsyncData(`lobbies`, () => {
  return lobbyStore.fetchLobbies(guildId.value);
}, {
  watch: [guildId],
});

const lobbies = computed(() => {
  return lobbyStore.getGuildLobbies(guildId.value);
});
</script>

<template>
  <div class="w-full">
    <h3 class="text-lg font-medium">Lobbies</h3>
    <UDivider />
    <div v-if="status === 'success'" class="flex flex-col gap-2">
      <Lobby v-for="lobby in lobbies" v-bind="lobby" :key="lobby.id" />
    </div>
    <div v-else-if="status === 'pending'" class="flex flex-col gap-2">
      <USkeleton v-for="i in 3" :key="i" class="h-[13.5rem] w-full" />
    </div>
  </div>
</template>

<style scoped>

</style>