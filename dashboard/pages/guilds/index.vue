<script setup lang="ts">
const guildStore = useGuildStore();

const {error} = useAsyncData(async () => {
  return guildStore.fetchGuilds();
});

const guilds = computed(() => guildStore.getGuilds);
</script>

<template>
  <div>
    <h2>Guilds</h2>
    <div>
      <div v-if="guilds && !error" class="flex gap-2 flex-wrap">
        <Guild v-for="guild in guilds" :key="guild.id" :guild="guild" />
      </div>
    </div>
  </div>
</template>