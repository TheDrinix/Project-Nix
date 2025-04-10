export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    // Create toast if triggered on the client
    if (import.meta.client) {
      const toast = useToast();
      toast.add({
        title: 'Unauthorized',
        description: 'You must be logged in to access this page.',
        color: 'red'
      })
    }

    return navigateTo('/');
  }
})
