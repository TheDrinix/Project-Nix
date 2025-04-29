<script setup lang="ts">
const title = defineModel<string>('title', {
  default: ''
});

const description = defineModel<string>('description', {
  default: ''
});

const titleUrl = defineModel<string>('titleUrl');

const color = defineModel<string>('color', {
  required: true
});
</script>

<template>
  <UCollapsible>
    <UButton
      label="Body"
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
      <div class="grid grid-cols-12 grid-rows-[auto] gap-2">
        <UFormField class="col-span-12 md:col-span-8" label="Title" name="title">
          <UInput
            class="w-full"
            v-model="title"
            placeholder="Title"
          />
        </UFormField>
        <UFormField class="col-span-12 lg:col-span-8" label="Title url" name="titleUrl">
          <UInput
            class="w-full"
            v-model="titleUrl"
            placeholder="Title url"
          />
        </UFormField>
        <UFormField class="col-span-12 lg:col-span-8" label="Description" name="description">
          <UTextarea
            class="w-full"
            color="primary"
            :maxrows="20"
            :autoresize="true"
            placeholder="Description"
            v-model="description"
          />
        </UFormField>
        <div class="flex flex-col items-center col-span-12 md:row-start-1 md:col-start-9 md:col-span-4 md:row-span-3">
          <span class="text-sm font-medium mb-2">Embed color</span>
          <UColorPicker v-model="color" />
        </div>
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>