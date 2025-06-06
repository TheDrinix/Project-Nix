<script lang="ts" setup>
import type { AnnouncementsConfig } from '~/types/announcements';
import type { Embed } from '~/types/embed';

const props = defineProps<{
  guildId: string,
  type: 'join' | 'leave' | 'ban',
  message: Embed
}>()

const emit = defineEmits<{
  (e: 'save', type: 'join' | 'leave' | 'ban', message: Embed): void
}>()

const title = `${props.type} message`

const editModalOpen = ref(false)

const handleEmbedSave = async (embed: Embed) => {
  const updatedConfig = await $fetch<AnnouncementsConfig>(`/api/guilds/${props.guildId}/announcements/embed`, {
    method: 'POST',
    body: {
      type: props.type,
      message: embed
    }
  });

  if (updatedConfig) {
    emit('save', props.type, updatedConfig[`${props.type}MessageEmbed`])
    editModalOpen.value = false;
  };
}
</script>

<template>
  <UCard>
    <template #header>
      <h4 class="font-medium capitalize">{{ title }}</h4>
    </template>

    <EmbedPreview :embed="message" :guild-id="guildId" />

    <template #footer>
      <UModal v-model:open="editModalOpen" fullscreen :title="`Editing ${title} embed`">
        <UButton>Edit Message</UButton>

        <template #body>
          <UContainer>
            <EmbedEditor
             :embed="props.message"
             @save="handleEmbedSave"
            />
            <AnnouncementsVariables />
          </UContainer>
        </template>
      </UModal>
    </template>
  </UCard>
</template>

<style>

</style>