<script setup lang="ts">
import type { Guild } from '~/types/guild';

definePageMeta({
  middleware: [
    'auth'
  ]
})

const guildStore = useGuildStore();

await callOnce(guildStore.fetchGuilds);
 
const guilds = computed(() => guildStore.getGuilds);

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

const pending = computed(() => !guildStore.hasBeenLoaded);
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold">
          Select a Server
        </h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Choose a server you wish to configure. Only servers where you have administrative permissions and Nix is present are shown.
        </p>
      </div>

      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <USkeleton v-for="i in 8" :key="i" class="h-40 w-full" />
      </div>
      
      <div v-else-if="guilds && guilds.length === 0">
        <UCard>
          <div class="text-center">
            <div class="flex justify-center">
              <UIcon name="i-heroicons-shield-exclamation" class="h-12 w-12 text-gray-400" />
            </div>
            <h3 class="mt-4 text-lg font-semibold">No Manageable Servers Found</h3>
            <p class="mt-1 text-sm text-gray-500">
              We couldn't find any servers where you are an administrator and the Nix bot has been added. Please invite Nix to a server you manage to begin.
            </p>
          </div>
        </UCard>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <Guild v-for="guild in guilds" :guild />
      </div>
    </div>
  </UContainer>
</template>