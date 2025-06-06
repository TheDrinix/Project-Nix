<script setup lang="ts">
import { DashboardImage } from '#components';

const { loggedIn } = useUserSession()

const addToDiscordUrl = '' // TODO: Replace with actual URL
</script>

<template>
  <div>
    <UContainer class="py-20 text-center">
      <div class="max-w-3xl mx-auto">
        <div class="flex justify-center mb-6">
          <img src="~/assets/images/logo_scaled.svg" alt="Nix Logo" class="h-20 w-20">
        </div>

        <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white">
          Elevate Your Discord Server with Nix
        </h1>
        <p class="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
          A powerful, all-in-one bot for automating voice lobbies, preserving important threads, and welcoming new members with style.
        </p>

        <div class="mt-8 flex justify-center">
          <UButton
            :to="addToDiscordUrl"
            target="_blank"
            label="Add Nix to Discord"
            icon="i-simple-icons-discord"
            size="xl"
            color="primary"
          />
        </div>
      </div>
    </UContainer>

    <div class="bg-neutral-200/60 dark:bg-neutral-800/40 rounded">
      <UContainer class="py-20">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold">
            Powerful Features, Simple Management
          </h2>
          <p class="mt-2 text-neutral-500 dark:text-neutral-400">
            Nix is packed with features to make your server more engaging and easier to manage.
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <UCard>
            <div class="flex flex-col items-center text-center">
              <div class="p-4 w-16 h-16 bg-primary-50 dark:bg-primary-900/50 rounded-full">
                <UIcon name="i-heroicons-microphone-20-solid" class="h-8 w-8 text-primary" />
              </div>
              <h3 class="mt-4 text-xl font-bold">
                Dynamic Voice Lobbies
              </h3>
              <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Automatically create temporary voice channels when users join a "Lobby" channel. They're cleaned up automatically, keeping your server tidy.
              </p>
            </div>
          </UCard>

          <UCard>
            <div class="flex flex-col items-center text-center">
              <div class="p-4 w-16 h-16 bg-primary-50 dark:bg-primary-900/50 rounded-full">
                <UIcon name="i-heroicons-eye-20-solid" class="h-8 w-8 text-primary" />
              </div>
              <h3 class="mt-4 text-xl font-bold">
                Thread Watcher
              </h3>
              <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Never lose an important discussion again. Nix actively monitors specified threads, preventing Discord from auto-archiving them due to inactivity.
              </p>
            </div>
          </UCard>

          <UCard>
            <div class="flex flex-col items-center text-center">
              <div class="p-4 w-16 h-16 bg-primary-50 dark:bg-primary-900/50 rounded-full">
                <UIcon name="i-heroicons-megaphone-20-solid" class="h-8 w-8 text-primary" />
              </div>
              <h3 class="mt-4 text-xl font-bold">
                Custom Announcements
              </h3>
              <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Design beautiful, fully custom embed messages for new members, leavers, and bans. Make a great first (and last) impression, every time.
              </p>
            </div>
          </UCard>
        </div>
      </UContainer>
    </div>

    <UContainer class="py-20">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold">
            Effortless Configuration
          </h2>
          <p class="mt-4 text-neutral-500 dark:text-neutral-400">
            Why bother with clunky commands? Our intuitive web dashboard makes setup a breeze. Configure lobbies and customize announcement embeds with a live preview, all from your browser.
          </p>
          <div class="mt-6">
            <UButton
              v-if="loggedIn"
              label="Go to Dashboard"
              size="lg"
              variant="outline"
              icon="i-heroicons-arrow-right-circle-20-solid"
              to="/guilds"
            />
          </div>
        </div>
        <div class="md:block bg-neutral-200 dark:bg-neutral-800 rounded-lg p-2 aspect-video flex items-center justify-center">
          <DashboardImage />
        </div>
      </div>
    </UContainer>
  </div>
</template>