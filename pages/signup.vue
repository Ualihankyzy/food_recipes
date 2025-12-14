<template>
  <div class="flex min-h-screen font-sans">
    <!-- Сол жақ: full screen сурет -->
    <div class="hidden md:block w-1/2 h-screen">
      <img src="../public/images/food.jpg" class="w-full h-full object-cover" />
    </div>

    <!-- Оң жақ: Sign Up форма -->
    <div class="flex items-center justify-center bg-white md:w-1/2 w-full">
      <div class="w-full max-w-lg px-8 md:px-12">
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-4 h-4 bg-[#f8961e] rounded-sm"></div>
            <span class="font-semibold text-gray-800 text-base">FoodRecipes</span>
          </div>
          <h1 class="text-3xl text-[#6a994e] md:text-5xl font-extrabold mb-4 leading-tight">
            Create Account
          </h1>
          <p class="text-gray-500 text-base md:text-lg">
            Sign up to save and share your favorite food recipes.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="form.name"
              type="text"
              :disabled="loading"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent disabled:bg-gray-100"
              placeholder="Your name"
            />
          </div>

          <!-- Email -->
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

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              :disabled="loading"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent disabled:bg-gray-100"
              placeholder="Create a password"
            />
          </div>

          <!-- Sign Up button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#f8961e] text-white py-3.5 rounded-md text-base font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? 'Creating Account...' : 'Sign Up' }}</span>
          </button>
        </form>

        <p class="mt-10 text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="font-semibold text-[#f8961e] hover:underline">
            Login
          </NuxtLink>
        </p>

        <!-- Хабарлар -->
        <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {{ error }}
        </div>
        <div v-if="success" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          {{ success }}
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
  name: "",
  email: "",
  password: "",
})

const error = ref("")
const success = ref("")
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ""
  success.value = ""
  loading.value = true

  try {
    const response = await $fetch("https://medical-backend-54hp.onrender.com/api/auth/register", {
      method: "POST",
      body: form.value
    })

    success.value = "✅ Регистрация сәтті өтті! Login бетіне өтесіз..."

    setTimeout(() => {
      router.push("/login")
    }, 1500)
  } catch (err) {
    error.value = err.data?.message || err.message || "Регистрация кезінде қате"
    console.error("Register error:", err)
  } finally {
    loading.value = false
  }
}
</script>
