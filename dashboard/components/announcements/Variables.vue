<script lang="ts" setup>
const variables = [
  { name: 'user', description: 'Mentions the user who triggered the announcement' },
  { name: 'username', description: 'Username of the user who triggered the announcement' },
  { name: 'guild', description: 'Name of the guild' },
  { name: '@userId', description: 'Mentions the user with the specified user id (eg: {@416628954812776459})' },
  { name: '#channelId', description: 'Mentions the specified channel (eg: {#1055430553760960532})' },
  { name: '&roleId', description: 'Mentions the specified role (eg: {&719838999895867432})' },
  { name: 'everyone', description: 'Mentions everyone (@everyone)' },
  { name: 'here', description: 'Mentions everyone with access to the announcemenets channel (@here)' },
  { name: 'guild_icon', description: 'Guild icon url' },
  { name: 'user_avatar', description: 'Avatar if the user who triggered the announcement' }
]
</script>

<template>
  <UCard>
    <div class="grid gap-2">
    <template class="grid grid-rows-auto" v-for="variable in variables">
      <span class="font-semibold col-start-1">{{ '{' + variable.name + '}' }}</span>
      <span class="text-neutral-700 dark:text-neutral-300 col-start-2"> - </span>
      <span class="text-neutral-700 dark:text-neutral-300 col-start-3 w-full">{{ variable.description }}</span>
    </template>
  </div>
  </UCard>
</template>

<style scoped>
.grid {
  grid-template-columns: auto auto 1fr;
}
</style>