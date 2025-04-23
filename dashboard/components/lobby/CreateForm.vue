<script setup lang="ts">
import { z } from 'zod';
import type { FormError, FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import type { Lobby } from '~/types/lobby';

const channelStore = useChannelStore();
const lobbyStore = useLobbyStore();
const toast = useToast();

const props = defineProps<{
  guildId: string;
}>();

const formSchema = z
  .object({
    lobbyId: z.string().nonempty('Lobby channel group is required'),
    entrypointId: z.string().nonempty('Entrypoint channel is required'),
    waitingRoomId: z.string().nullable(),
    namingScheme: z.string()
      .min(3, 'Naming scheme must be at least 3 characters')
      .max(50, 'Naming scheme must be at most 50 characters'),
    allowPersonalizedNaming: z.boolean()
  }).refine(data => data.entrypointId !== data.waitingRoomId, {
    message: 'Entrypoint channel and waiting room channel cannot be the same',
    path: ['waitingRoomId', 'entryPointId'],
  });

type FormSchema = z.output<typeof formSchema>;

const formState = ref({
  lobbyId: '',
  namingScheme: '',
  entrypointId: '',
  waitingRoomId: '',
  allowPersonalizedNaming: false,
});

const usableChannelGroups = computed(() => {
  const categoryChannels = channelStore.getGuildChannelCategories(props.guildId);
  const existingLobbies = lobbyStore.getGuildLobbies(props.guildId).map(l => l.id);

  return categoryChannels
    .filter(cc => {
      return channelStore.getLobbyChannels(cc.id).length > 0
        && existingLobbies.indexOf(cc.id) === -1;
    })
    .map(cc => ({
      name: cc.name,
      value: cc.id,
    }));
});

const lobbyChannels = computed(() => {
  return channelStore.getLobbyChannels(formState.value.lobbyId);
});

const entrypointOptions = computed(() => {
  return lobbyChannels.value
    .filter(c => c.id !== formState.value.waitingRoomId)
    .map(c => ({
      value: c.id,
      name: c.name
    }));
});

const waitingRoomOptions = computed(() => {
  const channelOptions = lobbyChannels.value
    .filter(c => c.id !== formState.value.entrypointId)
    .map(c => ({
      value: c.id,
      name: c.name
    }));

  return [
    { name: 'None' },
    ...channelOptions
  ]
});

const validate = (state: any): FormError[] => {
  const errors = [];

  if (state.entryPointId === state.waitingRoomId) {
    errors.push({
      path: 'waitingRoomId',
      message: 'Entrypoint channel and waiting room channel cannot be the same',
    });
  }

  return errors;
}

const handleLobbySelect = () => {
  formState.value.entrypointId = '';
  formState.value.waitingRoomId = '';
}

const handleSubmit = async (event: FormSubmitEvent<FormSchema>) => {
  try {
   const body = {
      ...event.data,
     waitingRoomId: event.data.waitingRoomId || null,
     protectedChannelIds: lobbyChannels.value.map(c => c.id)
   }

   const res = await $fetch<Lobby>(`/api/guilds/${props.guildId}/lobbies`, {
     method: 'POST',
     body,
   });

   console.log(res);

   lobbyStore.storeLobby(res);
   await navigateTo(`/guilds/${props.guildId}/lobbies`);
  } catch (e) {
    if (e instanceof FetchError) {
      switch (e.status) {
        case 400:
          toast.add({
            title: 'Invalid form data',
            description: 'Please check your inputs and try again.',
            color: 'red'
          })
          break;
        case 401:
        case 403:
          toast.add({
            title: 'Unauthorized',
            description: 'You do not have permission to create a lobby.',
            color: 'red'
          })
          await navigateTo({ name: 'guilds' })
          break;
        case 404:
          toast.add({
            title: 'Guild not found',
            description: 'The guild you are trying to create a lobby in is unknown to Nix',
            color: 'red'
          })
          break;
        default:
          toast.add({
            title: 'An error occurred',
            description: 'An error occurred while trying to create a lobby, please try again later.',
            color: 'red'
          })
          break;
      }
    }

    return;
  }
}
</script>

<template>
  <UForm
    :validate="validate"
    :schema="formSchema"
    :state="formState"
    @submit.prevent="handleSubmit"
    class="space-y-2"
  >
    <UFormGroup label="Lobby channel group" name="lobbyId">
      <USelect
        v-model="formState.lobbyId"
        :options="usableChannelGroups"
        option-attribute="name"
        placeholder="Select lobby channel group"
        @change="handleLobbySelect"
      />
    </UFormGroup>

    <UFormGroup label="Entrypoint channel" name="entryPointId">
      <USelect
        v-model="formState.entrypointId"
        :options="entrypointOptions"
        option-attribute="name"
        placeholder="Select entrypoint channel"
        :disabled="!formState.lobbyId"
      />
    </UFormGroup>

    <UFormGroup label="Waiting room channel" name="waitingRoomId">
      <USelect
        v-model="formState.waitingRoomId"
        :options="waitingRoomOptions"
        option-attribute="name"
        placeholder="Select waiting room channel for private lobby"
        :disabled="!formState.entrypointId"
      />
    </UFormGroup>

    <UFormGroup label="Naming scheme" name="namingScheme" description="...">
      <UInput v-model="formState.namingScheme" />
    </UFormGroup>

    <UCheckbox
      v-model="formState.allowPersonalizedNaming"
      name="allowPersonalizedNaming"
      label="Allow personalized naming schemes for lobby"
    />

    <UButtonGroup>
      <UButton type="submit">Create</UButton>
      <UButton
        :to="{ name: 'guilds-id-lobbies', params: { id: guildId } }"
        color="red"
        >Cancel</UButton
      >
    </UButtonGroup>
  </UForm>
</template>

<style scoped></style>