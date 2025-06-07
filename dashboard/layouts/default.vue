<template>
  <div class="min-h-screen pt-18 flex flex-col">
    <Header />
    <main>
      <UContainer>
        <slot />
      </UContainer>
    </main>
    <Footer  />
  </div>
</template>