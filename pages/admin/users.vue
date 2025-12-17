<template>
  <div class="min-h-screen flex bg-[#f5f6f1] font-sans">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 border-r border-white/10 lg:w-20 lg:flex hidden',
        isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
      ]"
    >
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">Admin</span>
        </div>
        <button class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" @click="isSidebarOpen = !isSidebarOpen">
          <span v-if="isSidebarOpen">⟨</span><span v-else>⟩</span>
        </button>
      </div>

      <nav class="flex-1 py-5 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="() => { activeMenu = item.key; item.to && router.push(item.to); }"
          class="relative w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200"
        >
          <span
            class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200"
            :class="[activeMenu === item.key && isSidebarOpen ? 'translate-x-0' : '-translate-x-full']"
          ></span>

          <span
            class="relative z-10 flex-shrink-0"
            :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/90 hover:text-white'"
          >
            <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zM3 21h8v-6H3v6z"/>
            </svg>
            <svg v-else-if="item.icon === 'recipes'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a2 2 0 012-2h9a2 2 0 012 2v13a1 1 0 01-1.447.894L12 18.618l-3.553 1.276A1 1 0 017 19V5a2 2 0 00-2-2H4z"/>
            </svg>
            <svg v-else-if="item.icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
          </span>

          <span
            v-if="isSidebarOpen"
            class="relative z-10"
            :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/80 hover:text-white'"
          >
            {{ item.label }}
          </span>
        </button>
      </nav>

      <div class="p-4 border-t border-white/10">
        <div v-if="isSidebarOpen" class="flex items-center gap-3 mb-3 p-2 rounded-lg bg-white/10">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
            {{ adminInitial }}
          </div>
          <div>
            <p class="font-semibold text-sm">{{ adminName }}</p>
            <p class="text-xs text-emerald-100/80">Admin</p>
          </div>
        </div>
        <button class="w-full flex items-center gap-2 text-xs text-emerald-50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors" @click="logout">
          <span>⏻</span><span v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- MOBILE MENU BUTTON -->
    <button 
      class="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#588157] text-white rounded-xl shadow-lg"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- MOBILE SIDEBAR OVERLAY -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="isMobileMenuOpen = false"
    ></div>
    <aside 
      v-if="isMobileMenuOpen" 
      class="fixed top-0 left-0 h-full w-64 bg-[#588157] z-50 lg:hidden shadow-2xl"
    >
      <!-- Mobile sidebar content same as desktop -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <span class="text-lg font-semibold tracking-wide">Admin</span>
        <button class="text-white p-2" @click="isMobileMenuOpen = false">✕</button>
      </div>
      <nav class="flex-1 py-5 space-y-1 px-2">
        <!-- Mobile menu items -->
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="() => { activeMenu = item.key; item.to && router.push(item.to); isMobileMenuOpen = false; }"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium bg-white/10 rounded-xl hover:bg-white/20 transition-all"
        >
          <!-- Mobile icons -->
          <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zM3 21h8v-6H3v6z"/>
          </svg>
          <svg v-else-if="item.icon === 'recipes'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a2 2 0 012-2h9a2 2 0 012 2v13a1 1 0 01-1.447.894L12 18.618l-3.553 1.276A1 1 0 017 19V5a2 2 0 00-2-2H4z"/>
          </svg>
          <svg v-else-if="item.icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z"/>
          </svg>
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col bg-slate-50 lg:ml-0 ml-16">
      <!-- Header -->
      <header class="h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between px-4 lg:px-8">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#31572c]">Users Management</h1>
          <div class="text-sm text-slate-500">Total: {{ users.length }}</div>
        </div>
        <div class="flex items-center gap-3">
          <button class="w-12 h-12 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold shadow-md hover:bg-[#476747] transition-colors" @click="router.push('/profile')">
            {{ adminInitial }}
          </button>
        </div>
      </header>

      <main class="flex-1 px-4 py-8 lg:px-8 overflow-y-auto">
        <!-- Create button -->
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Users</h2>
            <p class="text-xs text-slate-500">Showing {{ users.length }} users</p>
          </div>
          <button @click="openCreateUser" class="px-6 py-3 bg-[#588157] text-white rounded-2xl font-semibold hover:bg-[#476747] shadow-md transition-all flex items-center gap-2 w-full lg:w-auto justify-center">
            + Create User
          </button>
        </div>

        <!-- Table -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm min-w-[600px]">
                <thead class="bg-slate-50 text-left text-xs text-slate-500">
                  <tr>
                    <th class="px-4 py-3 w-12"></th>
                    <th class="px-4 py-3">Avatar</th>
                    <th class="px-4 py-3">Name</th>
                    <th class="px-4 py-3">Email</th>
                    <th class="px-4 py-3">Saved recipes</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Last activity</th>
                    <th class="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.userId" class="border-t border-slate-100 hover:bg-slate-50/80">
                    <td class="px-4 py-3 w-12">
                      <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                        <div class="w-full h-full flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-indigo-500 to-sky-400 text-white">
                          {{ user.initial }}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3"></td>
                    <td class="px-4 py-3 text-slate-900 font-medium max-w-[150px] truncate">{{ user.username }}</td>
                    <td class="px-4 py-3 text-slate-500 max-w-[200px] truncate">{{ user.email || '-' }}</td>
                    <td class="px-4 py-3 text-slate-700">{{ user.savedCount }}</td>
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium" :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-500">{{ user.lastSaved }}</td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button 
                          class="p-1.5 rounded-full hover:bg-slate-100 transition-all" 
                          title="View details"
                          @click="showUserInfo(user)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-700 hover:text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          class="p-1.5 rounded-full hover:bg-slate-100 transition-all" 
                          title="Edit user"
                          @click="editUser(user)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          class="p-1.5 rounded-full hover:bg-slate-100 transition-all" 
                          title="Delete user"
                          @click="deleteUser(user.userId)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!users.length && !loading">
                    <td colspan="8" class="px-4 py-12 text-center text-slate-400 text-sm">
                      No users found. Create first user!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-100">
              <span>Showing {{ users.length }} users</span>
              <div>25 per page</div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- CREATE/EDIT USER MODAL -->
    <transition name="fade">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 lg:p-6"
        @click.self="closeCreateModal"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div class="px-6 py-5 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <div>
              <h3 class="text-xl font-bold text-[#31572c]">{{ editingUser ? 'Edit User' : 'Create User Account' }}</h3>
              <p class="text-sm text-slate-600 mt-1">{{ editingUser ? 'Update user information' : 'User will login with these credentials' }}</p>
            </div>
            <button @click="closeCreateModal" class="text-[#6c7570] hover:text-black text-xl">✕</button>
          </div>

          <form @submit.prevent="handleRegister" class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                v-model="registerForm.name"
                type="text"
                required
                class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
                placeholder="User name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                :disabled="!!editingUser"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="user@example.com"
              />
            </div>

            <div v-if="!editingUser">
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                minlength="6"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            <div v-if="registerForm.email && !editingUser" class="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <p class="text-xs font-medium text-blue-800 mb-2">Login credentials:</p>
              <div class="text-xs space-y-1 text-blue-700">
                <div><strong>Email:</strong> {{ registerForm.email }}</div>
                <div><strong>Password:</strong> {{ registerForm.password }}</div>
              </div>
            </div>

            <div v-if="registerError" class="p-3 bg-red-100 border border-red-300 rounded-xl">
              <p class="text-sm text-red-700">{{ registerError }}</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                @click="closeCreateModal"
                class="px-6 py-3 rounded-xl text-sm font-semibold border border-[#d0d3c8] text-[#31572c] hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
                :disabled="registerLoading"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="registerLoading"
                class="px-8 py-3 rounded-xl text-sm font-bold bg-[#f8961e] text-white hover:bg-[#e6850b] shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all flex-1 sm:flex-none justify-center"
              >
                <span v-if="registerLoading">Saving...</span>
                <span v-else>{{ editingUser ? 'Update User' : 'Create User' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- User Info Modal -->
    <transition name="fade">
      <div v-if="showInfoModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showInfoModal = false">
        <div class="bg-white rounded-3xl max-w-md w-full max-h-[70vh] overflow-hidden shadow-2xl">
          <div class="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 class="text-xl font-bold text-slate-900">{{ selectedUser?.username }}</h3>
            <button @click="showInfoModal = false" class="text-xl hover:text-slate-500">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div><strong>Email:</strong> {{ selectedUser?.email }}</div>
            <div><strong>Saved recipes:</strong> {{ selectedUser?.savedCount }}</div>
            <div><strong>Status:</strong> 
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="selectedUser?.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">
                {{ selectedUser?.status }}
              </span>
            </div>
            <div><strong>Last activity:</strong> {{ selectedUser?.lastSaved }}</div>
            <div class="pt-4 border-t">
              <p class="text-xs text-slate-500 mb-2">Login credentials:</p>
              <div class="bg-blue-50 p-3 rounded-lg text-sm">
                <div><strong>Email:</strong> {{ selectedUser?.email }}</div>
                <div><strong>Password:</strong> <span class="font-mono bg-white px-2 py-1 rounded text-xs">(user sets own password)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const activeMenu = ref('users')
const loading = ref(false)
const favorites = ref([])

// Modal states
const showCreateModal = ref(false)
const showInfoModal = ref(false)
const editingUser = ref(null)
const selectedUser = ref(null)

const registerForm = ref({ name: '', email: '', password: '' })
const registerLoading = ref(false)
const registerError = ref('')
const createdUsers = ref([])

const adminName = ref('Admin')
const adminInitial = computed(() => adminName.value[0]?.toUpperCase() || 'A')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { key: 'recipes', label: 'Recipes', icon: 'recipes', to: '/admin/recipes' },
  { key: 'users', label: 'Users', icon: 'users', to: '/admin/users' }
]

// Users from favorites + created users
const users = computed(() => {
  const byUser = new Map()
  
  // 1. Favorites users (savedCount санау)
  for (const fav of favorites.value) {
    const key = fav.userId || 'unknown'
    if (!key || !fav.username) continue
    
    if (!byUser.has(key)) {
      byUser.set(key, {
        userId: key,
        username: fav.username,
        email: fav.email || '',
        avatarUrl: '',
        savedCount: 0,
        lastSaved: ''
      })
    }
    const u = byUser.get(key)
    u.savedCount++
    const savedAt = fav.savedAt ? new Date(fav.savedAt) : null
    if (savedAt && (!u.lastSaved || savedAt > new Date(u.lastSaved))) {
      u.lastSaved = savedAt.toLocaleDateString()
    }
  }
  
  // 2. Created users (savedCount = 0)
  for (const createdUser of createdUsers.value) {
    const key = `created_${createdUser.email}`
    if (!byUser.has(key)) {
      byUser.set(key, {
        userId: key,
        username: createdUser.name,
        email: createdUser.email,
        avatarUrl: '',
        savedCount: 0,
        lastSaved: new Date(createdUser.createdAt || Date.now()).toLocaleDateString()
      })
    }
  }
  
  return Array.from(byUser.values()).map(u => ({
    ...u,
    initial: u.username ? u.username[0].toUpperCase() : 'U',
    status: u.savedCount > 0 ? 'Active' : 'Inactive'
  }))
})

const openCreateUser = () => {
  registerForm.value = { name: '', email: '', password: '' }
  registerError.value = ''
  editingUser.value = null
  showCreateModal.value = true
}

const editUser = (user) => {
  registerForm.value = { 
    name: user.username, 
    email: user.email,
    password: ''
  }
  editingUser.value = user
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  registerForm.value = { name: '', email: '', password: '' }
}

const handleRegister = async () => {
  if (!registerForm.value.name?.trim() || !registerForm.value.email?.trim()) {
    registerError.value = 'Please fill all fields'
    return
  }

  if (!editingUser.value && registerForm.value.password.length < 6) {
    registerError.value = 'Password must be at least 6 characters'
    return
  }

  registerError.value = ''
  registerLoading.value = true

  try {
    if (editingUser.value) {
      // Update existing user in createdUsers
      const index = createdUsers.value.findIndex(u => u.email === editingUser.value.email)
      if (index !== -1) {
        createdUsers.value[index] = {
          ...createdUsers.value[index],
          name: registerForm.value.name
        }
      }
    } else {
      // Create new user
      await $fetch('https://medical-backend-54hp.onrender.com/api/auth/register', {
        method: 'POST',
        body: registerForm.value
      })

      createdUsers.value.push({
        name: registerForm.value.name,
        email: registerForm.value.email,
        createdAt: new Date().toISOString()
      })
    }

    closeCreateModal()
  } catch (error) {
    console.error('Register error:', error)
    if (error.statusCode === 409 || error.statusCode === 400) {
      registerError.value = 'This email address is already registered'
    } else {
      registerError.value = error.data?.message || 'Registration failed'
    }
  } finally {
    registerLoading.value = false
  }
}

const showUserInfo = (user) => {
  selectedUser.value = user
  showInfoModal.value = true
}

const deleteUser = (userId) => {
  if (confirm('Remove this user from list?')) {
    // Remove from favorites
    favorites.value = favorites.value.filter(f => (f.userId || f.id) !== userId)
    
    // Remove from createdUsers
    createdUsers.value = createdUsers.value.filter(u => `created_${u.email}` !== userId)
  }
}

const loadFavorites = async () => {
  loading.value = true
  try {
    const data = await $fetch(`${MOCK_API_URL}/favorites`)
    favorites.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Favorites load error:', e)
    favorites.value = []
  } finally {
    loading.value = false
  }
}

const logout = () => {
  if (typeof window !== 'undefined') localStorage.clear()
  router.push('/login')
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    adminName.value = localStorage.getItem('userName') || 'Admin'
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      router.push('/')
      return
    }
  }
  await loadFavorites()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
