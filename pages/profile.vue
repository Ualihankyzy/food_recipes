<template>
  <div class="min-h-screen  flex">
    <!-- Сол жақ sidebar -->
    <aside class="w-full max-w-xs bg-white border-r px-6 py-8 flex flex-col items-center">
      <!-- Аватар -->
   <div class="w-24 h-24 rounded-full bg-[#588157] from-orange-400 to-orange-600 overflow-hidden mb-4 shadow-lg border-4 border-white">
          <img 
            v-if="avatarUrl" 
            :src="avatarUrl" 
            class="w-full h-full object-cover"
            alt="Profile Avatar"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-white/20">
            <span class="text-2xl font-bold text-white">
              {{ form.firstName?.[0]?.toUpperCase() || 'U' }}
            </span>
          </div>
        </div>

      <h2 class="text-lg font-semibold mb-1">
          {{ form.firstName || 'Loading...' }} {{ form.lastName || '' }}
        </h2>
      <p class="text-sm text-gray-500 mb-8">{{ form.role || 'User' }}</p>

      <!-- Home батырмасы -->
      <NuxtLink
        to="/"
        class="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-[#588157] text-white text-sm font-medium mb-4 hover:bg-[#a3b18a] transition-all shadow-md"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>Home</span>
      </NuxtLink>

      <nav class="w-full space-y-2 flex-1">
        <!-- Personal Information (бірінші) -->
        <button
          @click="activeTab = 'info'"
          :class="[
            'w-full flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all',
            activeTab === 'info'
              ? 'bg-[#588157] hover:bg-[#a3b18a] text-white font-medium shadow-sm'
              : 'text-gray-600  hover:shadow-sm'
          ]"
        >
          <svg v-if="activeTab === 'info'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
          <span>Personal Information</span>
        </button>
      </nav>

      <!-- Log Out (төменде) -->
      <div class="w-full pt-4 border-t mt-auto">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-[#588157] text-white hover:bg-[#a3b18a] text-sm font-medium transition-all hover:shadow-sm"
          :disabled="loading"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>{{ loading ? 'Logging out...' : 'Log Out' }}</span>
        </button>
      </div>
    </aside>

    <!-- Оң жақ контент -->
    <main class="flex-1 px-8 py-10">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#588157]"></div>
        </div>
        
        <!-- Personal Information табы -->
        <section v-if="activeTab === 'info' && !loading">
          <h1 class="text-2xl font-bold mb-6">Personal Information</h1>

          <div class="flex gap-6 mb-6 text-sm">
            <label class="flex items-center gap-2">
              <input type="radio" value="male" v-model="form.gender" :disabled="saving" />
              <span>Male</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="female" v-model="form.gender" :disabled="saving" />
              <span>Female</span>
            </label>
          </div>

          <!-- Форма -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <label class="block mb-1 text-gray-500">First Name</label>
              <input v-model="form.firstName" class="input" type="text" :disabled="saving" />
            </div>
            <div>
              <label class="block mb-1 text-gray-500">Last Name</label>
              <input v-model="form.lastName" class="input" type="text" :disabled="saving" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block mb-1 text-gray-500 text-sm">Email</label>
            <div class="flex items-center gap-2">
              <input v-model="form.email" class="input flex-1" type="email" :disabled="true" />
              <span class="text-green-500 text-xs font-medium">Verified</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <label class="block mb-1 text-gray-500">Address</label>
              <input v-model="form.address" class="input" type="text" :disabled="saving" />
            </div> 
            <div>
              <label class="block mb-1 text-gray-500">Phone Number</label>
              <input v-model="form.phone" class="input" type="tel" :disabled="saving" />
            </div>
          </div>

          <!-- Төменгі батырмалар -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="resetForm"
              :disabled="saving"
              class="px-6 py-2 rounded-full border border-[#588157] text-[#588157] text-sm font-medium hover:bg-[#a3b18a]"
            >
              Discard Changes
            </button>
            <button
              type="button"
              @click="saveProfile"
              :disabled="saving"
              class="px-6 py-2 rounded-full bg-[#588157] text-white text-sm font-medium hover:bg-[#a3b18a] shadow-md"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

          <p v-if="success" class="mt-4 text-sm text-green-600 font-medium">{{ success }}</p>
          <p v-if="error" class="mt-4 text-sm text-red-600 font-medium">{{ error }}</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('info')

// Loading states
const loading = ref(false)
const saving = ref(false)

// Avatar URL
const avatarUrl = ref('')
// Messages
const success = ref('')
const error = ref('')

// Form data
const form = ref({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  gender: 'male',
  avatarUrl: '',
  role: '',
  createdAt: '',
  updatedAt: ''
})

// API BASE URL
const API_BASE = 'https://medical-backend-54hp.onrender.com/api'

// Authorization header
const getAuthHeaders = () => {
  if (process.client) {
    const token = localStorage.getItem('token') // login кезде сақталған token
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }
  return { 'Content-Type': 'application/json' }
}

// Profile data жүктеу
const loadProfileData = async () => {
  try {
    loading.value = true
    error.value = ''

    const res = await $fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    // 👇 НАЗАР: нақты дерек res.data ішінде
    const user = res.data || res // егер кейде data, кейде тікелей келсе

    const nameParts = (user.name || '').split(' ')

    form.value = {
      id: user.id || '',
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || 'male',
      avatarUrl: user.avatar || '',
      role: user.role || 'User',
      createdAt: user.created_at || user.createdAt || '',
      updatedAt: user.updated_at || user.updatedAt || ''
    }

    avatarUrl.value = user.avatar || ''
    success.value = res.message || ''
  } catch (err) {
    error.value = 'Профильді жүктеу кезінде қате'
    console.error('Load profile error:', err)
    if (err.statusCode === 401) handleLogout()
  } finally {
    loading.value = false
  }
}


// Profile сақтау (PATCH)
const saveProfile = async () => {
  try {
    saving.value = true
    error.value = ''

    const updateData = {
      name: `${form.value.firstName} ${form.value.lastName}`.trim(),
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      gender: form.value.gender
    }

    const res = await $fetch(`${API_BASE}/auth/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: updateData
    })

    success.value = res.message || '✅ Профиль сәтті сақталды'
    await loadProfileData()
  } catch (err) {
    error.value = 'Сақтау кезінде қате'
    console.error('Save profile error:', err)
  } finally {
    saving.value = false
  }
}

// Reset Form (бастапқы мәндерге қайтару)
const resetForm = async () => {
  success.value = ''
  error.value = ''
  await loadProfileData()
}

// Logout
const handleLogout = async () => {
  try {
    loading.value = true
    
    // API logout (міндетті емес, тек localStorage тазалау жеткілікті)
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.clear()
    }
    
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
    if (process.client) {
      localStorage.clear()
    }
    router.push('/login')
  }
}

// Component mount болғанда деректерді жүктеу
onMounted(() => {
  loadProfileData()
})
</script>

<style scoped>
.input {
  @apply w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent transition-all;
}

.input:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}
</style>
