<script setup lang="ts">
import type { Guild } from '~/types/guild';

const props = defineProps<{
  guild: Guild;
}>();

const iconUrl = computed(() => {
  return props.guild.icon ? `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png` : '';
});
</script>

<template>
  <NuxtLink :to="{ name: 'guilds-id-lobbies', params: { id: guild.id } }">
    <div class="p-4 rounded-md flex flex-col items-center hover:bg-neutral-800/40 transition-all">
      <UAvatar :alt="guild.name" :src="iconUrl" size="3xl" class="mb-2" />
      <span>{{guild.name}}</span>
    </div>
  </NuxtLink>
</template>

<style scoped>

</style>