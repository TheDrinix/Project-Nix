<script setup lang="ts">
const props = defineProps<{
  channelId: string;
  type: 'text' | 'voice';
}>();

const channelsStore = useChannelStore();

const channelName = computed(() => {
  return channelsStore.getChannelName(props.channelId);
});

const icon = computed(() => {
  return props.type === 'voice' ? 'i-heroicons-speaker-wave' : 'i-heroicons-hashtag';
});
</script>

<template>
  <div class="flex items-center p-1 text-blue-200 bg-blue-600 bg-opacity-30 hover:bg-opacity-50 rounded-sm">
    <UIcon class="text-lg" :name="icon" />
    <span class="pl-1" style="line-height: 1rem">{{channelName}}</span>
  </div>
</template>

<style scoped>

</style>