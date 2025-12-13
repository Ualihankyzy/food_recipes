export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (to.path !== '/login' && !token) {
      return navigateTo('/login')
    }
  }
})