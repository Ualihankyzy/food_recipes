export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (to.path !== '/login' && (!token || !userId)) {
      return navigateTo('/login')
    }
  }
})
