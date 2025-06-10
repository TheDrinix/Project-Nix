<script setup lang="ts">
const route = useRoute();
const guildStore = useGuildStore();
const channelStore = useChannelStore();

definePageMeta({
  middleware: [
    'auth'
  ],
  redirect: (to) => {
    const guildId = to.params.id as string;
    // if (!guildStore.getGuild(guildId)) {
    //   return '/guilds'; // Redirect to guilds if the guild is invalid
    // }
    return {
      name: 'guilds-id-lobbies',
      params: { id: guildId }
    }
  }
})

if (!guildStore.hasBeenLoaded) {
  await callOnce(guildStore.fetchGuilds);
}

const guildId = computed(() => route.params.id as string);

const guild = computed(() => {
  return guildStore.getGuild(guildId.value);
});

if (!guild.value) {
  await navigateTo('/guilds'); // Redirect if guild is invalid
} else {
  console.log("Fetching channels for guild:", guildId.value);
  await callOnce(`channels-${guildId.value}`, () => channelStore.fetchChannels(guildId.value));
}

watch(guild, async (newGuild) => {
  console.log("Guild changed:", newGuild);

  if (!newGuild) {
    await navigateTo('/guilds'); // Redirect if guild is invalid
  } else {
    // Only fetch channels if the guild is valid
    await callOnce(`channels-${guildId.value}`, () => channelStore.fetchChannels(guildId.value));
  }
})

const iconUrl = computed(() => {
  return guild.value?.icon ? `https://cdn.discordapp.com/icons/${guild.value?.id}/${guild.value?.icon}.png` : '';
});

const links = [
  {
    label: 'Lobbies',
    to: { name: 'guilds-id-lobbies', params: { id: guildId.value } },
  },
  {
    label: 'Announcements',
    to: { name: 'guilds-id-announcements', params: { id: guildId.value } }
  }
]

const isMobileSize = useMediaQuery('(max-width: 768px)', { ssrWidth: 1024 });
</script>

<template>
  <div class="mt-4" v-if="guild">
    <UCard>
      <template #header>
        <div class="flex items-center">
          <UAvatar :alt="guild.name" :src="iconUrl" class="" />
          <h1 class="text-2xl font-bold ml-4">{{ guild.name }}</h1>
          <UDropdownMenu v-if="isMobileSize" :items="[links]" class="ml-auto" :popper="{ arrow: true }">
            <UButton variant="ghost" color="primary" icon="i-lucide-menu" />
          </UDropdownMenu>
        </div>
      </template>

      <div class="flex w-full">
        <template v-if="!isMobileSize">
          <UNavigationMenu orientation="vertical" class="min-w-48" :items="links" />
          <USeparator class="mx-2" orientation="vertical" />
        </template>
        <div class="min-h-24 w-full">
          <NuxtPage />
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>