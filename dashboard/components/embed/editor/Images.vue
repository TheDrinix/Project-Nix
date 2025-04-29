<script setup lang="ts">
const imageUrl = defineModel<string>('imageUrl', {
  default: ''
});

const thumbnailUrl = defineModel<string>('thumbnailUrl', {
  default: ''
})
</script>

<template>
  <UCollapsible>
    <UButton
      label="Images"
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
      <div class="flex flex-col md:flex-row gap-2">
        <UFormField class="w-full" label="Image" name="image.url">
          <UInput
            class="w-full"
            v-model="imageUrl"
            placeholder="Image URL"
          />
        </UFormField>
        <UFormField class="w-full" label="Thumbnail" name="thumbnail.url">
          <UInput
            class="w-full"
            v-model="thumbnailUrl"
            placeholder="Thumbnail URL"
          />
        </UFormField>
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>