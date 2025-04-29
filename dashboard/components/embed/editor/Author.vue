<script setup lang="ts">
import type { Embed } from '~/utils/embed';

const model = defineModel<Embed['author']>({
  required: true
});
</script>

<template>
  <UCollapsible>
    <UButton
      label="Author"
      size="lg"
      variant="subtle"
      color="neutral"
      trailing-icon="i-lucide-chevron-left"
      class="group"
      :ui="{
            trailingIcon: 'group-data-[state=open]:-rotate-90 transition-transform duration-200'
          }"
      block
    />

    <template #content>
      <USeparator class="my-2" />
      <div class="flex gap-2 flex-col xl:flex-row">
        <UFormField class="w-full" label="Author" name="author.name">
          <UInput
            class="w-full"
            v-model="model.name"
            placeholder="Author name"
          />
        </UFormField>
        <UFormField class="w-full" label="Author icon url" name="author.url">
          <UInput
            class="w-full"
            v-model="model.iconUrl"
            placeholder="Author icon url"
          />
        </UFormField>
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>