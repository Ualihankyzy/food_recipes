<template>
  <div class="min-h-screen flex bg-[#f5f6f1] font-sans">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 border-r border-white/10',
        isSidebarOpen ? 'w-64 bg-[#588157]' : 'w-20 bg-[#588157]'
      ]"
    >
      <!-- Brand + toggle -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <span v-if="isSidebarOpen" class="text-lg font-semibold tracking-wide">Recipes</span>
        </div>
        <button
          class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <span v-if="isSidebarOpen">⟨</span><span v-else>⟩</span>
        </button>
      </div>

      <!-- Menu -->
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

      <!-- User info -->
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
          <span>⏻</span><span v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col bg-slate-50">
      <!-- Top bar -->
      <header class="h-20 bg-white border-b border-[#d0d3c8] flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#31572c]">Recipes Management</h1>
          <div class="text-sm text-slate-500">
            Total: {{ filteredRecipes.length }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-[#588157] flex items-center justify-center text-white font-semibold shadow-md">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 px-8 py-8 overflow-y-auto">
        <!-- Search + Create -->
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-6 mb-8">
          <div class="flex-1">
            <div class="w-full max-w-xl flex items-center gap-3 bg-white/90 border border-slate-200 rounded-2xl px-5 py-3 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Іздеу..."
                class="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                @input="filterRecipes"
              />
            </div>
          </div>

          <button
            @click="showCreateModal = true"
            class="flex items-center gap-2 px-6 py-3 bg-[#588157] text-white rounded-2xl font-semibold hover:bg-[#476747] shadow-md transition-all"
          >
            ➕ Create Recipe
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="relative w-20 h-20">
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#588157] animate-spin"></div>
          </div>
        </div>

        <!-- No results -->
        <div v-else-if="filteredRecipes.length === 0" class="text-center py-20 max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-6 bg-[#588157]/10 rounded-2xl flex items-center justify-center">
            <span class="text-4xl">📖</span>
          </div>
          <h3 class="text-2xl font-bold text-[#31572c] mb-2">
            {{ searchQuery ? 'No recipes found' : 'No recipes yet' }}
          </h3>
          <p class="text-slate-500 mb-6">
            {{ searchQuery ? 'Try different keywords' : 'Create your first recipe' }}
          </p>
          <button
            @click="showCreateModal = true"
            class="px-8 py-3 bg-[#588157] text-white rounded-2xl font-bold hover:bg-[#476747] shadow-lg"
          >
            ➕ Create Recipe
          </button>
        </div>

        <!-- Recipes Grid -->
        <div v-else class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            class="group relative"
          >
            <div class="relative bg-white rounded-3xl shadow-md pt-10 pb-4 px-4 flex flex-col items-center">
              <!-- Round image -->
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]">
                <img
                  v-if="recipe.imageUrl"
                  :src="recipe.imageUrl"
                  :alt="recipe.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-[#a3b18a]/30 to-[#588157]/30 flex items-center justify-center"
                >
                  <span class="text-2xl">📖</span>
                </div>
              </div>

              <!-- NEW badge -->
              <div class="absolute top-2 left-3 text-[11px] font-semibold text-[#588157]">
                <span
                  v-if="isNewRecipe(recipe)"
                  class="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-2 py-0.5 rounded-full text-xs shadow-lg"
                >
                  NEW
                </span>
              </div>

              <!-- Public / Private badge (MockAPI‑ден бәрін Public ретінде көрсетеміз) -->
              <div class="absolute top-2 right-3 text-[11px] font-semibold">
                <span
                  class="px-2 py-0.5 rounded-full text-xs shadow-md bg-emerald-500 text-white"
                >
                  Public
                </span>
              </div>

              <!-- Text -->
              <div class="mt-12 w-full text-center flex flex-col gap-2">
                <h3 class="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                  {{ recipe.title }}
                </h3>
                <p class="text-[11px] text-slate-400">
                  {{ recipe.category }} • {{ recipe.area }}
                </p>
              </div>

              <!-- Bottom actions: 3 ақ иконка -->
              <div class="mt-6 w-full flex rounded-b-3xl overflow-hidden bg-[#588157]">
                <!-- View -->
                <button
                  type="button"
                  @click="openQuickView(recipe)"
                  class="flex-1 flex items-center justify-center py-2.5 hover:bg-[#476747] transition-colors border-r border-white/30"
                  title="View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                <!-- Edit (ақ “карандаш” иконка) -->
                <button
                  type="button"
                  @click.stop="openEditModal(recipe)"
                  class="flex-1 flex items-center justify-center py-2.5 hover:bg-[#476747] transition-colors border-r border-white/30"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536M4 20h4.586L19.414 9.172a2 2 0 000-2.828l-2.758-2.758a2 2 0 00-2.828 0L4 14.586V20z"
                    />
                  </svg>
                </button>

                <!-- Delete (ақ “trash” иконка) -->
                <button
                  type="button"
                  @click.stop="deleteRecipe(recipe.id)"
                  class="flex-1 flex items-center justify-center py-2.5 hover:bg-[#a33a3d] transition-colors"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 7h12M9 7V4h6v3m-7 4v7m4-7v7m4-7v7M5 7h14l-1 14H6L5 7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- QUICK VIEW MODAL -->
    <transition name="fade">
      <div
        v-if="showQuickViewModal"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
        @click.self="showQuickViewModal = false"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div class="p-6 border-b border-[#d0d3c8] flex justify-between items-center">
            <h2 class="text-2xl font-bold text-[#31572c]">
              {{ quickViewRecipe?.title }}
            </h2>
            <button @click="showQuickViewModal = false" class="text-2xl hover:text-[#588157]">
              ✕
            </button>
          </div>
          <div class="p-6 max-h-[70vh] overflow-y-auto space-y-4">
            <div class="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 mb-4">
              <img
                v-if="quickViewRecipe?.imageUrl"
                :src="quickViewRecipe.imageUrl"
                :alt="quickViewRecipe.title"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="flex flex-wrap gap-2 text-xs">
              <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                {{ quickViewRecipe?.category }}
              </span>
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                {{ quickViewRecipe?.area }}
              </span>
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                Public
              </span>
            </div>

            <div v-if="quickViewRecipe?.instructions">
              <h3 class="text-lg font-semibold text-[#31572c] mb-2">Instructions</h3>
              <p class="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {{ quickViewRecipe.instructions }}
              </p>
            </div>

            <div v-if="quickViewRecipe?.youtubeUrl" class="pt-2">
              <a
                :href="quickViewRecipe.youtubeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#588157] hover:bg-[#476747] text-white font-semibold text-sm transition-colors"
              >
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

const isSidebarOpen = ref(true)
const activeMenu = ref('recipes')
const searchQuery = ref('')
const isLoading = ref(false)
const recipes = ref([])
const filteredRecipes = ref([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentForm = ref({})

const showQuickViewModal = ref(false)
const quickViewRecipe = ref(null)

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
    const data = await $fetch(`${MOCK_API_URL}/recipes?sortBy=createdAt&order=desc`)
    // Барлық MockAPI рецептерін filtered‑ке сол күйі береміз (public фильтрсіз)
    recipes.value = data
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
  const q = searchQuery.value.toLowerCase()
  filteredRecipes.value = recipes.value.filter(recipe =>
    recipe.title?.toLowerCase().includes(q) ||
    recipe.category?.toLowerCase().includes(q) ||
    recipe.area?.toLowerCase().includes(q)
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

const openEditModal = (recipe) => {
  currentForm.value = { ...recipe }
  showEditModal.value = true
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
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
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Delete failed. Please try again.')
  }
}

const openQuickView = (recipe) => {
  quickViewRecipe.value = recipe
  showQuickViewModal.value = true
}

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
.line-clamp-2 {
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
