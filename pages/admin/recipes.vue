<template>
  <div class="min-h-screen w-full bg-[#f5f6f1] font-sans">
    <!-- MOBILE HEADER -->
    <header class="md:hidden flex items-center justify-between px-4 h-14 bg-[#588157] text-white">
      <h1 class="text-lg font-bold">Admin</h1>
      <button class="w-9 h-9 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10" @click="isMobileMenuOpen = true">
        ☰
      </button>
    </header>

    <div class="flex flex-col md:flex-row min-h-screen">
      <!-- SIDEBAR -->
      <aside :class="['hidden md:flex h-screen sticky top-0 flex-col text-white shadow-xl transition-all duration-300', isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]']">
        <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">Admin</span>
          </div>
          <button class="text-white/80 hover:text-white" @click="isSidebarOpen = !isSidebarOpen">
            <span v-if="isSidebarOpen">⟨</span><span v-else>⟩</span>
          </button>
        </div>

        <nav class="flex-1 py-5 space-y-1 overflow-y-auto">
          <button v-for="item in menuItems" :key="item.key" @click="() => { activeMenu = item.key; item.to && router.push(item.to); }" 
                  class="relative w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors">
            <span class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200" 
                  :class="activeMenu === item.key && isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"></span>
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
            <span v-if="isSidebarOpen" class="relative z-10" :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/80'">
              {{ item.label }}
            </span>
          </button>
        </nav>

        <div class="p-4 border-t border-white/10">
          <button class="flex items-center gap-2 text-xs text-emerald-50 hover:text-white" @click="logout">
            <span>⏻</span><span v-if="isSidebarOpen">Logout</span>
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <div class="flex-1 flex flex-col bg-slate-50">
        <header class="h-16 md:h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between px-4 md:px-8">
          <h1 class="text-lg md:text-2xl font-bold text-[#31572c]">Recipes Management</h1>
          <button class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold shadow-md hover:bg-[#476747] transition-colors" @click="router.push('/profile')">
            {{ userInitial }}
          </button>
        </header>

        <main class="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">
          <!-- ✅ HEADER WITH SEARCH + FILTERS + CREATE BUTTON -->
          <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div class="flex-1">
              <div class="w-full max-w-xl flex items-center gap-3 bg-white/90 border border-slate-200 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"/>
                </svg>
                <input v-model="searchQuery" type="text" placeholder="Search Recipes..." class="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400" @input="filterRecipes"/>
              </div>
            </div>

            <!-- ✅ STATUS FILTERS -->
            <div class="flex flex-wrap gap-2 order-first lg:order-last">
              <button v-for="filter in statusFilters" :key="filter.key" @click="statusFilter = filter.key"
                      class="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1 whitespace-nowrap"
                      :class="statusFilter === filter.key ? 'bg-[#588157] text-white shadow-md' : 'bg-white/50 text-slate-700 hover:bg-white shadow-sm'">
                <span>{{ filter.icon }}</span>
                {{ filter.label }}
                <span class="font-bold">({{ filter.count }})</span>
              </button>
            </div>

            <button @click="openCreateModal" class="flex items-center justify-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 bg-[#588157] text-white rounded-2xl text-sm lg:text-base font-semibold hover:bg-[#476747] shadow-md transition-all">
              ➕ Create Recipe
            </button>
          </div>

          <!-- LOADING -->
          <div v-if="isLoading" class="flex justify-center py-16 md:py-20">
            <div class="relative w-16 h-16 md:w-20 md:h-20">
              <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#588157] animate-spin"></div>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else-if="filteredRecipes.length === 0" class="text-center py-16 md:py-20 max-w-md mx-auto">
            <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-[#588157]/10 rounded-2xl flex items-center justify-center">
              <span class="text-3xl md:text-4xl">📖</span>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-[#31572c] mb-2">{{ searchQuery ? 'No recipes found' : 'No recipes yet' }}</h3>
            <p class="text-slate-500 mb-6 text-sm md:text-base">{{ searchQuery ? 'Try different keywords' : 'Create your first recipe' }}</p>
            <button @click="openCreateModal" class="px-6 md:px-8 py-2.5 md:py-3 bg-[#588157] text-white rounded-2xl text-sm md:text-base font-bold hover:bg-[#476747] shadow-lg">
              ➕ Create Recipe
            </button>
          </div>

          <!-- ✅ RECIPES GRID -->
          <div v-else class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 mt-8 md:mt-14">
            <div v-for="recipe in filteredRecipes" :key="recipe.id" class="group relative">
              <div class="relative bg-white rounded-3xl shadow-md pt-10 pb-4 px-4 flex flex-col items-center h-full hover:shadow-xl transition-all duration-300">
                
                <!-- IMAGE -->
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]">
                  <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div v-else class="w-full h-full bg-gradient-to-br from-[#a3b18a]/30 to-[#588157]/30 flex items-center justify-center">
                    <span class="text-2xl">📖</span>
                  </div>
                </div>

                <!-- ✅ NEW BADGE -->
                <div class="absolute top-2 left-3 text-[11px] font-semibold">
                  <span v-if="isNewRecipe(recipe)" class="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-2 py-0.5 rounded-full text-xs shadow-lg">
                    NEW
                  </span>
                </div>

                <!-- ✅ STATUS BADGE -->
                <div class="absolute top-2 right-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-semibold shadow-md" :class="getStatusBadge(recipe).color">
                    {{ getStatusBadge(recipe).label }}
                  </span>
                </div>

                <!-- CONTENT -->
                <div class="mt-12 md:mt-16 w-full text-center flex flex-col gap-2 flex-1">
                  <h3 class="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{{ recipe.title }}</h3>
                  <p class="text-[11px] text-slate-400">{{ recipe.category }} • {{ recipe.area }}</p>
                  <p v-if="recipe.userId" class="text-[10px] text-slate-500">User: {{ recipe.userId.slice(-4) }}</p>
                </div>

                <!-- ✅ ACTION BUTTONS -->
                <div class="mt-6 w-full flex rounded-b-3xl overflow-hidden bg-[#588157]">
                  <!-- VIEW -->
                  <button @click="openQuickView(recipe)" class="flex-1 flex items-center justify-center py-2.5 hover:bg-[#476747] transition-colors border-r border-white/30" title="View">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>

                  <!-- ✅ VALIDATE (тек pending үшін) -->
                  <button v-if="recipe.status === 'pending'" @click="openValidationModal(recipe)" 
                          class="flex-1 flex items-center justify-center py-2.5 bg-yellow-500 hover:bg-yellow-600 transition-colors border-r border-white/30" title="Validate">
                    <span class="text-xs font-bold">⏳</span>
                  </button>

                  <!-- ✅ EDIT (✅ ТҮЗЕТІЛДІ!) -->
                  <button @click="openEditModal(recipe)" 
                          class="flex-1 flex items-center justify-center py-2.5 hover:bg-[#476747] transition-colors border-r border-white/30" 
                          title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M4 20h4.586L19.414 9.172a2 2 0 000-2.828l-2.758-2.758a2 2 0 00-2.828 0L4 14.586V20z"/>
                    </svg>
                  </button>

                  <!-- DELETE -->
                  <button @click="deleteRecipe(recipe.id)" class="flex-1 flex items-center justify-center py-2.5 hover:bg-[#a33a3d] transition-colors" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 7h12M9 7V4h6v3m-7 4v7m4-7v7m4-7v7M5 7h14l-1 14H6L5 7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 flex md:hidden">
        <div class="flex-1 bg-black/50" @click="isMobileMenuOpen = false"></div>
        <aside class="w-64 max-w-[80vw] bg-[#588157] text-white shadow-2xl h-full flex flex-col">
          <!-- Mobile menu content... -->
        </aside>
      </div>
    </transition>

    <!-- QUICK VIEW MODAL -->
    <transition name="fade">
      <div v-if="showQuickViewModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" @click.self="showQuickViewModal = false">
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div class="p-6 border-b border-[#d0d3c8] flex justify-between items-center">
            <h2 class="text-2xl font-bold text-[#31572c]">{{ quickViewRecipe?.title }}</h2>
            <button @click="showQuickViewModal = false" class="text-2xl hover:text-[#588157]">✕</button>
          </div>
          <div class="p-6 max-h-[70vh] overflow-y-auto space-y-4">
            <div class="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 mb-4">
              <img v-if="quickViewRecipe?.imageUrl" :src="quickViewRecipe.imageUrl" :alt="quickViewRecipe.title" class="w-full h-full object-cover"/>
            </div>
            <div v-if="quickViewRecipe?.instructions">
              <h3 class="text-lg font-semibold text-[#31572c] mb-2">Instructions</h3>
              <p class="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{{ quickViewRecipe.instructions }}</p>
            </div>
            <div v-if="quickViewRecipe?.youtubeUrl" class="pt-2">
              <a :href="quickViewRecipe.youtubeUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#588157] hover:bg-[#476747] text-white font-semibold text-sm transition-colors">
                Open YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- CREATE/EDIT MODAL -->
    <transition name="fade">
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeModal">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">{{ showCreateModal ? 'Create Recipe' : 'Edit Recipe' }}</h3>
            <button @click="closeModal" class="text-[#6c757d] hover:text-black text-xl">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input v-model="currentForm.title" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"/>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input v-model="currentForm.category" placeholder="e.g. Beef" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input v-model="currentForm.area" placeholder="e.g. Italian" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"/>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input v-model="currentForm.imageUrl" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"/>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea v-model="currentForm.instructions" rows="4" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">YouTube Link</label>
              <input v-model="currentForm.youtubeUrl" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"/>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button @click="closeModal" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white">Cancel</button>
            <button @click="saveRecipe" class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747]">Save</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ✅ VALIDATION MODAL -->
    <transition name="fade">
      <div v-if="showValidationModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" @click.self="showValidationModal = false">
        <div class="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">Валидация: {{ validationRecipe?.title }}</h3>
            <button @click="showValidationModal = false" class="text-[#6c757d] hover:text-black text-xl">✕</button>
          </div>
          <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
            <div class="bg-[#f8f9fa] p-4 rounded-xl">
              <p class="text-sm font-medium text-slate-900 mb-1">{{ validationRecipe?.title }}</p>
              <p class="text-xs text-slate-500">{{ validationRecipe?.area }} • {{ validationRecipe?.category }}</p>
              <p class="text-xs text-slate-600 mt-2 line-clamp-3">{{ validationRecipe?.instructions }}</p>
            </div>
            
            <div v-if="validationErrors.length" class="space-y-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <h4 class="text-sm font-semibold text-red-600">Проблемалар:</h4>
              <ul class="text-xs text-red-500 space-y-1">
                <li v-for="error in validationErrors" :key="error">• {{ error }}</li>
              </ul>
            </div>
            
            <div v-else class="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p class="text-sm text-green-700">✅ Барлық валидациядан өтті!</p>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button @click="showValidationModal = false" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white">Отмена</button>
            <button @click="rejectRecipe" class="px-5 py-2 rounded-xl text-sm bg-red-500 text-white font-semibold hover:bg-red-600">❌ Отклонить</button>
            <button @click="approveRecipe" :disabled="hasValidationErrors" 
                    class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747] disabled:opacity-50 disabled:cursor-not-allowed">
              ✅ Одобрить
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeMount, watch } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// ✅ Барлық ref-тер
const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const activeMenu = ref('recipes')
const searchQuery = ref('')
const statusFilter = ref('all')
const isLoading = ref(false)
const recipes = ref([])
const filteredRecipes = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentForm = ref({})
const showQuickViewModal = ref(false)
const quickViewRecipe = ref(null)
const showValidationModal = ref(false)
const validationRecipe = ref(null)
const validationErrors = ref([])

const userName = ref('Admin')
const userId = ref('')
const userInitial = computed(() => userName.value[0]?.toUpperCase() || 'A')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { key: 'recipes', label: 'Recipes', icon: 'recipes', to: '/admin/recipes' },
  { key: 'users', label: 'Users', icon: 'users', to: '/admin/users' }
]

const logout = () => {
  if (process.client) localStorage.clear()
  router.push('/login')
}

const initClientData = () => {
  if (process.client) {
    userName.value = localStorage.getItem('userName') || 'Admin'
    userId.value = localStorage.getItem('userId') || 'admin'
  }
}

const loadRecipes = async () => {
  isLoading.value = true
  try {
    let url = `${MOCK_API_URL}/recipes?sortBy=createdAt&order=desc`
    if (statusFilter.value !== 'all') {
      url += `&status=${statusFilter.value}`
    }
    const data = await $fetch(url)
    recipes.value = Array.isArray(data) ? data : []
    filterRecipes()
  } catch (error) {
    console.error('Failed to load recipes:', error)
    recipes.value = []
    filteredRecipes.value = []
  } finally {
    isLoading.value = false
  }
}

const filterRecipes = () => {
  let filtered = [...recipes.value]
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipe =>
      recipe.title?.toLowerCase().includes(q) ||
      recipe.category?.toLowerCase().includes(q) ||
      recipe.area?.toLowerCase().includes(q) ||
      recipe.userId?.includes(q)
    )
  }
  
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }
  
  filteredRecipes.value = filtered
}

const isNewRecipe = recipe => {
  if (!recipe?.createdAt) return false
  try {
    const created = new Date(recipe.createdAt)
    return Date.now() - created < 7 * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

// ✅ STATUS BADGE функциясы
const getStatusBadge = (recipe) => {
  if (!recipe.status) return { label: '—', color: 'bg-slate-100 text-slate-600' }
  
  const badges = {
    pending: { label: '⏳ Күтемін', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: '✅ Одобрено', color: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: '❌ Отклонено', color: 'bg-red-100 text-red-700' }
  }
  return badges[recipe.status] || { label: '—', color: 'bg-slate-100 text-slate-600' }
}

// ✅ ВАЛИДАЦИЯ CHECK
const validateRecipe = (recipe) => {
  const errors = []
  const requiredFields = ['title', 'category', 'area']
  const minLength = 3
  
  for (const field of requiredFields) {
    if (!recipe[field]?.trim() || recipe[field].trim().length < minLength) {
      errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} кемінде ${minLength} символ`)
    }
  }
  
  if (!recipe.instructions?.trim() || recipe.instructions.trim().length < 20) {
    errors.push('Инструкция кемінде 20 символ')
  }
  
  if (!recipe.ingredients?.length || recipe.ingredients.length < 3) {
    errors.push('Кемінде 3 ингредиент')
  }
  
  return errors
}

const hasValidationErrors = computed(() => validationErrors.value.length > 0)

// ✅ Валидация модалын ашу
const openValidationModal = async (recipe) => {
  validationRecipe.value = { ...recipe }
  validationErrors.value = validateRecipe(recipe)
  showValidationModal.value = true
}

// ✅ ✅ ОДОБРИТЬ
const approveRecipe = async () => {
  if (validationErrors.value.length > 0) {
    alert('Валидациядан өтпеді!')
    return
  }
  
  try {
    const approvedData = {
      ...validationRecipe.value,
      status: 'approved',
      isPublic: true,  // ✅ HOME PAGE-ГЕ ШЫҒУ
      approvedAt: new Date().toISOString()
    }
    
    await $fetch(`${MOCK_API_URL}/recipes/${approvedData.id}`, {
      method: 'PUT',
      body: approvedData
    })
    
    showValidationModal.value = false
    await loadRecipes()
    alert('✅ Рецепт одобрено! Home page-ге шықты.')
  } catch (e) {
    console.error(e)
    alert('❌ Одобрение қатесі!')
  }
}

// ✅ ❌ ОТКЛОНИТЬ (ТОЛЫҚ ӨШІРУ)
const rejectRecipe = async () => {
  if (!confirm('Рецептті толық жоюды растаңыз? (User-ден де өшіріледі)')) return
  
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${validationRecipe.value.id}`, {
      method: 'DELETE'
    })
    
    showValidationModal.value = false
    await loadRecipes()
    alert('❌ Рецепт отклонено және жойылды!')
  } catch (e) {
    console.error(e)
    alert('❌ Отклонение қатесі!')
  }
}

// ✅ MODAL функциялары
const openCreateModal = () => {
  currentForm.value = {
    title: '',
    category: '',
    area: '',
    imageUrl: '',
    instructions: '',
    ingredients: [],
    youtubeUrl: '',
    status: 'pending'
  }
  showCreateModal.value = true
  showEditModal.value = false
}

const openEditModal = recipe => {
  currentForm.value = { ...recipe }
  showEditModal.value = true
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showValidationModal.value = false
  currentForm.value = {}
}

const saveRecipe = async () => {
  if (!currentForm.value.title?.trim() || currentForm.value.title.length < 3) {
    alert('Title кемінде 3 символ!')
    return
  }
  if (!currentForm.value.instructions?.trim() || currentForm.value.instructions.length < 20) {
    alert('Instructions кемінде 20 символ!')
    return
  }

  isLoading.value = true
  try {
    if (showCreateModal.value) {
      const newRecipe = {
        ...currentForm.value,
        userId: userId.value || 'admin',
        createdAt: new Date().toISOString(),
        isPublic: currentForm.value.status === 'approved'
      }
      await $fetch(`${MOCK_API_URL}/recipes`, { method: 'POST', body: newRecipe })
    } else {
      currentForm.value.isPublic = currentForm.value.status === 'approved'
      await $fetch(`${MOCK_API_URL}/recipes/${currentForm.value.id}`, {
        method: 'PUT',
        body: currentForm.value
      })
    }
    await loadRecipes()
    closeModal()
    alert('✅ Сақталды!')
  } catch (error) {
    console.error('Save failed:', error)
    alert('❌ Қате! Қайта көріңіз.')
  } finally {
    isLoading.value = false
  }
}

const deleteRecipe = async id => {
  if (!confirm('Delete this recipe?')) return
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${id}`, { method: 'DELETE' })
    await loadRecipes()
    alert('✅ Рецепт жойылды!')
  } catch (error) {
    console.error('Delete failed:', error)
    alert('❌ Жою сәтсіз!')
  }
}

const openQuickView = recipe => {
  quickViewRecipe.value = recipe
  showQuickViewModal.value = true
}

// ✅ Watch-тар
watch([searchQuery, statusFilter], filterRecipes)

onBeforeMount(() => initClientData())
onMounted(() => {
  if (process.client) {
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      router.push('/')
      return
    }
  }
  loadRecipes()
})
</script>

<style scoped>
.line-clamp-2, .line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>