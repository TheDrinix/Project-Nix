<script setup lang="ts">
import type { HorizontalNavigationLink } from '#ui/types';

const props = defineProps<{
  avatar?: string;
  username: string;
  discordId: string;
  isPhoneSize: boolean;
  links: HorizontalNavigationLink[]
}>();

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const avatarUrl = computed(() => {
  return props.avatar ? `https://cdn.discordapp.com/avatars/${props.discordId}/${props.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(props.discordId) % 5}.png`;
});

const items = computed(() => {
  return props.isPhoneSize ? [
    props.links,
    [
      {
        label: 'Logout',
        icon: 'i-heroicons-arrow-left-start-on-rectangle',
        onClick: () => {
          emit('logout');
        }
      }
    ]
  ] : [
    [{
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      onClick: () => {
        emit('logout');
      }
    }]
  ]
})
</script>

<template>
  <UDropdownMenu :items>
    <div class="flex items-center">
      <span class="mr-4 font-medium">{{username}}</span>
      <UAvatar :src="avatarUrl" />
    </div>
  </UDropdownMenu>
</template>

<style scoped>

</style>