<script setup lang="ts">
import type { EmbedField } from '~/utils/embed';

const { idx, totalFields } = defineProps<{ idx: number, totalFields: number }>();

const model = defineModel<EmbedField>({
  required: true,
});

const emit = defineEmits<{
  (e: 'remove', idx: number): void;
  (e: 'move', idx: number, direction: 'up' | 'down'): void;
}>();
</script>

<template>
  <div class="flex flex-col border-muted border rounded-lg p-2 bg-default">
    <div class="w-full flex">
      <h3 class="font-medium">Field {{idx + 1}}</h3>
      <div class="ml-auto flex gap-2">
        <UButton
          variant="ghost"
          icon="i-lucide-chevron-up"
          v-if="idx > 0"
          @click="emit('move', idx, 'up')"
        />
        <UButton
          variant="ghost"
          icon="i-lucide-chevron-down"
          v-if="idx < totalFields - 1 && totalFields > 1"
          @click="emit('move', idx, 'down')"
        />
        <UButton
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="emit('remove', idx)"
        />
      </div>
    </div>
    <USeparator class="my-1"></USeparator>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <UFormField class="w-full" label="Title" :name="`fields.${idx}.name`">
          <UInput
            class="w-full"
            v-model="model.name"
            placeholder="Field title"
          />
        </UFormField>
        <UFormField label="Inline" :name="`fields.${idx}.inline`" class="flex flex-col items-center">
          <UCheckbox
            class="mx-auto"
            v-model="model.inline"
          />
        </UFormField>
      </div>
      <UFormField label="Text" :name="`fields.${idx}.value`">
        <UTextarea
          class="w-full"
          color="primary"
          :maxrows="20"
          :autoresize="true"
          placeholder="Field text"
          v-model="model.value"
        />
      </UFormField>
    </div>
  </div>
</template>

<style scoped></style>