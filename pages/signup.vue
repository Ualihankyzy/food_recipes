<template>
  <div class="flex min-h-screen font-sans">
    <!-- Сол жақ: full screen сурет -->
    <div class="hidden md:block w-1/2 h-screen">
      <img src="/images/food.jpg" class="w-full h-full object-cover" />
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
            {{ isAdminMode ? 'Create User Account' : 'Create Account' }}
          </h1>
          <p class="text-gray-500 text-base md:text-lg">
            {{ isAdminMode ? 'Admin created account for user login.' : 'Sign up to save and share your favorite food recipes.' }}
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <!-- Admin mode indicator -->
          <div v-if="isAdminMode" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-xs text-blue-800 font-medium">
              👤 Admin created account
            </p>
            <p class="text-xs text-blue-600 mt-1">
              User can login with: {{ form.email }} / {{ form.password }}
            </p>
          </div>

          <!-- Sign Up button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-[#f8961e] text-white py-3.5 rounded-md text-base font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading">Creating...</span>
            <span v-else>{{ isAdminMode ? 'Create User' : 'Sign Up' }}</span>
          </button>
        </form>

        <p v-if="!isAdminMode" class="mt-10 text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="font-semibold text-[#f8961e] hover:underline">
            Login
          </NuxtLink>
        </p>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="error" class="fixed top-4 right-4 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg max-w-sm">
      {{ error }}
    </div>
    <div v-if="success" class="fixed top-4 right-4 z-50 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg max-w-sm">
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 🔥 Admin mode detection
const isAdminMode = ref(false)
const returnUrl = ref('/admin/users') // админ панеліне қайту

// Form state
const form = ref({
  name: '',
  email: '',
  password: ''
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)

// URL parameters-ден admin mode тексеру
const initAdminMode = () => {
  const adminMode = route.query.admin === 'true'
  const prefillName = route.query.name
  const prefillEmail = route.query.email
  
  isAdminMode.value = adminMode
  returnUrl.value = route.query.return || '/admin/users'
  
  if (prefillName) form.value.name = decodeURIComponent(prefillName)
  if (prefillEmail) form.value.email = decodeURIComponent(prefillEmail)
}

const handleSubmit = async () => {
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.password.trim()) {
    error.value = 'Барлық өрістерді толтырыңыз!'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'Пароль кемінде 6 символ болуы керек!'
    return
  }

  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await $fetch('https://medical-backend-54hp.onrender.com/api/auth/register', {
      method: 'POST',
      body: form.value
    })

    // Success handling
    if (isAdminMode.value) {
      // 🔥 Admin mode: admin панеліне қайту
      success.value = `✅ User "${form.value.name}" created successfully!`
      
      setTimeout(() => {
        // admin панеліне user list-ке қайту
        router.push(returnUrl.value)
      }, 1500)
    } else {
      // 🔥 Normal user signup: localStorage сақтау + login
      localStorage.setItem('loginEmail', form.value.email)
      localStorage.setItem('loginPassword', form.value.password)
      localStorage.setItem('email', form.value.email)
      localStorage.setItem('password', form.value.password)
      
      success.value = '✅ Регистрация успешна!'
      
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  } catch (err) {
    console.error('Signup error:', err)
    
    if (err.statusCode === 409 || err.statusCode === 400) {
      error.value = '❌ Бұл email адресі бұрын тіркелген!'
    } else {
      error.value = err.data?.message || '❌ Регистрация қатесі!'
    }
  } finally {
    isLoading.value = false
  }
}

// Admin-ден шақыру: /signup?admin=true&name=John&email=john@example.com
onMounted(() => {
  initAdminMode()
})
</script>
