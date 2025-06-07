<script setup lang="ts">
import type { Guild } from '~/types/guild';

const props = defineProps<{
  guild: Guild;
}>();

function getGuildAcronym(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 3) // Max 3 chars
    .toUpperCase();
}

function getGuildIconUrl(guild: Guild): string | undefined {
  if (!guild.icon) return undefined;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
}
</script>

<template>
  <NuxtLink :to="{ name: 'guilds-id-lobbies', params: { id: guild.id } }" :key="guild.id">
    <UCard
      class="text-center h-full transition-all"
      :ui="{ body: 'p-4 sm:p-6' }"
    >
      <div class="hover:scale-105 transform transition-transform duration-200">
        <UAvatar
          :src="getGuildIconUrl(guild)"
          :alt="guild.name"
          size="2xl"
        >
          <span v-if="!guild.icon">{{ getGuildAcronym(guild.name) }}</span>
        </UAvatar>
        
        <p class="mt-3 font-semibold text-sm truncate">
          {{ guild.name }}
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>

<style scoped>

</style>