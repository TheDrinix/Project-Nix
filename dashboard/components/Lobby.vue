<script setup lang="ts">
interface Lobby {
  guildId: string;
  id: string;
  entryPointId: string;
  isPrivate: boolean;
  waitingRoomId: string | null;
  namingScheme: string;
  allowPersonalizedNaming: boolean;
  protectedChannelIds: string[]
}
const props = defineProps<Lobby>();

const isDisableModalOpen = ref(false);

const previewData = computed(() => {
  return {
    entryPointId: props.entryPointId,
    waitroomId: props.waitingRoomId,
    lobbyId: props.id,
    namingScheme: props.namingScheme,
    guildId: props.guildId
  }
})
</script>

<template>
<UCard :ui="{ body: 'p-2 sm:p-3' }">
  <div class="grid grid-cols-[240px_auto] gap-4 grid-rows-[auto_auto] ">
    <div class="row-span-full">
      <LobbyPreview v-bind="previewData" />
    </div>
    <div class="flex flex-col">
      <p><span class="font-medium">Naming scheme:</span> {{namingScheme}}</p>
      <p><span class="font-medium">Type:</span> {{isPrivate ? 'Private' : 'Public'}}</p>
      <p><span class="font-medium">Allows personalized naming:</span> {{allowPersonalizedNaming ? 'Yes' : 'No'}}</p>
      <div class="flex items-center mb-1">
        <span class="font-medium mr-1">Entrypoint channel:</span>
        <ChannelTag :channel-id="entryPointId" :type="'voice'" />
      </div>
      <div v-if="waitingRoomId" class="flex items-center">
        <span class="font-medium mr-1">Entrypoint channel:</span>
        <ChannelTag :channel-id="waitingRoomId" :type="'voice'" />
      </div>
    </div>
    <div class="w-full mt-auto flex justify-end">
      <UButtonGroup>
        <UButton :to="{ name: 'guilds-id-lobbies-lobbyId-edit', params: { id: guildId, lobbyId: id } }" size="sm" color="warning">Edit</UButton>
        <UButton size="sm" color="error" @click="isDisableModalOpen = true">Disable</UButton>
      </UButtonGroup>
    </div>
    <LobbyDisableModal v-model="isDisableModalOpen" :lobby-id="id" :guild-id="guildId" />
  </div>
</UCard>
</template>

<style scoped>

</style>