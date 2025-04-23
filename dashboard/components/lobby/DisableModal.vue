<script setup lang="ts">
import { FetchError } from 'ofetch';

const props = defineProps<{
  lobbyId: string;
  guildId: string;
}>();
const lobbyStore = useLobbyStore();

const model = defineModel<boolean>();

const toast = useToast();

const handleLobbyDisable = async () => {
  try {
    const res = await $fetch(
      `/api/guilds/${props.guildId}/lobbies/${props.lobbyId}`,
      {
        method: 'DELETE',
      },
    );

    lobbyStore.disableLobby(props.lobbyId);

    toast.add({
      title: 'Lobby disabled',
      description: 'The lobby has been disabled successfully',
      color: 'success',
    })
  } catch (e) {
    if (e instanceof FetchError) {
      switch (e.status) {
        case 401:
        case 403:
          toast.add({
            title: 'Unauthorized',
            description: 'You do not have permission to disable this lobby',
            color: 'error',
          });
          await navigateTo(`/guilds`);
          break;
        case 404:
          toast.add({
            title: 'Not found',
            description: 'The lobby you are trying to disable does not exist',
            color: 'error',
          });
          break;
        default:
          toast.add({
            title: 'An error occurred',
            description: 'An error occurred while trying to disable the lobby',
            color: 'error',
          });
      }
    }
  }

  model.value = false;
};
</script>

<template>
  <UModal title="Disable lobby" v-model:open="model">
    <template #body>
      <p class="text-sm text-neutral-300">
        Are you sure you want to disable this lobby?
      </p>
    </template>

    <template #footer>
      <div class="ml-auto">
        <UButton color="warning" @click="() => { model = false; }">Cancel</UButton>
        <UButton class="ml-2" @click="handleLobbyDisable" color="error">Disable</UButton>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>