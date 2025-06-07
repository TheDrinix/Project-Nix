<script lang="ts" setup>
const currentYear = new Date().getFullYear()

const githubUrl = 'https://github.com/TheDrinix/project-nix'
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 mt-auto">
    <UContainer class="py-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          © {{ currentYear }} Project Nix. All Rights Reserved.
        </p>

        <div class="flex items-center gap-x-2 sm:gap-x-4">
          <UButton
            to="/terms-of-service"
            label="Terms"
            color="neutral"
            variant="link"
          />
          <UButton
            to="/privacy-policy"
            label="Privacy"
            color="neutral"
            variant="link"
          />
          <UButton
            :to="githubUrl"
            target="_blank"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            aria-label="GitHub Repository"
          />
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<style>

</style>