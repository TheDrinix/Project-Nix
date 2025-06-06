<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { getUserAvatarUrl } from '~/utils/discord.js'

const props = defineProps<{
  avatar?: string;
  username: string;
  discordId: string;
  isPhoneSize: boolean;
  links: DropdownMenuItem[]
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const avatarUrl = computed(() => {
  return getUserAvatarUrl(props.discordId, props.avatar)
});

const items = computed(() => {
  return props.isPhoneSize ? [
    props.links,
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        onClick: () => {
          emit('logout');
        }
      }
    ]
  ] : [
    [{
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onClick: () => {
        emit('logout');
      }
    }]
  ]
})
</script>

<template>
  <UDropdownMenu :items>
    <UButton variant="ghost" color="neutral" class="cursor-pointer">
      <span class="mr-2 font-medium">{{username}}</span>
      <UAvatar :src="avatarUrl" />
    </UButton>
  </UDropdownMenu>
</template>

<style scoped>

</style>