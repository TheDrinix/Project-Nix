<script setup lang="ts">
import type { Embed } from '~/types/embed';

const embed = {
  description:
    '# This is a markdown header inside of the embed\n## Header level 2\n### Header level 3\nThis is an **awesome** embed here\nLmao why is this so cool\n',
  fields: [
    {
      name: 'So this is a field of this awesome embed',
      value:
        "Why is this field awesome:\n- It just is\n- Don't ask about things you don;t know about\n- lol",
      inline: false,
    },
    {
      name: 'This is an inline field',
      value: 'Hello from the inline field 1',
      inline: true,
    },
    {
      name: 'This is an inline field',
      value: 'Hello from the inline field 2\n[Snowrunner](https://snowrunner.drinix.xyz/)',
      inline: true,
    },
    {
      name: 'dfhjgskdjfhg djkh',
      value: 'jkdfghskjldhfgjkl',
      inline: true,
    },
    {
      name: 'jhksdgjklhdfglk jhsdfg ',
      value: '`jhdsgfsjklhdfgkljsdhfg jklsgfjkl bsdfjkl bnsdfjklgb jkldsb fgkl`',
      inline: true,
    },
  ],
  color: 12745471,
  author: {
    name: 'Drinix',
    iconUrl:
      'https://cdn.discordapp.com/avatars/416628954812776459/d49ebac65658d89564befae6651de2fe.png',
  },
  title: 'This is an awesome embed title',
  titleUrl: 'https://snowrunner.drinix.xyz',
  image: {
    url: 'https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2018/08/bananas-1354785_1920.jpg',
  },
  thumbnail: {
    url: 'https://www.kroger.com/product/images/xlarge/front/0000000004011',
  },
  footer: {
    text: 'This embed, while it is awesome, it has to end, so here it is :(',
    iconUrl:
      'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
  },
};
</script>

<template>
  <div>
    <EmbedEditor :embed />
<!--    <EmbedPreview :embed />-->
  </div>
</template>