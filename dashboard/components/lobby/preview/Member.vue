<script setup lang="ts">
const props = defineProps<{
  discordId?: string;
  username: string;
  avatar?: string;
}>();

const avatarUrl = computed(() => {
  return props.discordId && props.avatar ? `https://cdn.discordapp.com/avatars/${props.discordId}/${props.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
});
</script>

<template>
  <div class="flex items-center py-1 px-2">
    <UAvatar size="xs" :src="avatarUrl" />
    <span class="text-sm pl-2">{{username}}</span>
  </div>
</template>

<style scoped>

</style>