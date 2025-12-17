<template>
  <div class="min-h-screen bg-[#f5f6f1] p-6">
    <!-- Header + Search -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-[#31572c]">Recipes</h1>
          <p class="text-slate-500 mt-1">All recipes management</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-[#588157] text-white rounded-2xl font-semibold hover:bg-[#476747] transition-all shadow-lg"
        >
          ➕ New Recipe
        </button>
      </div>

      <!-- Search -->
      <div class="relative max-w-2xl">
        <input
          v-model="searchQuery"
          @input="filterRecipes"
          placeholder="Search recipes by title, category or area..."
          class="w-full pl-12 pr-6 py-4 bg-white rounded-2xl shadow-lg border border-[#d0d3c8] text-lg focus:outline-none focus:ring-4 focus:ring-[#588157]/20 focus:border-[#588157] transition-all"
        />
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">🔍</span>
      </div>
    </div>

    <!-- Recipes Grid -->
    <div class="max-w-6xl mx-auto">
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
      </div>

      <!-- No results -->
      <div v-else-if="filteredRecipes.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-4 bg-[#588157]/10 rounded-2xl flex items-center justify-center">
          <span class="text-3xl text-[#588157]">📖</span>
        </div>
        <h3 class="text-2xl font-semibold text-[#31572c] mb-2">No recipes found</h3>
        <p class="text-slate-500 mb-6">{{ searchQuery ? 'Try different keywords' : 'No recipes yet' }}</p>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-[#588157] text-white rounded-xl font-semibold hover:bg-[#476747]"
        >
          Create first recipe
        </button>
      </div>

      <!-- Recipes List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          class="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-[#d0d3c8]/50 hover:border-[#588157]/50"
          @click="viewRecipe(recipe)"
        >
          <!-- Image -->
          <div class="h-48 bg-gradient-to-br from-[#a3b18a] to-[#588157]/20 overflow-hidden relative">
            <img
              v-if="recipe.imageUrl"
              :src="recipe.imageUrl"
              :alt="recipe.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-4xl opacity-50">📖</span>
            </div>
            
            <!-- NEW Badge -->
            <div v-if="isNewRecipe(recipe)" 
                 class="absolute top-4 left-4 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              NEW
            </div>

            <!-- Public/Private Badge -->
            <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md"
                 :class="recipe.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'">
              {{ recipe.isPublic ? 'Public' : 'Private' }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="font-bold text-xl text-[#31572c] mb-2 line-clamp-2 leading-tight">{{ recipe.title }}</h3>
            <p class="text-sm text-slate-600 mb-3 flex items-center gap-2">
              <span class="text-[#588157]">{{ recipe.area }}</span>
              <span>•</span>
              <span>{{ recipe.category }}</span>
            </p>
            
            <!-- Meta -->
            <div class="flex items-center justify-between mb-4 text-xs text-slate-500">
              <span>{{ formatDate(recipe.createdAt) }}</span>
              <span class="flex items-center gap-1">
                👤 #{{ recipe.userId?.slice(-4) }}
              </span>
            </div>

            <!-- Quick Actions -->
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                @click.stop="openEditModal(recipe)"
                class="flex-1 px-4 py-2 bg-[#588157] text-white text-xs font-semibold rounded-xl hover:bg-[#476747] transition-colors"
              >
                ✏️ Edit
              </button>
              <button
                @click.stop="deleteRecipe(recipe.id)"
                class="px-4 py-2 bg-[#bc4749] text-white text-xs font-semibold rounded-xl hover:bg-[#a33a3d] transition-colors"
              >
                🗑️ Delete
              </button>
              <button
                @click.stop="openViewModal(recipe)"
                class="w-10 h-10 bg-[#588157]/80 hover:bg-[#588157] text-white rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                title="Quick view"
              >
                👁️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW MODAL (Quick View) -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" @click.self="showViewModal = false">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-[#d0d3c8] flex justify-between items-center">
          <h2 class="text-2xl font-bold text-[#31572c]">{{ currentRecipe.title }}</h2>
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="currentRecipe.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'">
              {{ currentRecipe.isPublic ? 'Public' : 'Private' }}
            </span>
            <button @click="showViewModal = false" class="text-2xl hover:text-[#588157]">✕</button>
          </div>
        </div>
        <div class="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <img v-if="currentRecipe.imageUrl" :src="currentRecipe.imageUrl" :alt="currentRecipe.title" 
               class="w-full h-64 object-cover rounded-2xl shadow-lg"/>
          <div class="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span class="text-slate-500">Area:</span>
              <p class="font-semibold text-[#31572c] ml-2">{{ currentRecipe.area }}</p>
            </div>
            <div>
              <span class="text-slate-500">Category:</span>
              <p class="font-semibold text-[#31572c] ml-2">{{ currentRecipe.category }}</p>
            </div>
            <div>
              <span class="text-slate-500">Created:</span>
              <p class="font-semibold text-[#31572c] ml-2">{{ formatDate(currentRecipe.createdAt) }}</p>
            </div>
            <div>
              <span class="text-slate-500">Author:</span>
              <p class="font-semibold text-[#31572c] ml-2">#{{ currentRecipe.userId?.slice(-4) }}</p>
            </div>
          </div>
          <div v-if="currentRecipe.instructions">
            <h4 class="font-semibold text-lg text-[#31572c] mb-2">Instructions:</h4>
            <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ currentRecipe.instructions }}</p>
          </div>
          <div v-if="currentRecipe.youtubeUrl" class="pt-4">
            <a :href="currentRecipe.youtubeUrl" target="_blank" rel="noopener" 
               class="inline-flex items-center gap-2 px-6 py-3 bg-[#588157] text-white rounded-xl font-semibold hover:bg-[#476747] transition-all">
              🎥 Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE/EDIT MODAL -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" @click.self="closeModal">
      <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div class="px-8 py-6 border-b border-[#d0d3c8] flex justify-between items-center">
          <h2 class="text-2xl font-bold text-[#31572c]">
            {{ showCreateModal ? 'Create Recipe' : 'Edit Recipe' }}
          </h2>
          <button @click="closeModal" class="text-2xl hover:text-[#588157]">✕</button>
        </div>
        <div class="p-8 max-h-[60vh] overflow-y-auto space-y-6">
          <div>
            <label class="block text-sm font-semibold text-[#31572c] mb-2">Title</label>
            <input v-model="currentForm.title" class="w-full px-4 py-3 border border-[#d0d3c8] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#588157]" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-[#31572c] mb-2">Category</label>
              <input v-model="currentForm.category" class="w-full px-4 py-3 border border-[#d0d3c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-[#31572c] mb-2">Area</label>
              <input v-model="currentForm.area" class="w-full px-4 py-3 border border-[#d0d3c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#31572c] mb-2">Image URL</label>
            <input v-model="currentForm.imageUrl" class="w-full px-4 py-3 border border-[#d0d3c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#588157]" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#31572c] mb-2">Instructions</label>
            <textarea v-model="currentForm.instructions" rows="5" class="w-full px-4 py-3 border border-[#d0d3c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#588157] resize-vertical"></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-[#31572c] mb-2">YouTube URL</label>
            <input v-model="currentForm.youtubeUrl" class="w-full px-4 py-3 border border-[#d0d3c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#588157]" />
          </div>
          <label class="flex items-center gap-3">
            <input type="checkbox" v-model="currentForm.isPublic" class="w-5 h-5 rounded text-[#588157] focus:ring-[#588157]" />
            <span class="text-sm font-semibold text-[#31572c]">Public recipe (show on Home)</span>
          </label>
        </div>
        <div class="px-8 py-6 border-t border-[#d0d3c8] flex justify-end gap-3 bg-[#f8f9fa]">
          <button @click="closeModal" class="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button @click="saveRecipe" class="px-8 py-3 bg-[#588157] text-white rounded-xl font-semibold hover:bg-[#476747] shadow-lg transition-all">
            {{ showCreateModal ? 'Create' : 'Update' }} Recipe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// State
const recipes = ref([])
const filteredRecipes = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const currentRecipe = ref(null)

// Forms
const currentForm = ref({
  id: '',
  title: '',
  category: '',
  area: '',
  imageUrl: '',
  instructions: '',
  youtubeUrl: '',
  isPublic: true
})

const userId = computed(() => localStorage.getItem('userId') || '')

// Load recipes
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

// Search filter
const filterRecipes = () => {
  if (!searchQuery.value) {
    filteredRecipes.value = [...recipes.value]
    return
  }
  filteredRecipes.value = recipes.value.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    recipe.area.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

// Check if new recipe (7 days)
const isNewRecipe = (recipe) => {
  if (!recipe.createdAt) return false
  const createdDate = new Date(recipe.createdAt)
  const now = new Date()
  return (now - createdDate) < 7 * 24 * 60 * 60 * 1000
}

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('kk-KZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// View recipe
const viewRecipe = (recipe) => {
  currentRecipe.value = recipe
  showViewModal.value = true
}

// Quick view modal
const openViewModal = (recipe) => {
  currentRecipe.value = recipe
  showViewModal.value = true
}

// Edit modal
const openEditModal = (recipe) => {
  currentForm.value = { ...recipe }
  showEditModal.value = true
  showCreateModal.value = false
}

// Create modal
const openCreateModal = () => {
  currentForm.value = {
    title: '',
    category: '',
    area: '',
    imageUrl: '',
    instructions: '',
    youtubeUrl: '',
    isPublic: true
  }
  showCreateModal.value = true
  showEditModal.value = false
}

// Close modal
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showViewModal.value = false
}

// Save recipe
const saveRecipe = async () => {
  isLoading.value = true
  try {
    if (showCreateModal.value) {
      // Create
      const newRecipe = {
        ...currentForm.value,
        userId: userId.value,
        createdAt: new Date().toISOString()
      }
      await $fetch(`${MOCK_API_URL}/recipes`, {
        method: 'POST',
        body: newRecipe
      })
    } else {
      // Update
      await $fetch(`${MOCK_API_URL}/recipes/${currentForm.value.id}`, {
        method: 'PUT',
        body: currentForm.value
      })
    }
    await loadRecipes()
    closeModal()
  } catch (error) {
    console.error('Failed to save recipe:', error)
  } finally {
    isLoading.value = false
  }
}

// Delete recipe
const deleteRecipe = async (id) => {
  if (!confirm('Are you sure you want to delete this recipe?')) return
  
  isLoading.value = true
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${id}`, { method: 'DELETE' })
    await loadRecipes()
  } catch (error) {
    console.error('Failed to delete recipe:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
