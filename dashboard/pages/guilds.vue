<script setup lang="ts">
const res = await useFetch('/api/guilds');
</script>

<template>
  <div>
    <h1>Guilds</h1>
    <div>
      <div v-if="res.data">
        <div v-for="guild in res.data.value" :key="guild.id">
          <h3>{{guild.name}}</h3>
          <p>{{guild.id}}</p>
        </div>
      </div>
    </div>
  </div>
</template>