<script setup lang="ts">
import type { Lobby } from '~/types/lobby';
import { z } from 'zod';
import type { FormError, FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';

const channelStore = useChannelStore();
const toast = useToast();

const props = defineProps<{
  lobby: Lobby;
}>();

const lobbyChannels = computed(() => {
  return channelStore.getLobbyChannels(props.lobby.id);
});

const formSchema = z
  .object({
    namingScheme: z.string()
      .min(3, 'Naming scheme must be at least 3 characters long')
      .max(50, 'Naming scheme must be at most 50 characters long'),
    allowPersonalizedNaming: z.boolean(),
    entryPointId: z.string().nonempty('Entrypoint channel is required'),
    waitingRoomId: z.string().nullable().optional(),
  }).refine(data => data.entryPointId !== data.waitingRoomId, {
    message: 'Entrypoint channel and waiting room channel cannot be the same',
    path: ['waitingRoomId', 'entryPointId'],
  });

type FormSchema = z.output<typeof formSchema>;

const formState = ref(
   {
    namingScheme: props.lobby.namingScheme,
    allowPersonalizedNaming:  props.lobby.allowPersonalizedNaming,
    entryPointId:  props.lobby.entryPointId,
    waitingRoomId:  props.lobby.waitingRoomId ?? '',
  }
);

const entryPointChannels = computed(() => {
  return lobbyChannels.value.map(channel => {
    return {
      value: channel.id,
      label: channel.name,
    };
  });
});

const waitingRoomChannels = computed(() => {
  const channelOptions = lobbyChannels.value.map(channel => {
    return {
      value: channel.id,
      label: channel.name,
    };
  });

  return [
    {
      label: 'None',
      value: ''
    },
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

const handleSubmit = async (event: FormSubmitEvent<FormSchema>) => {
  try {
    const body = {
      ...event.data,
      waitingRoomId: event.data.waitingRoomId || null,
    }

    const res = await $fetch(`/api/guilds/${props.lobby.guildId}/lobbies/${props.lobby.id}`, {
      method: 'PUT',
      body
    });
  } catch (e) {
    if (e instanceof FetchError) {
      switch (e.status) {
        case 400:
          toast.add({
            title: 'Validation error',
            description: 'Please check the form for errors',
            color: 'error'
          });
          return;
        case 401:
        case 403:
          toast.add({
            title: 'Unauthorized',
            description: 'You are not authorized to perform this action',
            color: 'error'
          });
          await navigateTo({ name: 'guilds' })
          break;
        case 404:
          toast.add({
            title: 'Not found',
            description: 'The lobby you are trying to edit does not exist',
            color: 'error'
          });
          break;
        default:
          toast.add({
            title: 'An error occurred',
            description: 'An error occurred while trying to edit the lobby',
            color: 'error'
          });
      }
    }
  }

  await navigateTo(`/guilds/${props.lobby.guildId}/lobbies`);
}
</script>

<template>
  <UForm :validate="validate" :schema="formSchema" :state="formState" @submit.prevent="handleSubmit" class="space-y-2">
    <UFormField label="Entrypoint channel" name="entryPointId">
      <USelect class="w-full" v-model="formState.entryPointId" :items="entryPointChannels" option-attribute="name" />
    </UFormField>

    <UFormField label="Waiting room channel" name="waitingRoomId">
      <USelect class="w-full" v-model="formState.waitingRoomId" :items="waitingRoomChannels" option-attribute="name" />
    </UFormField>

    <UFormField label="Naming scheme" name="namingScheme">
      <UInput class="w-full" v-model="formState.namingScheme" />
    </UFormField>

    <UCheckbox v-model="formState.allowPersonalizedNaming" name="allowPersonalizedNaming" label="Allow personalized naming" />

    <UButtonGroup>
      <UButton type="submit">Save</UButton>
      <UButton :to="`/guilds/${props.lobby.guildId}/lobbies`" color="error">Cancel</UButton>
    </UButtonGroup>
  </UForm>
</template>

<style scoped>

</style>