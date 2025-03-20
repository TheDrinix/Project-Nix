<script setup lang="ts">
import { FetchError } from 'ofetch';

const props = defineProps<{
  lobbyId: string;
  guildId: string;
}>();
const lobbyStore = useLobbyStore();

const model = defineModel<boolean>()

const toast = useToast();

const handleLobbyDisable = async () => {
  try {
    const res = await $fetch(`/api/guilds/${props.guildId}/lobbies/${props.lobbyId}`, {
      method: 'DELETE'
    });

    lobbyStore.disableLobby(props.lobbyId);
  } catch (e) {
    if (e instanceof FetchError) {
      switch (e.status) {
        case 401:
        case 403:
          toast.add({
            title: 'Unauthorized',
            description: 'You do not have permission to disable this lobby',
            color: 'red'
          });
          await navigateTo(`/guilds`);
          break;
        case 404:
          toast.add({
            title: 'Not found',
            description: 'The lobby you are trying to disable does not exist',
            color: 'red'
          });
          break;
        default:
          toast.add({
            title: 'An error occurred',
            description: 'An error occurred while trying to disable the lobby',
            color: 'red'
          });
      }
    }
  }

  model.value = false;
}
</script>

<template>
  <UModal v-model="model">
    <div class="p-4">
      <h3 class="text-lg font-medium">Disable lobby</h3>
      <p class="text-sm text-gray-300 mt-2">Are you sure you want to disable this lobby?</p>
      <div class="flex justify-end mt-4">
        <UButton color="yellow" @click="() => (model = false)">Cancel</UButton>
        <UButton class="ml-2" @click="handleLobbyDisable" color="red">Disable</UButton>
      </div>
    </div>
  </UModal>
</template>

<style scoped>

</style>