<script setup lang="ts">
const guildStore = useGuildStore();

await callOnce(guildStore.fetchGuilds);

const guilds = computed(() => guildStore.getGuilds);
</script>

<template>
  <div>
    <h2>Guilds</h2>
    <div>
      <div v-if="guilds" class="flex gap-2 flex-wrap">
        <Guild v-for="guild in guilds" :key="guild.id" :guild="guild" />
      </div>
    </div>
  </div>
</template>