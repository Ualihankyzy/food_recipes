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
      <p class="text-sm text-gray-500 mb-8">User</p>

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
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </aside>

    <!-- Оң жақ контент -->
    <main class="flex-1 px-8 py-10">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        
        <!-- Personal Information табы -->
        <section v-if="activeTab === 'info'">
          <h1 class="text-2xl font-bold mb-6">Personal Information</h1>

          
          <div class="flex gap-6 mb-6 text-sm">
            <label class="flex items-center gap-2">
              <input type="radio" value="male" v-model="form.gender" />
              <span>Male</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="female" v-model="form.gender" />
              <span>Female</span>
            </label>
          </div>

          <!-- Форма -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <label class="block mb-1 text-gray-500">First Name</label>
              <input v-model="form.firstName" class="input" type="text" />
            </div>
            <div>
              <label class="block mb-1 text-gray-500">Last Name</label>
              <input v-model="form.lastName" class="input" type="text" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block mb-1 text-gray-500 text-sm">Email</label>
            <div class="flex items-center gap-2">
              <input v-model="form.email" class="input flex-1" type="email" />
              <span class="text-green-500 text-xs font-medium">Verified</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <label class="block mb-1 text-gray-500">Address</label>
              <input v-model="form.address" class="input" type="text" />
            </div>
            <div>
              <label class="block mb-1 text-gray-500">Date of Birth</label>
              <input v-model="form.birthDate" class="input" type="date" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
            <div>
              <label class="block mb-1 text-gray-500">Phone Number</label>
              <input v-model="form.phone" class="input" type="tel" />
            </div>
            <div>
              <label class="block mb-1 text-gray-500">Location</label>
              <input v-model="form.location" class="input" type="text" />
            </div>
          </div>

          <!-- Төменгі батырмалар -->
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="resetForm"
              class="px-6 py-2 rounded-full border border-[#588157] text-[#588157] text-sm font-medium hover:bg-[#a3b18a]"
            >
              Discard Changes
            </button>
            <button
              type="button"
              @click="saveProfile"
              class="px-6 py-2 rounded-full bg-[#588157] text-white text-sm font-medium hover:bg-[#a3b18a] shadow-md"
            >
              Save Changes
            </button>
          </div>

          <p v-if="success" class="mt-4 text-sm text-green-600 font-medium">{{ success }}</p>
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

// Avatar URL (бастапқыда бос)
const avatarUrl = ref('')
// Form (бастапқыда бос)
const success = ref('')
const form = ref({
  gender: 'male',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  birthDate: '',
  phone: '',
  location: ''
})

// ✅ ТЕК CLIENT-ТЕ (onMounted ішінде) localStorage оқу
onMounted(() => {
  loadProfileData()
})

const loadProfileData = () => {
  // ✅ process.client тексеру (SSR-да өткізбейді)
  if (process.client) {
    const storedName = localStorage.getItem('userName') || ''
    const storedEmail = localStorage.getItem('email') || ''
    const storedAddress = localStorage.getItem('address') || ''
    const storedBirthDate = localStorage.getItem('birthDate') || ''
    const storedPhone = localStorage.getItem('phone') || ''
    const storedLocation = localStorage.getItem('location') || ''
    const storedAvatar = localStorage.getItem('avatarUrl') || ''

    const [storedFirst, storedLast = ''] = storedName.split(' ')

    form.value.firstName = storedFirst
    form.value.lastName = storedLast
    form.value.email = storedEmail
    form.value.address = storedAddress
    form.value.birthDate = storedBirthDate
    form.value.phone = storedPhone
    form.value.location = storedLocation
    avatarUrl.value = storedAvatar
  }
}

// Save Profile (тек клиентте)
const saveProfile = () => {
  if (process.client) {
    localStorage.setItem('userName', `${form.value.firstName} ${form.value.lastName}`.trim())
    localStorage.setItem('email', form.value.email)
    localStorage.setItem('address', form.value.address || '')
    localStorage.setItem('birthDate', form.value.birthDate || '')
    localStorage.setItem('phone', form.value.phone || '')
    localStorage.setItem('location', form.value.location || '')
  }
  
  success.value = '✅ Профиль сәтті сақталды'
  loadProfileData()
}

// Reset Form
const resetForm = () => {
  success.value = ''
  loadProfileData()
}

// Logout
const handleLogout = () => {
  if (process.client) {
    localStorage.clear()
  }
  router.push('/login')
}
</script>


<style scoped>
.input {
  @apply w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent transition-all;
}
</style>