<template>
  <div class="flex min-h-screen font-sans">
    <!-- Сол жақ: full screen сурет -->
    <div class="hidden md:block w-1/2 h-screen">
      <img src="../public/images/food.jpg" class="w-full h-full object-cover" />
    </div>

    <!-- Оң жақ: Login форма -->
    <div class="flex items-center justify-center bg-white md:w-1/2 w-full">
      <div class="w-full max-w-lg px-8 md:px-12">
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-4 h-4 bg-[#f8961e] rounded-sm"></div>
            <span class="font-semibold text-gray-800 text-base">FoodRecipes</span>
          </div>
          <h1 class="text-3xl text-[#6a994e] md:text-5xl font-extrabold mb-4 leading-tight">
            Hello, Welcome Back
          </h1>
          <p class="text-gray-500 text-base md:text-lg">
            Login to manage your favorite food recipes.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              :disabled="loading"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent disabled:bg-gray-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              :disabled="loading"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent disabled:bg-gray-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#f8961e] text-white py-3.5 rounded-md text-base font-semibold hover:bg-[#f8961e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
          </button>
        </form>

        <p class="mt-10 text-sm text-gray-500">
          Don't have an account?
          <a href="/signup" class="font-semibold text-[#f8961e] hover:underline">Signup</a>
        </p>

        <!-- Хабар шығару -->
        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const form = ref({
  email: "",
  password: "",
})

const error = ref("")
const loading = ref(false)

const handleLogin = async () => {
  error.value = ""
  loading.value = true

  // Бос өрістерді тексеру
  if (!form.value.email || !form.value.password) {
    error.value = "Email және пароль толтырыңыз"
    loading.value = false
    return
  }

  try {
    const response = await $fetch("https://medical-backend-54hp.onrender.com/api/auth/login", {
      method: "POST",
      body: form.value
    })

    console.log("✅ Login response:", response) // Debug үшін

    // ✅ API response structure бойынша тексеру
    if (response.success && response.token) {
      // Token және user деректерін сақтау
      localStorage.setItem("token", response.token)
      localStorage.setItem("userId", response.user?.id || "")
      localStorage.setItem("userName", response.user?.name || "")
      localStorage.setItem("email", response.user?.email || form.value.email)
      
      console.log("✅ Login сәтті! Token сақталды:", response.token.substring(0, 20) + "...")
      
      // Profile бетіне бару
      router.push("/")
    } else {
      error.value = response.message || "Email немесе пароль дұрыс емес"
    }
  } catch (err) {
    console.error("❌ Login error:", err)
    error.value = err.data?.message || err.message || "Email немесе пароль дұрыс емес"
  } finally {
    loading.value = false
  }
}
</script>
