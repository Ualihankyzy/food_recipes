<template>
  <div class="min-h-screen flex bg-[#f5f6f1] font-sans">
    <!-- SIDEBAR (бұрынғыдай) -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 border-r border-white/10',
        isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
      ]"
    >
      <!-- Sidebar ішкі коды (бұрынғыдай) -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">Admin</span>
        </div>
        <button class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" @click="isSidebarOpen = !isSidebarOpen">
          <span v-if="isSidebarOpen">⟨</span><span v-else>⟩</span>
        </button>
      </div>

      <nav class="flex-1 py-5 space-y-1">
        <button v-for="item in menuItems" :key="item.key" @click="() => { activeMenu = item.key; item.to && router.push(item.to); }" class="relative w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200">
          <span class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200" :class="[activeMenu === item.key && isSidebarOpen ? 'translate-x-0' : '-translate-x-full']"></span>
          <span class="relative z-10 flex-shrink-0" :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/90 hover:text-white'">
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
          <span v-if="isSidebarOpen" class="relative z-10" :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/80 hover:text-white'">
            {{ item.label }}
          </span>
        </button>
      </nav>

      <div class="p-4 border-t border-white/10">
        <div v-if="isSidebarOpen" class="flex items-center gap-3 mb-3 p-2 rounded-lg bg-white/10">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">{{ adminInitial }}</div>
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

    <!-- MAIN -->
    <div class="flex-1 flex flex-col bg-slate-50">
      <!-- Header -->
      <header class="h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#31572c]">Users Management</h1>
          <div class="text-sm text-slate-500">Total: {{ users.length || 0 }}</div>
        </div>
        <div class="flex items-center gap-3">
          <button class="w-12 h-12 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold shadow-md hover:bg-[#476747] transition-colors" @click="router.push('/profile')">
            {{ adminInitial }}
          </button>
        </div>
      </header>

      <main class="flex-1 px-8 py-8 overflow-y-auto">
        <!-- Create button -->
        <div class="max-w-7xl mx-auto flex justify-between items-center mb-8">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Customers</h2>
            <p class="text-xs text-slate-500">Showing {{ users.length }} customers</p>
          </div>
          <button @click="openCreateUser" class="px-6 py-3 bg-[#588157] text-white rounded-2xl font-semibold hover:bg-[#476747] shadow-md transition-all flex items-center gap-2">
            ➕ Create User
          </button>
        </div>

        <!-- Table -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th class="w-10 px-4 py-3"><input type="checkbox" class="rounded border-slate-300" /></th>
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
                  <td class="px-4 py-3"><input type="checkbox" class="rounded border-slate-300" /></td>
                  <td class="px-4 py-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                      <div class="w-full h-full flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-indigo-500 to-sky-400 text-white">
                        {{ user.initial }}
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-slate-900 font-medium">{{ user.username }}</td>
                  <td class="px-4 py-3 text-slate-500">{{ user.email || '—' }}</td>
                  <td class="px-4 py-3 text-slate-700">{{ user.savedCount }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium" :class="user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-500">{{ user.lastSaved }}</td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button class="p-1.5 rounded-full hover:bg-slate-100 text-blue-500 hover:text-blue-600" title="View" @click="showUserInfo(user)">
                        👁️
                      </button>
                      <button class="p-1.5 rounded-full hover:bg-slate-100 text-red-500 hover:text-red-600" title="Remove from list" @click="deleteUser(user.userId)">
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!users.length && !loading">
                  <td colspan="8" class="px-4 py-6 text-center text-slate-400 text-sm">
                    No users with favorites yet. Create first user!
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-100">
              <span>Showing {{ users.length }} customers</span>
              <div>25 per page</div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- User Info Modal (тек ақпарат көрсету үшін) -->
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
            <div><strong>Status:</strong> <span class="px-2 py-1 rounded-full text-xs font-medium" :class="selectedUser?.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'">{{ selectedUser?.status }}</span></div>
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
const activeMenu = ref('users')
const loading = ref(false)
const favorites = ref([])

// 🔥 ТЕК FAVORITES-тен users шығарамыз
const users = computed(() => {
  const byUser = new Map()
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
  return Array.from(byUser.values()).map(u => ({
    ...u,
    initial: u.username ? u.username[0].toUpperCase() : 'U',
    status: u.savedCount > 0 ? 'Active' : 'Inactive'
  }))
})

const adminName = ref('Admin')
const adminInitial = computed(() => adminName.value[0]?.toUpperCase() || 'A')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { key: 'recipes', label: 'Recipes', icon: 'recipes', to: '/admin/recipes' },
  { key: 'users', label: 'Users', icon: 'users', to: '/admin/users' }
]

// 🔥 Info modal
const showInfoModal = ref(false)
const selectedUser = ref(null)

const logout = () => {
  if (typeof window !== 'undefined') localStorage.clear()
  router.push('/login')
}

// 🔥 Create User → signup бетіне redirect
const openCreateUser = () => {
  router.push({
    path: '/signup',
    query: {
      admin: 'true',
      returnUrl: '/admin/users'
    }
  })
}

// 🔥 View user info
const showUserInfo = (user) => {
  selectedUser.value = user
  showInfoModal.value = true
}

// 🔥 Delete from favorites list (тек UI-дан)
const deleteUser = (userId) => {
  if (confirm('Бұл user-ді тізімнен өшіру? (favorites-тен)')) {
    favorites.value = favorites.value.filter(f => (f.userId || f.id) !== userId)
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>
