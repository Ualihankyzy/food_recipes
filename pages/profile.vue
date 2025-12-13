<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Сол жақ sidebar -->
    <aside class="w-full max-w-xs bg-white border-r px-6 py-8 flex flex-col items-center">
      <!-- Аватар -->
      <div class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
        <!-- сурет қойғың келсе <img ...> -->
      </div>
      <h2 class="text-lg font-semibold mb-1">{{ form.firstName }} {{ form.lastName }}</h2>
      <p class="text-sm text-gray-500 mb-8">User</p>

      <nav class="w-full space-y-2">
        <button
          class="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-medium text-sm"
        >
          <span>Personal Information</span>
        </button>
    
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100 text-sm"
        >
          <span>Log Out</span>
        </button>
      </nav>
    </aside>

    <!-- Оң жақ контент -->
    <main class="flex-1 px-8 py-10">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 class="text-2xl font-bold mb-6">Personal Information</h1>

        <!-- Жыныс -->
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
            class="px-6 py-2 rounded-full border border-orange-400 text-orange-500 text-sm font-medium"
          >
            Discard Changes
          </button>
          <button
            type="button"
            @click="saveProfile"
            class="px-6 py-2 rounded-full bg-orange-500 text-white text-sm font-medium"
          >
            Save Changes
          </button>
        </div>

        <p v-if="success" class="mt-4 text-sm text-green-600">{{ success }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('info')

// Personal Information
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

// Login & Password
const authForm = ref({
  email: '',
  currentPassword: '',
  newPassword: ''
})
const authError = ref('')
const authSuccess = ref('')

onMounted(() => {
  loadProfileData()
  loadAuthData()
})

const loadProfileData = () => {
  const storedName = localStorage.getItem('userName') || ''
  const storedEmail = localStorage.getItem('email') || ''
  const storedAddress = localStorage.getItem('address') || ''
  const storedBirthDate = localStorage.getItem('birthDate') || ''
  const storedPhone = localStorage.getItem('phone') || ''
  const storedLocation = localStorage.getItem('location') || ''

  const [storedFirst, storedLast = ''] = storedName.split(' ')

  form.value.firstName = storedFirst
  form.value.lastName = storedLast
  form.value.email = storedEmail
  form.value.address = storedAddress
  form.value.birthDate = storedBirthDate
  form.value.phone = storedPhone
  form.value.location = storedLocation
}

const loadAuthData = () => {
  authForm.value.email = localStorage.getItem('email') || ''
}

// ✅ Save жұмыс істейді
const saveProfile = () => {
  localStorage.setItem('userName', `${form.value.firstName} ${form.value.lastName}`.trim())
  localStorage.setItem('email', form.value.email)
  localStorage.setItem('address', form.value.address || '')
  localStorage.setItem('birthDate', form.value.birthDate || '')
  localStorage.setItem('phone', form.value.phone || '')
  localStorage.setItem('location', form.value.location || '')
  
  success.value = '✅ Профиль сәтті сақталды'
  
  // ✅ Авто жаңарту
  loadProfileData()
}

// ✅ Reset дұрыс жұмыс істейді
const resetForm = () => {
  success.value = ''
  loadProfileData()  // ✅ Жаңа деректерді оқиды
}

// Auth функциялары (бұрынғыдай)
const resetAuth = () => {
  authError.value = ''
  authSuccess.value = ''
  loadAuthData()
}

const saveAuth = async () => {
  // ... (бұрынғы логика)
}
</script>

<style scoped>
.input {
  @apply w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400;
}
</style>
