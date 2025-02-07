<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();

const links = [
  {
    label: 'Guilds',
    to: '/guilds'
  }
]

const isPhoneSize = useMediaQuery('(max-width: 768px)', { ssrWidth: 1024 });

const handleLogout = async () => {
  console.log('Logging out');

  await $fetch('/auth/logout', { method: 'POST' });
  clear();

  await navigateTo('/')
}
</script>

<template>
  <header>
    <div class="navbar bg-opacity-30 bg-gray-800 border-b-2 border-gray-800">
      <div class="container mx-auto">
        <div class="flex flex-1 items-center">
          <NuxtLink to="/" class="text-white font-bold text-xl"><span class="text-primary">Nix</span> dashboard</NuxtLink>
          <div v-if="loggedIn && !isPhoneSize" class="flex ml-4">
            <UHorizontalNavigation :links />
          </div>
          <div class="ml-auto">
            <div v-if="!loggedIn || !user">
              <UButton to="/auth/discord" external color="primary" variant="outline">Login with Discord</UButton>
            </div>
            <div v-else>
              <NavDropdown @logout="handleLogout" :username="user.username" :avatar="user.avatar" :discord-id="user.discordId" :isPhoneSize :links />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>