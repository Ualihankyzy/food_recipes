<template>
  <div class="min-h-screen flex bg-[#588157]">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 bg-[#588157]',
        isSidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Brand + toggle -->
      <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
        <h1 v-if="isSidebarOpen" class="text-xl font-bold tracking-wide">
          Recipes
        </h1>
        <button
          class="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <span v-if="isSidebarOpen">⟨</span>
          <span v-else>⟩</span>
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-6 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="item.type === 'route' ? router.push(item.to) : (activeTab = item.key)"
          class="relative w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors duration-200 hover:bg-white/10 rounded-lg"
        >
          <!-- Active background -->
          <span
            v-if="item.type === 'tab'"
            class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200"
            :class="activeTab === item.key && isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
          ></span>

          <!-- Icon -->
          <i
            class="relative z-10 text-lg"
            :class="activeTab === item.key ? 'text-[#31572c]' : 'text-white/90'"
          >
            {{ item.icon }}
          </i>

          <!-- Label -->
          <span
            v-if="isSidebarOpen"
            class="relative z-10"
            :class="activeTab === item.key ? 'text-[#31572c]' : 'text-white/80'"
          >
            {{ item.label }}
          </span>
        </button>
      </nav>

      <!-- Bottom user + logout -->
      <div class="p-4 border-t border-white/10 space-y-3">
        <div class="flex items-center gap-3 p-2 rounded-lg bg-white/10">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
            {{ userInitial }}
          </div>
          <div v-if="isSidebarOpen" class="text-sm leading-tight">
            <p class="font-semibold">{{ userName }}</p>
            <p class="text-xs text-white/70">Logged in</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full flex items-center gap-2 text-xs text-emerald-50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <i>⏻</i>
          <span v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN PANEL -->
    <main class="flex-1 bg-[#f5f6f1] flex flex-col">
      <!-- Top bar -->
      <header class="h-20 border-b border-[#d0d3c8] flex items-center justify-between px-8 bg-white">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#31572c]">Create New Recipe</h1>
        </div>
        <button class="flex items-center gap-3" @click="router.push('/profile')">
          <div class="w-12 h-12 rounded-full bg-[#588157] overflow-hidden shadow-md border-3 border-white flex items-center justify-center text-white font-bold text-sm">
            {{ userInitial }}
          </div>
        </button>
      </header>

      <!-- Content -->
      <section class="flex-1 p-8 overflow-y-auto">
        <!-- CREATE FORM -->
        <div class="max-w-2xl mx-auto">
          <!-- Preview Card -->
          <div class="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-[#d0d3c8]/50">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-[#31572c] mb-2">Recipe Preview</h2>
              <p class="text-slate-500">This is how your recipe will look on Home page</p>
            </div>

            <!-- Recipe Image -->
            <div class="relative mb-6">
              <div class="w-full h-64 bg-gradient-to-br from-[#a3b18a] to-[#588157]/30 rounded-2xl flex items-center justify-center overflow-hidden group">
                <img
                  v-if="form.imageUrl"
                  :src="form.imageUrl"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  :alt="form.title"
                />
                <div v-else class="text-5xl opacity-50">🍲</div>
              </div>
              
              <!-- Public Badge -->
              <div class="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
                Public
              </div>
            </div>

            <!-- Recipe Info -->
            <div class="space-y-3">
              <h3 class="text-2xl font-bold text-[#31572c] line-clamp-2">{{ form.title || 'Recipe Title' }}</h3>
              <p class="text-lg text-slate-600 flex items-center gap-2">
                <span class="text-[#588157] font-semibold">{{ form.area || 'Area' }}</span>
                <span>•</span>
                <span>{{ form.category || 'Category' }}</span>
              </p>
              
              <div v-if="form.instructions" class="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                {{ form.instructions }}
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="bg-white rounded-3xl shadow-xl p-8 border border-[#d0d3c8]/50">
            <div class="space-y-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-bold text-[#31572c] mb-3">Recipe Title</label>
                <input 
                  v-model="form.title" 
                  class="w-full px-5 py-4 border-2 border-[#d0d3c8] rounded-2xl text-xl font-semibold focus:outline-none focus:border-[#588157] focus:ring-4 focus:ring-[#588157]/20 transition-all"
                  placeholder="Enter recipe title..."
                />
              </div>

              <!-- Category & Area -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-[#31572c] mb-3">Category</label>
                  <input 
                    v-model="form.category" 
                    class="w-full px-5 py-4 border-2 border-[#d0d3c8] rounded-2xl focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20"
                    placeholder="e.g. Beef, Chicken, Dessert"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-[#31572c] mb-3">Area</label>
                  <input 
                    v-model="form.area" 
                    class="w-full px-5 py-4 border-2 border-[#d0d3c8] rounded-2xl focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20"
                    placeholder="e.g. Italian, Mexican, Kazakh"
                  />
                </div>
              </div>

              <!-- Image URL -->
              <div>
                <label class="block text-sm font-bold text-[#31572c] mb-3">Image URL</label>
                <input 
                  v-model="form.imageUrl" 
                  class="w-full px-5 py-4 border-2 border-[#d0d3c8] rounded-2xl focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20"
                  placeholder="https://example.com/recipe-image.jpg"
                />
              </div>

              <!-- Instructions -->
              <div>
                <label class="block text-sm font-bold text-[#31572c] mb-3">Instructions</label>
                <textarea 
                  v-model="form.instructions" 
                  rows="8" 
                  class="w-full px-5 py-4 border-2 border-[#d0d3c8] rounded-2xl focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 resize-vertical font-medium text-lg leading-relaxed"
                  placeholder="Step by step instructions..."
                ></textarea>
              </div>

              <!-- YouTube -->
              <div>
                <label class="block text-sm font-bold text-[#31572c] mb-3">YouTube Link (optional)</label>
                <input 
                  v-model="form.youtubeUrl" 
                  class="w-full px-5 py-4 border-2 border-[#d0d3c8] rounded-2xl focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <!-- Public Checkbox (барлығы public) -->
              <div class="flex items-center p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
                <div class="w-6 h-6 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <i class="text-white text-sm">✓</i>
                </div>
                <div>
                  <p class="font-bold text-lg text-[#31572c]">Public Recipe</p>
                  <p class="text-sm text-slate-600">This recipe will appear on Home page for everyone</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-8 border-t border-[#d0d3c8]/50 mt-8">
              <button
                @click="router.push('/recipes')"
                class="flex-1 px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
              >
                ← Back to Recipes
              </button>
              <button
                @click="createRecipe"
                :disabled="isCreating || !form.title.trim()"
                class="flex-1 px-8 py-4 bg-gradient-to-r from-[#588157] via-[#6aa56a] to-[#88c17f] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isCreating">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </span>
                <span v-else>
                  <i>✨</i>
                  Create & Publish
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// State
const isSidebarOpen = ref(true)
const activeTab = ref('create')
const userId = ref('')
const userName = ref('')
const isCreating = ref(false)

// Form - БАРЛЫҒЫ PUBLIC
const form = ref({
  title: '',
  category: '',
  area: '',
  imageUrl: '',
  instructions: '',
  youtubeUrl: '',
  isPublic: true  // ӘРҚАША ПУБЛИК
})

const userInitial = computed(() => userName.value ? userName.value[0]?.toUpperCase() : 'U')

const menuItems = [
  { key: 'home', label: 'Home', type: 'route', to: '/', icon: '🏠' },
  { key: 'recipes', label: 'Recipes', type: 'route', to: '/recipes', icon: '📖' },
  { key: 'create', label: 'Create Recipe', type: 'tab', icon: '➕' },
  { key: 'saved', label: 'Saved', type: 'route', to: '/recipes/saved', icon: '⭐' }
]

// Setup user
const setupUser = () => {
  if (process.client) {
    userId.value = localStorage.getItem('userId') || ''
    userName.value = localStorage.getItem('userName') || 'User'
  }
}

// Create recipe
const createRecipe = async () => {
  if (!form.value.title.trim() || !userId.value) {
    alert('Please enter title and login first')
    return
  }

  isCreating.value = true
  try {
    const recipe = {
      ...form.value,
      userId: userId.value,
      createdAt: new Date().toISOString(),
      isPublic: true  // МӘЖБҰРЫ ПУБЛИК
    }

    await $fetch(`${MOCK_API_URL}/recipes`, {
      method: 'POST',
      body: recipe
    })

    // Success - redirect
    router.push('/recipes')
  } catch (error) {
    console.error('Create failed:', error)
    alert('Failed to create recipe. Try again.')
  } finally {
    isCreating.value = false
  }
}

// Logout
const logout = () => {
  if (process.client) localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  setupUser()
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
  to { transform: rotate(360deg); }
}
</style>
