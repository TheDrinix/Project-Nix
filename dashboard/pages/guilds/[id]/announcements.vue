<script setup lang="ts">
import type { AnnouncementsConfig } from '~/types/announcements'
import type { Embed } from '~/types/embed';

const route = useRoute();
const channelStore = useChannelStore();

const guildId = computed(() => {
  return route.params.id as string;
})

const createDefaultConfig = (): AnnouncementsConfig => ({
    channelId: undefined,
    guildId: guildId.value,
    announceJoin: false,
    joinMessageEmbed: {
      author: {},
      color: 0xc271ff,
      footer: {},
      fields: [],
      image: {},
      thumbnail: {},
      title: 'User Joined',
      description: 'Welcome {user} to the server!',
    },
    announceLeave: false,
    leaveMessageEmbed: {
      author: {},
      color: 0xc271ff,
      footer: {},
      fields: [],
      image: {},
      thumbnail: {},
      title: 'User Left',
      description: 'Goodbye {user} from the server!',
    },
    announceBan: false,
    banMessageEmbed: {
      author: {},
      color: 0xc271ff,
      footer: {},
      fields: [],
      image: {},
      thumbnail: {},
      title: 'User Banned',
      description: 'User {user} was banned from the server!',
    }
  })

const { data, status, error } = await useFetch<AnnouncementsConfig>(() => `/api/guilds/${guildId.value}/announcements`, {
  method: 'GET',
  default: createDefaultConfig,
  transform: (body: AnnouncementsConfig | null) => {
    return body ?? createDefaultConfig()
  }
});

const channelOptions = computed(() => {
  const channels = channelStore
    .getGuildTextChannels(guildId.value)
    .map(channel => ({
      value: channel.id,
      label: channel.name
    }))

  return [
    { label: 'No Channel' },
    ...channels
  ]
})

const handleMessageUpdate = (type: 'join' | 'leave' | 'ban', message: Embed) => {
  if (type === 'join') {
    data.value.joinMessageEmbed = message;
  } else if (type === 'leave') {
    data.value.leaveMessageEmbed = message;
  } else if (type === 'ban') {
    data.value.banMessageEmbed = message;
  }
}

const handleAnnouncementsToggle = async (type: 'join' | 'leave' | 'ban') => {
  let value = false;
  if (type === 'join') {
    value = data.value.announceJoin;
  } else if (type === 'leave') {
    value = data.value.announceLeave;
  } else if (type === 'ban') {
    value = data.value.announceBan;
  }

  await $fetch(`/api/guilds/${guildId.value}/announcements/toggle`, {
    method: 'POST',
    body: {
      enabled: value,
      type: 'join'
    }
  });
}

const handleChannelUpdate = async () => {
  await $fetch(`/api/guilds/${guildId.value}/announcements/channel`, {
    method: 'POST',
    body: {
      channelId: data.value.channelId
    }
  });
}
</script>

<template>
  <div class="w-full">
    <h3 class="text-lg font-medium">Announcements configuration</h3>
    <USeparator class="my-2" />
    <div class="flex flex-col gap-2">
      <div>
        <UFormField label="Announcements channel" name="announcementsChannelId">
          <USelect
            class="w-full"
            :items="channelOptions"
            v-model="data.channelId"
            placeholder="Select a channel for announcements"
            @change="handleChannelUpdate"
          />
        </UFormField>
      </div>
      <div>
        <div class="flex justify-around my-4">
          <UCheckbox
            v-model="data.announceJoin"
            label="Announce user join"
            name="announceJoin"
            @change="() => handleAnnouncementsToggle('join')"
          />
          <UCheckbox
            v-model="data.announceLeave"
            label="Announce user leave"
            name="announceLeave"
            @change="() => handleAnnouncementsToggle('leave')"
          />
          <UCheckbox
            v-model="data.announceBan"
            label="Announce user ban"
            name="announceBan"
            @change="() => handleAnnouncementsToggle('ban')"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 grid-rows-auto gap-2">
        <div>
          <AnnouncementsEntry :guild-id="guildId" type="join" :message="data.joinMessageEmbed" @save="handleMessageUpdate" />
        </div>
        <div>
          <AnnouncementsEntry :guild-id="guildId" type="leave" :message="data.leaveMessageEmbed" @save="handleMessageUpdate" /> 
        </div>
        <div>
          <AnnouncementsEntry :guild-id="guildId" type="ban" :message="data.banMessageEmbed" @save="handleMessageUpdate" /> 
        </div>
        <div>
          <AnnouncementsVariables />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>