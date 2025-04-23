<script setup lang="ts">
const route = useRoute();
const lobbyStore = useLobbyStore();
const channelStore = useChannelStore();

const lobbyId = computed(() => route.params.lobbyId as string);

const lobby = computed(() => {
  return lobbyStore.getLobby(lobbyId.value);
});

if (!lobby.value) {
  await navigateTo(`/guilds/${route.params.id}/lobbies`);
}

const lobbyName = computed(() => {
  return channelStore.getChannelName(lobby.value?.id ?? '');
});
</script>

<template>
  <div>
    <h3 class="text-lg font-medium"><span class="text-primary">Editing</span> {{lobbyName}} lobby</h3>
    <USeparator class="my-2" />
    <div v-if="lobby">
      <LobbyEditForm :lobby="lobby" />
    </div>
  </div>
</template>

<style scoped>

</style>