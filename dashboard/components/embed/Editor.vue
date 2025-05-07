<script setup lang="ts">
import { embedSchema } from '~/utils/embed';
import { z } from 'zod';
import type { Embed } from '~/types/embed'
import { v4 as uuid } from 'uuid';
import type { FormSubmitEvent } from '#ui/types';

const props = withDefaults(defineProps<{ embed?: Partial<Embed> }>(), {
  embed: () => ({})
})

const emit = defineEmits<{
  (e: 'save', embed: Embed): void
}>()

type EmbedSchema = z.output<typeof embedSchema>;

const fields: EmbedField[] = (props.embed.fields || []).map(f => {
  return {
    id: uuid(),
    name: f.name || '',
    value: f.value || '',
    inline: f.inline || false,
  }
});


const formState = ref<EmbedSchema>({
  author: {
    name: '',
    icon_url: '',
  },
  color: 0xC27AFF,
  description: '',
  footer: {
    text: '',
    icon_url: '',
  },
  image: {
    url: '',
  },
  thumbnail: {
    url: '',
  },
  title: '',
  url: '',
  ...(JSON.parse(JSON.stringify(props.embed)) as Embed),
  fields: fields.slice(0),
});

const embedColorHex = computed({
  get() {
    return `#${formState.value.color.toString(16)}`;
  },
  set(value: string) {
    const color = value.replace('#', '');
    formState.value.color = parseInt(color, 16);
  }
})

const handleFieldMove = (idx: number, direction: 'up' | 'down') => {
  const fields = formState.value.fields;
  const field = fields[idx];

  if (direction === 'up' && idx > 0) {
    fields[idx] = fields[idx - 1];
    fields[idx - 1] = field;
  } else if (direction === 'down' && idx < fields.length - 1) {
    fields[idx] = fields[idx + 1];
    fields[idx + 1] = field;
  }
}

const handleFieldRemove = (idx: number) => {
  formState.value.fields.splice(idx, 1);
}

const addField = () => {
  formState.value.fields.push({
    id: uuid(),
    name: '',
    value: '',
    inline: false,
  });
}

const clearFields = () => {
  formState.value.fields = [];
}

const handleEmbedSave = (event: FormSubmitEvent<EmbedSchema>) => {
  const embed: Embed = {
    author: {
      name: '',
      icon_url: '',
    },
    color: 0xC27AFF,
    description: '',
    footer: {
      text: '',
      icon_url: '',
    },
    image: {
      url: '',
    },
    thumbnail: {
      url: '',
    },
    title: '',
    url: '',
    ...(JSON.parse(JSON.stringify(event.data)) as Embed),
    fields: event.data.fields.map((f: EmbedField) => {
      return {
        name: f.name,
        value: f.value,
        inline: f.inline,
      }
    })
  }

  emit('save', embed);
}

const handleEmbedReset = () => {
  formState.value = {
    author: {
      name: '',
      icon_url: '',
    },
    color: 0xC27AFF,
    description: '',
    footer: {
      text: '',
      icon_url: '',
    },
    image: {
      url: '',
    },
    thumbnail: {
      url: '',
    },
    title: '',
    url: '',
    ...(JSON.parse(JSON.stringify(props.embed)) as Embed),
    fields: fields.slice(0)
  }
}

const handleEmbedClear = () => {
  formState.value = {
    author: {
      name: '',
      icon_url: '',
    },
    color: 0xC27AFF,
    description: '',
    footer: {
      text: '',
      icon_url: '',
    },
    image: {
      url: '',
    },
    thumbnail: {
      url: '',
    },
    title: '',
    url: '',
    fields: [],
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2">
    <UForm class="flex w-full flex-col gap-2 py-2 flex-wrap" :schema="embedSchema" :state="formState" @submit.prevent="handleEmbedSave" @reset.prevent="handleEmbedClear">
      <EmbedEditorAuthor v-model="formState.author" />
      <EmbedEditorBody
        v-model:title="formState.title"
        v-model:title-url="formState.url"
        v-model:description="formState.description"
        v-model:color="embedColorHex"
      />
      <!-- Fields -->
      <UCollapsible>
        <UButton
          label="Fields"
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
          <UButtonGroup>
            <UButton @click="addField" label="Add field" variant="outline" />
            <UButton @click="clearFields" label="Clear fields" variant="outline" />
          </UButtonGroup>

          <TransitionGroup tag="div" name="fields" class="flex flex-col mt-2 gap-2">
            <EmbedEditorField
              v-for="(field, idx) in formState.fields"
              :key="field.id"
              :idx="idx"
              :total-fields="formState.fields.length"
              v-model="formState.fields[idx]"
              @move="handleFieldMove"
              @remove="handleFieldRemove"
            />
          </TransitionGroup>
        </template>
      </UCollapsible>
      <EmbedEditorImages v-model:image-url="formState.image.url" v-model:thumbnail-url="formState.thumbnail.url" />
      <EmbedEditorFooter v-model="formState.footer" />

      <UButtonGroup>
        <UButton type="submit" label="Save" />
        <UButton v-if="Object.keys(embed).length" @click="handleEmbedReset" label="Reset" />
        <UButton type="reset" label="Clear" />
      </UButtonGroup>
    </UForm>
    <div class="max-w-[560px] w-full mx-auto mb-4 lg:mb-0">
      <EmbedPreview :embed="formState" />
    </div>

  </div>
</template>

<style scoped>
.fields-enter-active,
.fields-leave-active {
  transition: all 0.5s ease;
}
.fields-enter-from,
.fields-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fields-move,
.fields-enter-active,
.fields-leave-active {
  transition: all 0.5s ease;
}

.fields-enter-from,
.fields-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fields-leave-active {
  position: absolute;
}
</style>