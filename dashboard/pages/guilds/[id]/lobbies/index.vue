<script setup lang="ts">
import { useLobbyStore } from '~/stores/lobbyStore';

const route = useRoute();
const lobbyStore = useLobbyStore();

const guildId = computed(() => route.params.id as string);

let forceRefresh = false;

const { data, status, error, refresh } = useLazyAsyncData(`lobbies`, () => {
  return lobbyStore.fetchLobbies(guildId.value, forceRefresh);
}, {
  watch: [guildId],
});

const lobbies = computed(() => {
  return lobbyStore.getGuildLobbies(guildId.value);
})

const refreshLobbies = async () => {
  forceRefresh = true;

  await refresh();

  forceRefresh = false
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center">
      <h3 class="text-lg font-medium">Lobbies</h3>
      <UTooltip text="Refresh lobby list" :popper="{ placement: 'right', arrow: true }">
        <UButton @click="refreshLobbies" icon="i-lucide-refresh-cw" variant="link" square />
      </UTooltip>
      <UButton class="ml-auto" :to="{ name: 'guilds-id-lobbies-create', params: { id: guildId } }" size="sm">Create lobby</UButton>
    </div>
    <USeparator class="my-2" />
    <div v-if="status === 'success'" class="flex flex-col gap-2">
      <Lobby v-for="lobby in lobbies" v-bind="lobby" :key="lobby.id" />
      <div v-if="!lobbies?.length" class="text-center text-neutral-500">
        There are currently no lobbies in this guild!
      </div>
    </div>
    <div v-else-if="status === 'pending'" class="flex flex-col gap-2">
      <USkeleton v-for="i in 3" :key="i" class="h-[13.5rem] w-full" />
    </div>
  </div>
</template>

<style scoped>

</style>