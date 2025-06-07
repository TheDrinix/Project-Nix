<script lang="ts" setup>
useHead({
  title: 'Terms of Service - Project Nix'
})

definePageMeta({
  alias: '/terms-of-service',
})
</script>

<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Terms of Service</h1>
        <p class="text-gray-500">Last Updated: June 6, 2025</p>
      </template>

      <div class="prose dark:prose-invert max-w-none flex flex-col gap-4">
        <p>
          Please read these Terms of Service ("Terms") carefully before using the Nix Discord bot ("Bot") and its associated web dashboard ("Service") operated by Lukas Belica ("us", "we", or "our").
        </p>

        <p>
          Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service. By adding the Bot to your Discord server or using the Dashboard, you agree to be bound by these Terms.
        </p>

        <h2>1. The Service</h2>
        <p>
          Project Nix provides a Discord bot and web dashboard designed to manage Discord servers. Features include, but are not limited to, dynamic voice channel creation ("Lobbies"), preventing threads from being archived ("Thread Watcher"), and customizable member announcement messages. The Service is provided "as is" and we reserve the right to modify or discontinue the Service at any time without notice.
        </p>

        <h2>2. Privacy Policy</h2>
        <p>
          Your use of the Service is also governed by our Privacy Policy, which details how we collect, use, and protect your data. By using the Service, you acknowledge that you have read and agree to the terms of our <NuxtLink to="/PrivacyPolicy">privacy policy</NuxtLink>. The Privacy Policy is an integral part of these Terms.
        </p>


        <h2>3. User Responsibilities and Conduct</h2>
        <div>
          <p>You agree not to use the Service to:</p>
          <ul class="list-disc ml-6 my-2">
            <li>Violate any applicable laws, regulations, or the Discord Terms of Service.</li>
            <li>Engage in any form of harassment, abuse, or spam.</li>
            <li>Configure the Bot to post or generate content that is unlawful, defamatory, obscene, or hateful.</li>
            <li>Attempt to gain unauthorized access to our systems or disrupt the Service's operation.</li>
          </ul>
          <p>
            You are solely responsible for the content and configurations you create using the Service, including the text and images used in custom announcement messages.
          </p>
        </div>

        <h2>4. Termination</h2>
        <div>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            You can terminate your agreement to these Terms at any time by removing the Nix bot from all Discord servers you control and ceasing to use the web dashboard.
          </p>
        </div>

        <h2>5. Disclaimers and Limitation of Liability</h2>
        <div>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the reliability, availability, or accuracy of the Service.
          </p>
          <p>
            In no event shall Lukas Belica be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of data, goodwill, or other intangible losses, resulting from your use of the Service.
          </p>
        </div>
        
        <h2>6. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of material changes, for example by posting a notice on our website or through a Discord announcement. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us via email at support@drinix.xyz or by opening an issue on our GitHub repository.
        </p>
      </div>
    </UCard>
  </UContainer>
</template>

<style scoped>
h2 {
  font-size: 1.375rem;
  line-height: 1.5rem;
  font-weight: 600;
}
</style>