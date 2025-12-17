<template>
  <div class="min-h-screen flex bg-[#f5f6f1] font-sans">
    <!-- SIDEBAR (Dashboard сияқты) -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 border-r border-white/10',
        isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
      ]"
    >
      <!-- Brand + toggle -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">
            Recipes
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

      <!-- Menu -->
      <nav class="flex-1 py-5 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="() => { 
            activeMenu = item.key; 
            item.to && router.push(item.to); 
          }"
          class="relative w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200"
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
            class="relative z-10 text-lg flex-shrink-0"
            :class="activeMenu === item.key ? 'text-[#31572c]' : 'text-white/90 hover:text-white'"
          >
            {{ item.icon }}
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

      <!-- Bottom user info -->
      <div class="p-4 border-t border-white/10">
        <div v-if="isSidebarOpen" class="flex items-center gap-3 mb-3 p-2 rounded-lg bg-white/10">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
            {{ userInitial }}
          </div>
          <div>
            <p class="font-semibold text-sm">{{ userName }}</p>
            <p class="text-xs text-emerald-100/80">Admin</p>
          </div>
        </div>
        <button
          class="w-full flex items-center gap-2 text-xs text-emerald-50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
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
      <header class="h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#31572c]">Recipes Management</h1>
          <div class="flex items-center gap-3">
            <div class="text-sm text-slate-500">
              Total: {{ filteredRecipes.length }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="showCreateModal = true"
            class="flex items-center gap-2 px-6 py-2.5 bg-[#588157] text-white rounded-xl font-semibold hover:bg-[#476747] shadow-md transition-all"
          >
            ➕ Create Recipe
          </button>
          <div class="w-12 h-12 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold shadow-md">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <!-- Search -->
        <div class="max-w-2xl mb-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="filterRecipes"
              placeholder="Search by title, category, area..."
              class="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-lg border-2 border-[#d0d3c8] text-lg focus:outline-none focus:border-[#588157] focus:ring-4 focus:ring-[#588157]/20 transition-all"
            />
            <span class="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-slate-400">🔍</span>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
        </div>

        <!-- No results -->
        <div v-else-if="filteredRecipes.length === 0" class="text-center py-20 max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-6 bg-[#588157]/10 rounded-2xl flex items-center justify-center">
            <span class="text-4xl">book-open</span>
          </div>
          <h3 class="text-2xl font-bold text-[#31572c] mb-2">{{ searchQuery ? 'No recipes found' : 'No recipes yet' }}</h3>
          <p class="text-slate-500 mb-6">{{ searchQuery ? 'Try different keywords' : 'Create your first recipe' }}</p>
          <button
            @click="showCreateModal = true"
            class="px-8 py-3 bg-[#588157] text-white rounded-2xl font-bold hover:bg-[#476747] shadow-lg"
          >
            ➕ Create Recipe
          </button>
        </div>

        <!-- Recipes Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-[#d0d3c8]/50 hover:border-[#588157]/50"
          >
            <!-- Image + Quick View -->
            <div class="h-48 relative overflow-hidden bg-gradient-to-br from-[#a3b18a]/50 to-[#588157]/20">
              <img
                v-if="recipe.imageUrl"
                :src="recipe.imageUrl"
                :alt="recipe.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#a3b18a]/30 to-[#588157]/30">
                <span class="text-4xl opacity-70">book-open</span>
              </div>

              <!-- NEW Badge -->
              <div v-if="isNewRecipe(recipe)" 
                   class="absolute top-4 left-4 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                NEW
              </div>

              <!-- Public/Private Badge -->
              <div class="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md"
                   :class="recipe.isPublic ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'">
                {{ recipe.isPublic ? 'Public' : 'Private' }}
              </div>

              <!-- Quick View Button (КӨЗ ІКОНКАСЫ) -->
              <button
                @click.stop="openQuickView(recipe)"
                class="absolute bottom-3 right-3 w-12 h-12 bg-white/90 hover:bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#588157] text-xl transition-all group-hover:scale-110"
                title="Quick view"
              >
                👁
              </button>
            </div>

            <!-- Content -->
            <div class="p-6" :class="{ 'border-t border-[#d0d3c8]/50': !expandedRecipe || expandedRecipe.id !== recipe.id }">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-bold text-xl text-[#31572c] line-clamp-2 leading-tight group-hover:line-clamp-none">
                    {{ recipe.title }}
                  </h3>
                  <p class="text-sm text-slate-600 mt-1 flex items-center gap-2">
                    <span class="text-[#588157] font-semibold">{{ recipe.area }}</span>
                    <span>•</span>
                    <span>{{ recipe.category }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                  <button
                    @click.stop="toggleExpand(recipe)"
                    class="w-10 h-10 bg-[#588157]/80 hover:bg-[#588157] text-white rounded-xl flex items-center justify-center transition-all"
                    title="Expand"
                  >
                    {{ expandedRecipe?.id === recipe.id ? '✕' : '📄' }}
                  </button>
                </div>
              </div>

              <!-- Meta -->
              <div class="flex items-center justify-between mb-4 text-xs text-slate-500">
                <span>{{ formatDate(recipe.createdAt) }}</span>
                <span>#{{ recipe.userId?.slice(-4) || '—' }}</span>
              </div>

              <!-- Actions -->
              <div v-if="expandedRecipe?.id !== recipe.id" class="flex items-center gap-2">
                <button
                  @click.stop="openEditModal(recipe)"
                  class="flex-1 px-4 py-2.5 bg-[#588157] text-white text-sm font-semibold rounded-xl hover:bg-[#476747] transition-colors"
                >
                  Edit
                </button>
                <button
                  @click.stop="deleteRecipe(recipe.id)"
                  class="px-4 py-2.5 bg-[#bc4749] text-white text-sm font-semibold rounded-xl hover:bg-[#a33a3d] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- EXPANDED DETAIL VIEW -->
            <div v-if="expandedRecipe?.id === recipe.id" class="border-t border-[#d0d3c8]/50 bg-slate-50">
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span class="text-slate-500 font-medium">Area:</span>
                    <p class="font-semibold text-[#31572c] ml-2">{{ recipe.area }}</p>
                  </div>
                  <div>
                    <span class="text-slate-500 font-medium">Category:</span>
                    <p class="font-semibold text-[#31572c] ml-2">{{ recipe.category }}</p>
                  </div>
                  <div>
                    <span class="text-slate-500 font-medium">Created:</span>
                    <p class="font-semibold text-[#31572c] ml-2">{{ formatDate(recipe.createdAt) }}</p>
                  </div>
                  <div>
                    <span class="text-slate-500 font-medium">Author:</span>
                    <p class="font-semibold text-[#31572c] ml-2">#{{ recipe.userId?.slice(-4) }}</p>
                  </div>
                </div>

                <div v-if="recipe.instructions" class="space-y-3">
                  <h4 class="font-semibold text-lg text-[#31572c]">Instructions</h4>
                  <div class="bg-white p-4 rounded-xl border border-[#d0d3c8]/30">
                    <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ recipe.instructions }}</p>
                  </div>
                </div>

                <div v-if="recipe.youtubeUrl" class="pt-2">
                  <a :href="recipe.youtubeUrl" target="_blank" rel="noopener" 
                     class="inline-flex items-center gap-2 px-6 py-3 bg-[#588157] text-white rounded-xl font-semibold hover:bg-[#476747] shadow-md transition-all">
                    Watch on YouTube
                  </a>
                </div>

                <div class="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    @click.stop="openEditModal(recipe)"
                    class="flex-1 px-6 py-3 bg-[#588157] text-white font-semibold rounded-xl hover:bg-[#476747]"
                  >
                    Edit Recipe
                  </button>
                  <button
                    @click.stop="deleteRecipe(recipe.id)"
                    class="px-6 py-3 bg-[#bc4749] text-white font-semibold rounded-xl hover:bg-[#a33a3d]"
                  >
                    Delete
                  </button>
                  <button
                    @click.stop="toggleExpand(recipe)"
                    class="px-6 py-3 bg-slate-500 text-white font-semibold rounded-xl hover:bg-slate-600"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- QUICK VIEW MODAL -->
    <div v-if="showQuickViewModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" @click.self="showQuickViewModal = false">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div class="p-8 border-b border-[#d0d3c8] flex justify-between items-center">
          <h2 class="text-3xl font-bold text-[#31572c]">{{ quickViewRecipe?.title }}</h2>
          <button @click="showQuickViewModal = false" class="text-3xl hover:text-[#588157]">✕</button>
        </div>
        <div class="p-8 max-h-[70vh] overflow-y-auto">
          <img v-if="quickViewRecipe?.imageUrl" :src="quickViewRecipe.imageUrl" class="w-full h-80 object-cover rounded-2xl shadow-xl mb-6" />
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <span class="text-slate-500 block mb-1">Area</span>
              <p class="text-2xl font-bold text-[#31572c]">{{ quickViewRecipe?.area }}</p>
            </div>
            <div>
              <span class="text-slate-500 block mb-1">Category</span>
              <p class="text-2xl font-bold text-[#31572c]">{{ quickViewRecipe?.category }}</p>
            </div>
          </div>
          <div v-if="quickViewRecipe?.instructions" class="mb-6">
            <h4 class="text-xl font-bold text-[#31572c] mb-4">Instructions</h4>
            <div class="bg-slate-50 p-6 rounded-2xl border-l-4 border-[#588157]">
              <p class="text-lg text-slate-700 leading-relaxed">{{ quickViewRecipe.instructions }}</p>
            </div>
          </div>
          <div v-if="quickViewRecipe?.youtubeUrl" class="text-center">
            <a :href="quickViewRecipe.youtubeUrl" target="_blank" class="inline-flex items-center gap-3 px-8 py-4 bg-[#588157] text-white rounded-2xl font-bold text-lg hover:bg-[#476747] shadow-xl">
              Watch Video
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ДҰРЫС CREATE/EDIT MODAL (кішігірім стиль) -->
    <transition name="fade">
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeModal">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">
              {{ showCreateModal ? 'Create Recipe' : 'Edit Recipe' }}
            </h3>
            <button @click="closeModal" class="text-[#6c7570] hover:text-black text-xl">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input v-model="currentForm.title" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input v-model="currentForm.category" placeholder="e.g. Beef" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input v-model="currentForm.area" placeholder="e.g. Italian" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input v-model="currentForm.imageUrl" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea v-model="currentForm.instructions" rows="4" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">YouTube Link</label>
              <input v-model="currentForm.youtubeUrl" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div class="flex items-center gap-3 pt-2">
              <label class="text-xs font-semibold text-[#31572c] flex items-center gap-2">
                <input type="checkbox" v-model="currentForm.isPublic" class="w-4 h-4 rounded"/>
                <span>Public (show on Home)</span>
              </label>
              <span class="text-xs text-[#6c7570]">(Only You = private)</span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button @click="closeModal" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white">Cancel</button>
            <button @click="saveRecipe" class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747]">Save</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// State
const isSidebarOpen = ref(true)
const activeMenu = ref('recipes')
const searchQuery = ref('')
const isLoading = ref(false)
const recipes = ref([])
const filteredRecipes = ref([])
const expandedRecipe = ref(null)
const showQuickViewModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const quickViewRecipe = ref(null)
const currentForm = ref({})

// User
const userName = ref('Admin')
const userId = ref('')
const userInitial = computed(() => userName.value[0]?.toUpperCase() || 'A')

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠', to: '/admin/dashboard' },
  { key: 'recipes', label: 'Recipes', icon: '📖', to: '/admin/recipes' },
  { key: 'users', label: 'Users', icon: '👥', to: '/admin/users' },
  { key: 'saved', label: 'Saved', icon: '⭐', to: '/admin/saved' }
]

const logout = () => {
  if (process.client) {
    localStorage.clear()
  }
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
    recipes.value = await $fetch(`${MOCK_API_URL}/recipes?sortBy=createdAt&order=desc`)
    filteredRecipes.value = [...recipes.value]
  } catch (error) {
    console.error('Failed to load recipes:', error)
    recipes.value = []
    filteredRecipes.value = []
  } finally {
    isLoading.value = false
  }
}

const filterRecipes = () => {
  if (!searchQuery.value.trim()) {
    filteredRecipes.value = [...recipes.value]
    return
  }
  const query = searchQuery.value.toLowerCase()
  filteredRecipes.value = recipes.value.filter(recipe =>
    recipe.title?.toLowerCase().includes(query) ||
    recipe.category?.toLowerCase().includes(query) ||
    recipe.area?.toLowerCase().includes(query)
  )
}

const isNewRecipe = (recipe) => {
  if (!recipe?.createdAt) return false
  try {
    const created = new Date(recipe.createdAt)
    return (Date.now() - created) < 7 * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '—'
  }
}

const toggleExpand = (recipe) => {
  expandedRecipe.value = expandedRecipe.value?.id === recipe.id ? null : recipe
}

const openQuickView = (recipe) => {
  quickViewRecipe.value = recipe
  showQuickViewModal.value = true
}

const openEditModal = (recipe) => {
  currentForm.value = { ...recipe }
  showEditModal.value = true
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showQuickViewModal.value = false
  currentForm.value = {}
}

const saveRecipe = async () => {
  isLoading.value = true
  try {
    const clientUserId = process.client ? (localStorage.getItem('userId') || 'admin') : userId.value
    
    if (showCreateModal.value) {
      const newRecipe = {
        ...currentForm.value,
        userId: clientUserId,
        createdAt: new Date().toISOString()
      }
      await $fetch(`${MOCK_API_URL}/recipes`, { method: 'POST', body: newRecipe })
    } else {
      await $fetch(`${MOCK_API_URL}/recipes/${currentForm.value.id}`, { 
        method: 'PUT', 
        body: currentForm.value 
      })
    }
    await loadRecipes()
    closeModal()
  } catch (error) {
    console.error('Save failed:', error)
    alert('Save failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const deleteRecipe = async (id) => {
  if (!confirm('Delete this recipe?')) return
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${id}`, { method: 'DELETE' })
    await loadRecipes()
    if (expandedRecipe.value?.id === id) {
      expandedRecipe.value = null
    }
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Delete failed. Please try again.')
  }
}

onBeforeMount(() => {
  initClientData()
})

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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
