<script lang="ts" setup>
useHead({
  title: 'Privacy Policy - Project Nix'
})

definePageMeta({
  alias: '/privacy-policy',
})
</script>

<template>
  <UContainer class="py-12">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Privacy Policy</h1>
        <p class="text-gray-500">Last Updated: June 6, 2025</p>
      </template>

      <div class="prose dark:prose-invert max-w-none flex flex-col gap-4">
        <h2>1. Introduction</h2>
        <div>
          <p>
            This Privacy Policy describes how Lukas Belica ("us", "we", or "our") collects, uses, and protects information in connection with your use of the Nix Discord bot ("Bot") and its associated web dashboard ("Service"). We are committed to protecting your privacy and handling your data in an open and transparent manner.
          </p>
          <p>
            For the purpose of the EU General Data Protection Regulation (GDPR), we are the <strong>Data Processor</strong> of the configurations you create, and you, the server administrator, are the <strong>Data Controller</strong>.
          </p>
        </div>

        <h2>2. Lawful Basis for Processing</h2>
        <p>
          We only collect and process personal data about you where we have a lawful basis to do so under GDPR. Our lawful basis for processing the information described in this policy is the <strong>performance of a contract</strong>. When you add our Bot to your server and agree to our Terms of Service, you enter into a contract with us to provide the Service's features, and we need to process certain data to fulfill that contract.
        </p>

        <h2>3. Information We Collect</h2>
        <div>
          <p>We adhere to the principle of data minimization and only collect what is necessary to provide the Service.</p>
          <h3 class="font-medium mt-2">Information Collected Automatically</h3>
          <ul class="list-disc ml-6 my-2">
            <li><strong>Discord User, Guild (Server), Channel, and Thread IDs:</strong> We use these identifiers to link your configurations to the correct user, server, and channel, and to operate the Bot's features. We do not store usernames or channel names, only their numerical IDs.</li>
          </ul>
          <h3 class="font-medium mt-2">Information You Provide Through Configuration</h3>
          <ul class="list-disc ml-6 my-2">
            <li><strong>Bot Configurations:</strong> We store the settings you create for features like Voice Lobbies and Announcement Messages. This includes the content of the announcement messages you write.</li>
          </ul>
          <p><strong>We do not collect or store the content of user messages in your channels.</strong> Our Bot only processes command-related content and does not log conversations.</p>
        </div>

        <h2>4. How We Use Your Information</h2>
        <div>
          <p>Your information is used exclusively to:</p>
          <ul class="list-disc ml-6 my-2">
            <li><strong>Provide, maintain, and operate the Service</strong> as configured by you.</li>
            <li><strong>Authenticate your identity</strong> on the dashboard and verify your permissions.</li>
            <li><strong>Provide customer support</strong> and respond to your inquiries.</li>
          </ul>
        </div>

        <h2>5. Data Storage and Security</h2>
        <p>
          Your configuration data is stored in a PostgreSQL database on a Virtual Private Server hosted by <strong>Hetzner Online GmbH</strong>. All data is physically stored in their data center park in <strong>Germany</strong>, within the European Union. We implement appropriate technical and organizational measures to protect your data from loss, theft, misuse, and unauthorized access, in line with industry best practices and GDPR requirements. We retain your configuration data only for as long as the Bot remains on your server. When you remove the Bot from your server, all associated configuration data is deleted immedietaly.
        </p>

        <h2>6. Data Processing Location</h2>
        <div>
          <p>
            To provide our Service, all data we process, including the information outlined in this policy, is stored and processed exclusively on servers located within the European Union (Germany). <strong>We do not transfer your personal data outside of the European Economic Area (EEA).</strong> This ensures your data is protected under the full scope of the General Data Protection Regulation (GDPR).
          </p>

          <p>
            We do not transfer your personal data to any countries outside of the European Economic Area (EEA). This ensures your data is protected under the full scope of the General Data Protection Regulation (GDPR).
          </p>
        </div>

        <h2>7. Your Rights Under GDPR</h2>
        <div>
          <p>As a user from the EEA, you have the following rights regarding your personal data:</p>
          <ul class="list-disc ml-6 my-2">
            <li><strong>The Right to Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
            <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete. You can manage most of this data directly on the dashboard.</li>
            <li><strong>The Right to Erasure (Right to be Forgotten):</strong> You have the right to request that we erase your personal data. This is primarily accomplished by removing the Bot from your server.</li>
            <li><strong>The Right to Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data under certain conditions.</li>
            <li><strong>The Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, in a machine-readable format.</li>
            <li><strong>The Right to Object:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at support@drinix.xyz. We will respond to your request within 30 days.
          </p>
        </div>
        
        <h2>8. Right to Lodge a Complaint</h2>
        <p>
          You have the right to lodge a complaint with a data protection supervisory authority. If you are in the EEA, you can complain to the supervisory authority in your member state of residence, place of work, or place of the alleged infringement.
        </p>
        
        <h2>9. Children's Privacy</h2>
        <p>
          Our Service is not directed to individuals under the age of 13 (or the applicable age of digital consent in your country). We do not knowingly collect personal information from children.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data protection practices, please contact us at: <strong>support@drinix.xyz</strong>.
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