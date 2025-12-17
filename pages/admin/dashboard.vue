<template>
  <div class="min-h-screen w-full bg-[#f5f6f1] font-sans">
    <!-- TOP BAR (mobile) -->
    <header
      class="md:hidden flex items-center justify-between px-4 h-14 bg-[#588157] text-white"
    >
      <h1 class="text-lg font-bold">Admin</h1>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
        @click="isMobileMenuOpen = true"
      >
        ☰
      </button>
    </header>

    <div class="flex flex-col md:flex-row min-h-screen">
      <!-- SIDEBAR (desktop) -->
      <aside
        :class="[
          'hidden md:flex h-screen sticky top-0 flex-col text-white shadow-xl transition-all duration-300',
          isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
        ]"
      >
        <div
          class="h-20 flex items-center justify-between px-4 border-b border-white/10"
        >
          <div class="flex items-center gap-3">
            <span
              v-if="isSidebarOpen"
              class="text-lg font-semibold tracking-wide"
            >
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

        <nav class="flex-1 py-5 space-y-1 overflow-y-auto">
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
              class="relative z-10 flex-shrink-0"
              :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/90 hover:text-white'"
            >
              <svg
                v-if="item.icon === 'dashboard'"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zM3 21h8v-6H3v6z"
                />
              </svg>

              <svg
                v-else-if="item.icon === 'recipes'"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a2 2 0 012-2h9a2 2 0 012 2v13a1 1 0 01-1.447.894L12 18.618l-3.553 1.276A1 1 0 017 19V5a2 2 0 00-2-2H4z"
                />
              </svg>

              <svg
                v-else-if="item.icon === 'users'"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
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
        <header
          class="h-16 md:h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between md:justify-end px-4 md:px-8"
        >
          <h1
            class="md:hidden text-lg font-semibold text-[#31572c]"
          >
            Dashboard
          </h1>
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold text-xs md:text-sm shadow-md hover:bg-[#476747] transition-colors"
              @click="router.push('/profile')"
            >
              {{ userInitial }}
            </button>
          </div>
        </header>

        <!-- Content (сенің бар dashboard контентің өзгеріссіз) -->
        <main class="flex-1 p-4 md:p-6 overflow-y-auto">
          <!-- Loading / error -->
          <div v-if="isLoading" class="flex justify-center py-20">
            <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
          </div>

          <div
            v-else-if="error"
            class="max-w-4xl mx-auto bg-white rounded-2xl p-6 text-center"
          >
            <p class="text-red-600 font-semibold mb-2">{{ error }}</p>
            <button
              class="px-4 py-2 rounded-full bg-[#588157] text-white text-sm font-semibold hover:bg-[#476747]"
              @click="loadAll"
            >
              Retry
            </button>
          </div>

          <!-- ... мұнда сенің DASHBOARD SECTIONS кодың тұтас қалады ... -->
          <!-- BEGIN DASHBOARD -->
          <section v-else class="space-y-8">
            <!-- DETAIL VIEW -->
            <!-- (осыдан бастап төменде сенің кодыңды өзгеріссіз қалдыр) -->
            <!-- ... -->
          </section>
          <!-- END DASHBOARD -->
        </main>
      </div>
    </div>

    <!-- MOBILE DRAWER -->
    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 flex md:hidden"
      >
        <div
          class="flex-1 bg-black/50"
          @click="isMobileMenuOpen = false"
        ></div>

        <aside
          class="w-64 max-w-[80vw] bg-[#588157] text-white shadow-2xl h-full flex flex-col"
        >
          <div
            class="h-14 flex items-center justify-between px-4 border-b border-white/10"
          >
            <h2 class="text-lg font-bold">Admin</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              @click="isMobileMenuOpen = false"
            >
              ✕
            </button>
          </div>

          <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
            <button
              v-for="item in menuItems"
              :key="'mobile-' + item.key"
              @click="
                () => {
                  activeMenu = item.key
                  item.to && router.push(item.to)
                  isMobileMenuOpen = false
                }
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-white/10"
              :class="activeMenu === item.key ? 'bg-white/10 text-white' : 'text-white/80'"
            >
              <span class="flex-shrink-0">
                <svg
                  v-if="item.icon === 'dashboard'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zM3 21h8v-6H3v6z"
                  />
                </svg>
                <svg
                  v-else-if="item.icon === 'recipes'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 5a2 2 0 012-2h9a2 2 0 012 2v13a1 1 0 01-1.447.894L12 18.618l-3.553 1.276A1 1 0 017 19V5a2 2 0 00-2-2H4z"
                  />
                </svg>
                <svg
                  v-else-if="item.icon === 'users'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m18 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              </span>
              <span>{{ item.label }}</span>
            </button>
          </nav>

          <div class="p-4 border-t border-white/10">
            <button
              @click="logout"
              class="flex items-center gap-2 text-xs text-emerald-50 hover:text-white"
            >
              <span>⏻</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const activeMenu = ref('dashboard')

const adminName = 'Admin'
const userInitial = computed(() => adminName[0] || 'A')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { key: 'recipes',   label: 'Recipes',   icon: 'recipes',   to: '/admin/recipes' },
  { key: 'users',     label: 'Users',     icon: 'users',     to: '/admin/users' }
]

const logout = () => {
  if (process.client) {
    localStorage.clear()
  }
  router.push('/login')
}

// Төменде сенің бұрынғы dashboard логикаң толық сол қалпы (isLoading, error, stats, loadAll, т.б.)
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

    stats.totalRecipes = recipes.length
    stats.publicRecipes = recipes.filter(r => r.isPublic !== false).length
    stats.privateRecipes = recipes.filter(r => r.isPublic === false).length
    stats.totalSaved = favorites.length
    stats.newRecipes7d = recipes.filter(r => diffDays(r.createdAt) <= 7).length

    latestRecipes.value = [...recipes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)

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

    newRecipesList.value = recipes
      .filter(r => diffDays(r.createdAt) <= 7)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

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
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5)
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load dashboard data'
  } finally {
    isLoading.value = false
  }
}

const openSavedDetails = () => {
  if (!savedDetails.value?.length) return
  detailMode.value = 'saved'
}
const openNewRecipesDetails = () => {
  if (!newRecipesList.value?.length) return
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
