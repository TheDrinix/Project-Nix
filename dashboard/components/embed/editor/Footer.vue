<script setup lang="ts">
  const model = defineModel<Embed['footer']>({
    default: {
      text: '',
      iconUrl: '',
    },
  });
</script>

<template>
  <UCollapsible>
    <UButton
      label="Footer"
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
      <div class="flex flex-col gap-2">
        <UFormField class="w-full" label="Footer text" name="footer.text">
          <UInput
            class="w-full"
            v-model="model.text"
            placeholder="Footer text"
          />
        </UFormField>
        <UFormField class="w-full" label="Footer icon" name="footer.iconUrl">
          <UInput
            class="w-full"
            v-model="model.iconUrl"
            placeholder="Footer icon URL"
          />
        </UFormField>
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>