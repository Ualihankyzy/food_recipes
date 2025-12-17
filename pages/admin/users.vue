<template>
  <div class="min-h-screen flex bg-[#f5f6f1] font-sans">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 border-r border-white/10',
        isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
      ]"
    >
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">
            Admin
          </span>
        </div>
        <button
          class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <span v-if="isSidebarOpen">⟨</span>
          <span v-else>⟩</span>
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
        <button
          class="w-full flex items-center gap-2 text-xs text-emerald-50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          @click="logout"
        >
          <span>⏻</span><span v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col bg-slate-50">
      <!-- Header recipes-тегідей, тек тексті басқа -->
      <header class="h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#31572c]">Users Management</h1>
          <div class="text-sm text-slate-500">
            Total: {{ users.length || 0 }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="w-12 h-12 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold shadow-md hover:bg-[#476747] transition-colors"
            @click="router.push('/profile')"
          >
            {{ adminInitial }}
          </button>
        </div>
      </header>

      <main class="flex-1 p-6">
        <!-- Top row: title + button -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Customers</h2>
            <p class="text-xs text-slate-500 mt-1">
              Showing {{ users.length }} customers
            </p>
          </div>

          <button
            type="button"
            @click="openCreateUser"
            class="px-4 py-2 rounded-full bg-[#7c3aed] text-white text-sm font-semibold shadow hover:bg-[#6d28d9]"
          >
            + New Customer
          </button>
        </div>

        <!-- Filters жасырылған -->
        <div class="hidden"></div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th class="w-10 px-4 py-3">
                  <input type="checkbox" class="rounded border-slate-300" />
                </th>
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
              <tr
                v-for="user in users"
                :key="user.userId"
                class="border-t border-slate-100 hover:bg-slate-50/80"
              >
                <td class="px-4 py-3">
                  <input type="checkbox" class="rounded border-slate-300" />
                </td>
                <td class="px-4 py-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                    <img
                      v-if="user.avatarUrl"
                      :src="user.avatarUrl"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-indigo-500 to-sky-400 text-white"
                    >
                      {{ user.initial }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-900 font-medium">
                  {{ user.username }}
                </td>
                <td class="px-4 py-3 text-slate-500">
                  {{ user.email || '—' }}
                </td>
                <td class="px-4 py-3 text-slate-700">
                  {{ user.savedCount }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium"
                    :class="user.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-50 text-slate-500'"
                  >
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500">
                  {{ user.lastSaved }}
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2 text-slate-400">
                    <button
                      class="p-1.5 rounded-full hover:bg-slate-100"
                      @click="openEditUser(user)"
                    >
                      🖊
                    </button>
                    <button
                      class="p-1.5 rounded-full hover:bg-slate-100"
                      @click="deleteUser(user.userId)"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!users.length && !loading">
                <td colspan="8" class="px-4 py-6 text-center text-slate-400 text-sm">
                  No users with favorites yet.
                </td>
              </tr>
            </tbody>
          </table>

          <div
            class="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-100"
          >
            <span>Showing {{ users.length }} customers</span>
            <div class="flex items-center gap-2">
              <span>25 per page</span>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- CREATE / EDIT USER MODAL (signup) -->
    <transition name="fade">
      <div
        v-if="showUserModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="closeUserModal"
      >
        <div
          class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div
            class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50"
          >
            <h3 class="text-lg font-semibold text-slate-900">
              {{ editingUser ? 'Edit User' : 'Create User' }}
            </h3>
            <button
              @click="closeUserModal"
              class="text-slate-500 hover:text-slate-900 text-xl"
            >
              ✕
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Name
              </label>
              <input
                v-model="userForm.name"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                v-model="userForm.email"
                type="email"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                v-model="userForm.password"
                type="password"
                placeholder="Set login password"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
          </div>

          <div
            class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3"
          >
            <button
              @click="closeUserModal"
              class="px-4 py-2 rounded-xl text-sm border border-slate-200 text-slate-700 hover:bg-white"
            >
              Cancel
            </button>
            <button
              @click="saveUser"
              class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747]"
            >
              Save
            </button>
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
// осында өзіңнің signup / login API базалық URL-ыңды қой

const isSidebarOpen = ref(true)
const activeMenu = ref('users')

const loading = ref(false)
const favorites = ref([])

// favorites-тен users шығарамыз
const users = computed(() => {
  const byUser = new Map()

  for (const fav of favorites.value) {
    const key = fav.userId || 'unknown'
    if (!key) continue

    if (!byUser.has(key)) {
      byUser.set(key, {
        userId: key,
        username: fav.username || 'Unknown',
        email: fav.email || '',
        avatarUrl: fav.avatarUrl || '',
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

// admin info
const adminName = ref('Admin')
const adminInitial = computed(() => adminName.value[0]?.toUpperCase() || 'A')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { key: 'recipes', label: 'Recipes', icon: 'recipes', to: '/admin/recipes' },
  { key: 'users', label: 'Users', icon: 'users', to: '/admin/users' }
]

// modal state
const showUserModal = ref(false)
const editingUser = ref(null)
const userForm = ref({
  name: '',
  email: '',
  password: ''
})

const logout = () => {
  if (typeof window !== 'undefined') localStorage.clear()
  router.push('/login')
}

const openCreateUser = () => {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: ''
  }
  showUserModal.value = true
}

const openEditUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.username,
    email: user.email,
    password: ''
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
}

// favorites жүктеу – осында сен қазір recipes-та қолданған favorites endpoint-іңді қолдан
const loadFavorites = async () => {
  loading.value = true
  try {
    const data = await $fetch(`${MOCK_API_URL}/favorites`)
    favorites.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Favorites load error', e)
    favorites.value = []
  } finally {
    loading.value = false
  }
}

// signup / update user – нақты сенің auth API-іңе сай өзгерту керек
const saveUser = async () => {
  if (!userForm.value.name || !userForm.value.email || !userForm.value.password) {
    alert('Name, email, password толтыр.')
    return
  }

  try {
    if (editingUser.value) {
      // егер backend-те user update бар болса, осында PUT/POST
      await $fetch(`/api/auth/update-user`, {
        method: 'POST',
        body: {
          userId: editingUser.value.userId,
          name: userForm.value.name,
          email: userForm.value.email,
          password: userForm.value.password
        }
      })
    } else {
      // signup: админ жаңа user тіркейді
      await $fetch(`/api/auth/register`, {
        method: 'POST',
        body: {
          name: userForm.value.name,
          email: userForm.value.email,
          password: userForm.value.password
        }
      })
    }

    // favorites қайта жүктейміз – сонда жаңа user кейін favorite жасағанда кестеде пайда болады
    await loadFavorites()
    closeUserModal()
  } catch (e) {
    console.error('User save error', e)
    alert('User save error')
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Delete this user?')) return
  try {
    // сенде нақты delete user API болса, соны қолдан
    await $fetch(`/api/auth/delete-user`, {
      method: 'POST',
      body: { userId }
    })

    // favorites ішінен де сол user-дің жазбаларын алып тастауға болады (UI үшін):
    favorites.value = favorites.value.filter(f => f.userId !== userId)
  } catch (e) {
    console.error('User delete error', e)
    alert('User delete error')
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
