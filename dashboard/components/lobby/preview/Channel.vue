<script setup lang="ts">
const props = defineProps<{
  channelId?: string;
  channelName?: string;
  members?: {
    discordId?: string
    username: string;
    avatar?: string;
  }[]
}>();

const channelsStore = useChannelStore();

const channelName = computed(() => {
  return props.channelName || channelsStore.getChannelName(props.channelId || '');
})
</script>

<template>
  <div class="text-neutral-800 dark:text-neutral-300">
    <div class="flex items-center px-2 py-1 rounded hover:bg-neutral-300/80 dark:hover:bg-neutral-700/20 transition-colors">
      <UIcon class="text-lg" name="i-lucide-volume-2" />
      <span class="pl-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{{channelName}}</span>
    </div>
    <div class="pl-6">
      <LobbyPreviewMember v-for="(member, idx) in members ?? []" :key="idx" v-bind="member" />
    </div>
  </div>
</template>

<style scoped>

</style>