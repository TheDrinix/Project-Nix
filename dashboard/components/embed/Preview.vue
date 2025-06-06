<script setup lang="ts">
  import type { Embed } from '~/types/embed';
  import markdownit from 'markdown-it';

  const { user } = useUserSession();

  const guildsStore = useGuildStore();

  const props = defineProps<{
    embed: Embed;
    guildId?: string;
  }>();

  const md = markdownit().disable(['code', 'image']);

  const description = computed(() => {
    return props.embed.description
      ? md.render(props.embed.description)
      : '';
  })

  const clickedLink = ref('');
  const clickedLinkModal = computed({
    get: () => !!clickedLink.value,
    set: (value: boolean) => {
      if (!value) {
        clickedLink.value = '';
      }
    }
  });

  const handleLinkClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      e.preventDefault();
      const url = e.target.getAttribute('href');

      if (!url) return;

      clickedLink.value = url;
    }
  }

  const replaceUrlVariables = (url: string) => {
    if (url !== '{user_avatar}' && url !== '{guild_icon}') return url;

    if (url === '{user_avatar}') {
      if (!user.value) return '';

      return getUserAvatarUrl(user.value.discordId, user.value.avatar);
    }

    if (!props.guildId) return 'https://placehold.co/512x512/27272A/9F9FA9/?text=G';

    const guild = guildsStore.getGuild(props.guildId);

    if (!guild) return 'https://placehold.co/512x512/27272A/9F9FA9/?text=G';

    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    }
      
    const firstLetters = guild.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');

    return `https://placehold.co/512x512/27272A/9F9FA9/?text=${firstLetters}`;
  } 

  const authorIconUrl = computed(() => {
    if (!props.embed.author?.icon_url) return;

    return replaceUrlVariables(props.embed.author.icon_url);
  });

  const footerIconUrl = computed(() => {
    if (!props.embed.footer?.icon_url) return;

    return replaceUrlVariables(props.embed.footer.icon_url);
  });

  const imageUrl = computed(() => {
    if (!props.embed.image?.url) return;

    return replaceUrlVariables(props.embed.image.url);
  });

  const thumbnailUrl = computed(() => {
    if (!props.embed.thumbnail?.url) return;

    return replaceUrlVariables(props.embed.thumbnail.url);
  });
</script>

<template>
  <div
    class="embed-preview"
    :style="{ borderLeftColor: `#${embed.color.toString(16)}` }"
    @click="handleLinkClick"
  >
    <div class="flex items-center col-span-1 " v-if="embed.author?.name">
      <img
        v-if="embed.author?.icon_url"
        :src="authorIconUrl"
        alt="Author icon"
        class="w-6 h-6 mr-2 rounded-full"
      />
      <span v-if="embed.author?.name" class="font-medium text-sm text-neutral-900 dark:text-white">
        {{ embed.author?.name }}
      </span>
    </div>
    <div class="col-span-1 font-semibold text-base" v-if="embed.title">
      <a class="text-blue-400" v-if="embed.url" :href="embed.url">{{ embed.title }}</a>
      <span v-else>{{ embed.title }}</span>
    </div>
    <div v-html="description"></div>
    <div class="grid grid-cols-3 gap-2 grid-rows-[auto]">
      <div class="embed-field" :class="{ 'col-span-3': !field.inline }" v-for="field in embed.fields">
        <h3 class="text-sm">
          {{ field.name }}
        </h3>
        <div v-if="field.value" v-html="md.render(field.value)"></div>
      </div>
    </div>
    <div v-if="embed.image?.url">
      <img class="rounded" :src="imageUrl" alt="Embed image" />
    </div>
    <div class="embed-thumbnail" v-if="embed.thumbnail?.url">
      <img class="w-20 h-20 rounded ml-4" :src="thumbnailUrl" alt="Embed thumbnail image">
    </div>
    <div v-if="embed.footer?.text || embed.footer?.icon_url" class="flex items-center">
      <img
        v-if="embed.footer.icon_url"
        :src="footerIconUrl"
        alt="Embed footer icon"
        class="w-5 h-5 mr-2 rounded-full"
      />
      <span class="text-xs">{{ embed.footer.text }}</span>
    </div>

    <UModal v-model:open="clickedLinkModal" title="You've clicked a link to an external site" description="Be careful when clicking links to external sites. This link will open in a new tab.">
      <template #body>
        <div class="flex flex-col">
          <p>The link you've clicked points to <span class="text-blue-400">{{ clickedLink }}</span>. If you want to continue to the page, click the button bellow.</p>
          <div class="flex gap-2 ml-auto mt-2">
            <UButton class="cursor-pointer" @click="clickedLinkModal = false" color="info">Cancel</UButton>
            <UButton class="cursor-pointer" :href="clickedLink" color="info">Continue</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style>
@import 'tailwindcss';

.embed-preview {
  @apply bg-neutral-200 dark:bg-neutral-800 border-l-4 border-l-neutral-800 rounded
  pt-2 pb-4 px-4 mt-2 text-sm
  grid grid-rows-[auto] max-w-[520px] mx-auto;

  grid-template-columns: 1fr auto;
}

.embed-preview > div {
  @apply col-start-1 mt-2;
}

.embed-preview h1 {
  @apply text-xl font-bold text-neutral-900 dark:text-white;
}

.embed-preview h2 {
  @apply text-lg font-bold text-neutral-900 dark:text-white;
}

.embed-preview h3 {
  @apply text-base font-bold text-neutral-900 dark:text-white;
}

.embed-field h3 {
  @apply text-sm mt-0 mb-1;
}

.embed-preview h1,
.embed-preview h2,
.embed-preview h3 {
  @apply mt-4 mb-2;
}

.embed-preview ul {
  @apply list-disc list-outside ml-4;
}

.embed-preview ol {
  @apply list-decimal list-outside ml-3;
}

.embed-preview li {
  @apply mb-1;
}

.embed-preview a {
  @apply text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300;
}

.embed-preview .embed-thumbnail {
  @apply row-start-1 row-span-8 col-start-2;
}

.embed-preview code {
  @apply bg-neutral-400/50 dark:bg-neutral-900 text-wrap
}
</style>