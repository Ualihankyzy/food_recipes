<template>
  <div class="min-h-screen flex bg-[#f5f6f1] font-sans">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300',
        isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
      ]"
    >
      <!-- Brand + toggle -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">
            Admin
          </span>
        </div>
        <button
          class="text-white/80 hover:text-white"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <span v-if="isSidebarOpen">⟨</span>
          <span v-else>⟩</span>
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-5 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.key"
  @click="() => { 
            activeMenu = item.key; 
            item.to && router.push(item.to); 
          }"
          class="relative w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors"
        >
          <span
            class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200"
            :class="[
              activeMenu === item.key && isSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full'
            ]"
          ></span>
          <span
            class="relative z-10 text-lg"
            :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/90'"
          >
            {{ item.icon }}
          </span>
          <span
            v-if="isSidebarOpen"
            class="relative z-10"
            :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/80'"
          >
            {{ item.label }}
          </span>
        </button>
      </nav>

      <!-- Bottom user info -->
      <div class="p-4 border-t border-white/10">
        <button
          class="flex items-center gap-2 text-xs text-emerald-50 hover:text-white"
          @click="logout"
        >
          <span>⏻</span>
          <span v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col">
      <!-- Top bar -->
      <header class="h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-end px-8">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold text-sm">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Loading / error -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
        </div>

        <div v-else-if="error" class="max-w-4xl mx-auto bg-white rounded-2xl p-6 text-center">
          <p class="text-red-600 font-semibold mb-2">{{ error }}</p>
          <button
            class="px-4 py-2 rounded-full bg-[#588157] text-white text-sm font-semibold hover:bg-[#476747]"
            @click="loadAll"
          >
            Retry
          </button>
        </div>

        <!-- DASHBOARD -->
        <section v-else class="space-y-8">
          <!-- DETAIL VIEW -->
          <section v-if="detailMode" class="mb-6">
            <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold text-[#31572c]" v-if="detailMode === 'saved'">
                  Saved activity
                </h2>
                <h2 class="text-base font-semibold text-[#31572c]" v-else-if="detailMode === 'new'">
                  New recipes (7 days)
                </h2>
                <p class="text-xs text-slate-500 mt-1">
                  Click "Back to overview" to return.
                </p>
              </div>
              <button
                class="px-3 py-1.5 rounded-full text-xs font-semibold border border-[#588157] text-[#588157] hover:bg-[#588157] hover:text-white transition"
                @click="backToOverview"
              >
                Back to overview
              </button>
            </div>

            <!-- Saved details table -->
            <div v-if="detailMode === 'saved'" class="mt-4 bg-white rounded-2xl shadow-sm p-4 overflow-x-auto">
              <table class="min-w-full text-xs">
                <thead>
                  <tr class="uppercase text-[10px] text-slate-400 border-b">
                    <th class="py-2 text-left w-1/2">User</th>
                    <th class="py-2 text-left w-1/2">Recipe saved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in savedDetails"
                    :key="row.userId + '-' + row.recipeId"
                    class="border-b last:border-b-0 hover:bg-slate-50"
                  >
                    <td class="py-2 pr-4 font-medium text-slate-800">
                      {{ row.userName }}
                      <span class="text-slate-500 text-[10px] ml-1">(#{{ row.userId }})</span>
                    </td>
                    <td class="py-2 text-slate-700">
                      {{ row.recipeTitle }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- New recipes list -->
            <div v-else-if="detailMode === 'new'" class="mt-4 bg-white rounded-2xl shadow-sm p-4">
              <ul class="divide-y divide-slate-100">
                <li v-for="r in newRecipesList" :key="r.id" class="py-2.5 flex items-center justify-between">
                  <div class="overflow-hidden">
                    <p class="text-sm font-medium text-slate-900 truncate">{{ r.title }}</p>
                    <p class="text-xs text-slate-500">{{ r.area }} • {{ r.category }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[11px] text-slate-400">{{ formatDate(r.createdAt) }}</p>
                    <p class="text-[11px] text-slate-500">User ID: {{ r.userId || '—' }}</p>
                  </div>
                </li>
              </ul>
              <p v-if="!newRecipesList.length" class="text-xs text-slate-400 mt-2">
                No new recipes in last 7 days.
              </p>
            </div>
          </section>

          <!-- Stats cards -->
          <section>
            <h2 class="text-base font-semibold text-[#31572c] mb-4">Overall statistics</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <!-- Total users -->
              <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition cursor-pointer" @click="router.push('/admin/users')">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="text-xs text-slate-500 mb-1">Total users</p>
                    <p class="text-2xl font-semibold text-slate-900">{{ stats.totalUsers }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-xl bg-[#588157]/10 flex items-center justify-center text-lg">
                    <span>👥</span>
                  </div>
                </div>
                <span class="inline-flex mt-2 self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  from activity
                </span>
              </div>

              <!-- Total recipes -->
              <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition cursor-pointer" @click="router.push('/admin/recipes')">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="text-xs text-slate-500 mb-1">Total recipes</p>
                    <p class="text-2xl font-semibold text-slate-900">{{ stats.totalRecipes }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-xl bg-[#588157]/10 flex items-center justify-center text-lg">
                    <span>📖</span>
                  </div>
                </div>
                <span class="inline-flex mt-2 self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  mockapi
                </span>
              </div>

              <!-- Public recipes -->
              <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="text-xs text-slate-500 mb-1">Public recipes</p>
                    <p class="text-2xl font-semibold text-slate-900">{{ stats.publicRecipes }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-xl bg-[#588157]/10 flex items-center justify-center text-lg">
                    <span>🌍</span>
                  </div>
                </div>
                <span class="inline-flex mt-2 self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                  visible on home
                </span>
              </div>

              <!-- Private recipes -->
              <div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="text-xs text-slate-500 mb-1">Private recipes</p>
                    <p class="text-2xl font-semibold text-slate-900">{{ stats.privateRecipes }}</p>
                  </div>
                  <div class="w-9 h-9 rounded-xl bg-[#588157]/10 flex items-center justify-center text-lg">
                    <span>🔒</span>
                  </div>
                </div>
                <span class="inline-flex mt-2 self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                  only owner
                </span>
              </div>
            </div>

            <!-- 🔥 TOTAL SAVED ONLY (Active users өшірілді) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <!-- Total saved -->
              <div
                class="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition"
                @click="openSavedDetails"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-semibold text-[#31572c]">Total saved</h3>
                  <span class="text-[11px] text-slate-400">all time</span>
                </div>
                <p class="text-3xl font-semibold text-slate-900">{{ stats.totalSaved }}</p>
              </div>

              <!-- New recipes (7 days) -->
              <div
                class="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition"
                @click="openNewRecipesDetails"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-semibold text-[#31572c]">New recipes (7 days)</h3>
                </div>
                <p class="text-2xl font-semibold text-slate-900">{{ stats.newRecipes7d }}</p>
              </div>
            </div>
          </section>

          <!-- Latest users & recipes -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Latest users -->
            <div class="bg-white rounded-2xl shadow-sm p-4">
              <h3 class="text-sm font-semibold text-[#31572c] mb-3">Latest users</h3>
              <ul v-if="latestUsers.length" class="divide-y divide-slate-100">
                <li v-for="u in latestUsers" :key="u.id" class="py-2.5 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-[#588157]/10 text-[#588157] flex items-center justify-center text-xs font-semibold">
                      {{ (u.name || 'U')[0]?.toUpperCase() }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-900">{{ u.name || 'Unknown' }}</p>
                      <p class="text-xs text-slate-500">{{ u.email }}</p>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-400">{{ formatDate(u.created_at) }}</p>
                </li>
              </ul>
              <p v-else class="text-xs text-slate-400">No user activity yet.</p>
            </div>

            <!-- Latest recipes -->
            <div class="bg-white rounded-2xl shadow-sm p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-[#31572c]">Latest recipes</h3>
              </div>
              <ul class="divide-y divide-slate-100">
                <li v-for="r in latestRecipes" :key="r.id" class="py-2.5 flex items-center justify-between">
                  <div class="overflow-hidden">
                    <p class="text-sm font-medium text-slate-900 truncate">{{ r.title }}</p>
                    <p class="text-xs text-slate-500">{{ r.area }} • {{ r.category }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="r.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ r.isPublic ? 'Public' : 'Only you' }}
                    </span>
                    <p class="text-[11px] text-slate-400">{{ formatDate(r.createdAt) }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <!-- Most saved recipes -->
          <section class="bg-white rounded-2xl shadow-sm p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-[#31572c]">Most saved recipes</h3>
            </div>
            <div v-if="mostSaved.length" class="overflow-x-auto">
              <table class="min-w-full text-xs">
                <thead>
                  <tr class="uppercase text-[10px] text-slate-400 border-b">
                    <th class="py-2 text-left">Recipe</th>
                    <th class="py-2 text-left">Saved</th>
                    <th class="py-2 text-left">Visibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in mostSaved" :key="item.id" class="border-b last:border-0">
                    <td class="py-2 pr-4 text-slate-900">{{ item.title }}</td>
                    <td class="py-2 pr-4 text-slate-800">⭐ {{ item.savedCount }}</td>
                    <td class="py-2">
                      <span
                        class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        :class="item.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                      >
                        {{ item.isPublic ? 'Public' : 'Only you' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-xs text-slate-400">No favorites yet.</p>
          </section>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const isSidebarOpen = ref(true)
const activeMenu = ref('dashboard')

const adminName = 'Admin'
const userInitial = computed(() => adminName[0])

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/admin/dashboard' },
  { key: 'recipes', label: 'Recipes', icon: '📖',  to: '/admin/recipes'  },
  { key: 'users', label: 'Users', icon: '👥',to: '/admin/users' },
  { key: 'saved', label: 'Saved', icon: '⭐' , to: '/admin/saved'}
]

const logout = () => {
  if (process.client) {
    localStorage.clear()
  }
  router.push('/login')
}

const isLoading = ref(true)
const error = ref('')

const stats = reactive({
  totalUsers: 0,
  totalRecipes: 0,
  publicRecipes: 0,
  privateRecipes: 0,
  totalSaved: 0,
  newRecipes7d: 0
})

const latestUsers = ref([])
const latestRecipes = ref([])
const mostSaved = ref([])

const detailMode = ref(null)
const savedDetails = ref([])
const newRecipesList = ref([])

const diffDays = (dateStr) => {
  if (!dateStr) return 9999
  const d = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - d) / (1000 * 60 * 60 * 24))
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

const loadAll = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const [recipesRes, favoritesRes] = await Promise.all([
      $fetch(`${MOCK_API_URL}/recipes`),
      $fetch(`${MOCK_API_URL}/favorites`).catch(() => [])
    ])

    const recipes = Array.isArray(recipesRes) ? recipesRes : []
    const favorites = Array.isArray(favoritesRes) ? favoritesRes : []

    // Stats
    stats.totalRecipes = recipes.length
    stats.publicRecipes = recipes.filter(r => r.isPublic !== false).length
    stats.privateRecipes = recipes.filter(r => r.isPublic === false).length
    stats.totalSaved = favorites.length
    stats.newRecipes7d = recipes.filter(r => diffDays(r.createdAt) <= 7).length

    // Latest recipes
    latestRecipes.value = [...recipes]
      .sort((a, b) => {
        const aD = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bD = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bD - aD
      })
      .slice(0, 5)

    // Most saved
    const savedCountMap = {}
    favorites.forEach(f => {
      if (!savedCountMap[f.recipeId]) savedCountMap[f.recipeId] = 0
      savedCountMap[f.recipeId]++
    })
    const withCounts = recipes
      .map(r => ({
        ...r,
        savedCount: savedCountMap[r.id] || 0
      }))
      .filter(r => r.savedCount > 0)
      .sort((a, b) => b.savedCount - a.savedCount)
      .slice(0, 5)
    mostSaved.value = withCounts

    // NEW RECIPES LIST
    newRecipesList.value = recipes
      .filter(r => diffDays(r.createdAt) <= 7)
      .sort((a, b) => {
        const aD = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bD = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bD - aD
      })

    // SAVED DETAILS
    savedDetails.value = favorites
      .map(f => {
        const recipe = recipes.find(r => r.id === f.recipeId)
        return {
          userId: f.userId,
          userName: f.username || `User #${f.userId?.slice(-4)}`,
          recipeId: f.recipeId,
          recipeTitle: recipe?.title || 'Unknown recipe'
        }
      })
      .sort((a, b) => (b.userName || '').localeCompare(a.userName || ''))

    // LATEST USERS
    const allUsers = new Map()
    favorites.forEach(f => {
      if (f.username) {
        allUsers.set(f.userId, {
          id: f.userId,
          name: f.username,
          email: `${f.username.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          created_at: f.savedAt || f.createdAt
        })
      }
    })
    recipes.forEach(r => {
      if (r.userId && !allUsers.has(r.userId)) {
        allUsers.set(r.userId, {
          id: r.userId,
          name: `User #${r.userId.slice(-4)}`,
          email: `user${r.userId}@example.com`,
          created_at: r.createdAt
        })
      }
    })
    stats.totalUsers = allUsers.size
    latestUsers.value = Array.from(allUsers.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)

  } catch (e) {
    console.error(e)
    error.value = 'Failed to load dashboard data'
  } finally {
    isLoading.value = false
  }
}

const openSavedDetails = () => {
  if (!savedDetails.value.length) return
  detailMode.value = 'saved'
}

const openNewRecipesDetails = () => {
  if (!newRecipesList.value.length) return
  detailMode.value = 'new'
}

const backToOverview = () => {
  detailMode.value = null
}

onMounted(async () => {
  if (process.client) {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      router.push('/')
      return
    }
  }
  await loadAll()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
