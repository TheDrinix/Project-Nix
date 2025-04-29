<script setup lang="ts">
const props = defineProps<{
  entryPointId: string;
  waitroomId: string | null;
  lobbyId: string;
  guildId: string;
  namingScheme: string;
}>();

const channelsStore = useChannelStore();
const { user } = useUserSession();

const lobbyName = computed(() => {
  return channelsStore.getChannelName(props.lobbyId);
});

const usersChannelName = computed(() => {
  const name = props.namingScheme;
  return name
    .replace('{user}', user.value?.username ?? 'User')
    .replace('{p_user}', (user.value?.username ?? 'User') + "'s")
    .replace('{c}', '1');
});
</script>

<template>
  <div class="w-[240px] flex flex-col py-2 px-1 bg-neutral-900/35 rounded-lg">
    <div class="py-2 flex items-center text-xs font-medium text-neutral-300">
      <UIcon name="i-lucide-chevron-down" />
      <h4 class="uppercase pl-1">{{lobbyName || 'Rooms'}}</h4>
    </div>
    <div class="flex flex-col px-2 gap-1">
      <LobbyPreviewChannel :channel-id="entryPointId" />
      <LobbyPreviewChannel v-if="waitroomId" :channel-id="waitroomId" />
      <LobbyPreviewChannel :channel-name="usersChannelName" :members="[user ?? { username: 'User' }, { username: 'John Doe' }]" />
    </div>
  </div>
</template>

<style scoped>

</style>