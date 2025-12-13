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
    @click="activeTab = 'info'"
    :class="[
      'w-full flex items-center gap-2 px-4 py-2 rounded-full text-sm',
      activeTab === 'info'
        ? 'bg-orange-100 text-orange-600 font-medium'
        : 'text-gray-600 hover:bg-gray-100'
    ]"
  >
    Personal Information
  </button>

  <button
    @click="activeTab = 'auth'"
    :class="[
      'w-full flex items-center gap-2 px-4 py-2 rounded-full text-sm',
      activeTab === 'auth'
        ? 'bg-orange-100 text-orange-600 font-medium'
        : 'text-gray-600 hover:bg-gray-100'
    ]"
  >
    Login & Password
  </button>

  <button
    @click="handleLogout"
    class="w-full flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-600 hover:bg-gray-100"
  >
    Log Out
  </button>
</nav>

    </aside>

    <!-- Оң жақ контент -->
   <!-- Оң жақ үлкен карточка -->
<main class="flex-1 px-8 py-10">
  <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">

    <!-- 1) Personal Information табы -->
    <section v-if="activeTab === 'info'">
      <h1 class="text-2xl font-bold mb-6">Personal Information</h1>
      <!-- Сенің бұрынғы аты, address, phone, location формалары осында қалады -->
      <!-- ... -->
      <div class="flex justify-end gap-4 mt-8">
        <button @click="resetInfo" class="px-6 py-2 rounded-full border border-orange-400 text-orange-500 text-sm font-medium">
          Discard Changes
        </button>
        <button @click="saveInfo" class="px-6 py-2 rounded-full bg-orange-500 text-white text-sm font-medium">
          Save Changes
        </button>
      </div>
    </section>

    <!-- 2) Login & Password табы -->
    <section v-else-if="activeTab === 'auth'">
      <h1 class="text-2xl font-bold mb-6">Login & Password</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
        <div class="md:col-span-2">
          <label class="block mb-1 text-gray-500">Email</label>
          <input
            v-model="authForm.email"
            type="email"
            class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label class="block mb-1 text-gray-500">Current Password</label>
          <input
            v-model="authForm.currentPassword"
            type="password"
            class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label class="block mb-1 text-gray-500">New Password</label>
          <input
            v-model="authForm.newPassword"
            type="password"
            class="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      <p v-if="authError" class="text-sm text-red-500 mb-4">{{ authError }}</p>
      <p v-if="authSuccess" class="text-sm text-green-600 mb-4">{{ authSuccess }}</p>

      <div class="flex justify-end gap-4">
        <button
          @click="resetAuth"
          class="px-6 py-2 rounded-full border border-orange-400 text-orange-500 text-sm font-medium"
        >
          Discard Changes
        </button>
        <button
          @click="saveAuth"
          class="px-6 py-2 rounded-full bg-orange-500 text-white text-sm font-medium"
        >
          Save Changes
        </button>
      </div>
    </section>
  </div>
</main>

  </div>
</template>

<script setup>
    const activeTab = ref<'info' | 'auth'>('info') 
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const success = ref('')

const initialForm = {
  gender: 'male',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  birthDate: '',
  phone: '',
  location: '',
}

const form = ref({ ...initialForm })

// Логиннен келген деректерді жүктеу
onMounted(() => {
     const storedPassword = localStorage.getItem('password')
  const storedName = localStorage.getItem('userName') || ''
  const storedEmail = localStorage.getItem('email') || ''
  const storedFirst = storedName.split(' ')[0] || storedName
  const storedLast = storedName.split(' ')[1] || ''

  form.value.firstName = storedFirst
  form.value.lastName = storedLast
  form.value.email = storedEmail
  form.value.password = storedPassword
})

// Өзгерістерді сақтау (localStorage‑қа)
const saveProfile = () => {
  localStorage.setItem('userName', `${form.value.firstName} ${form.value.lastName}`.trim())
  localStorage.setItem('email', form.value.email)
  localStorage.setItem('address', form.value.address || '')
  localStorage.setItem('birthDate', form.value.birthDate || '')
  localStorage.setItem('phone', form.value.phone || '')
  localStorage.setItem('location', form.value.location || '')
  success.value = 'Профиль сәтті сақталды'
}

// Форманы бастапқы мәнге қайтару
const resetForm = () => {
  success.value = ''
  onMounted(() => {}) // немесе localStorage‑тан қайта оқып шығуға жеке функция жазып, соны шақыр
}

// Logout
const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}


const authForm = ref({
  email: '',
  currentPassword: '',
  newPassword: ''
})

const authError = ref('')
const authSuccess = ref('')

onMounted(() => {
  // Профиль ашылғанда email мен "ескі" пароль localStorage-тан оқимыз
  authForm.value.email = localStorage.getItem('email') || ''
})

const resetAuth = () => {
  authError.value = ''
  authSuccess.value = ''
  authForm.value.email = localStorage.getItem('email') || ''
  authForm.value.currentPassword = ''
  authForm.value.newPassword = ''
}

const saveAuth = () => {
  authError.value = ''
  authSuccess.value = ''

  if (!authForm.value.email) {
    authError.value = 'Email бос болмауы керек'
    return
  }

  // Қарапайым локал өзгеріс: тек localStorage жаңартамыз
  localStorage.setItem('email', authForm.value.email)

  // Егер жаңа пароль жазса, соны сақтаймыз (реалда бекендке жіберу керек)
  if (authForm.value.newPassword) {
    localStorage.setItem('password', authForm.value.newPassword)
  }

  authForm.value.currentPassword = ''
  authForm.value.newPassword = ''
  authSuccess.value = 'Login & Password сәтті жаңартылды'
}

</script>

<style scoped>
.input {
  @apply w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400;
}
</style>
