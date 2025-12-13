<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Рецепттер Dashboard
        </h1>
        <p class="text-xl text-gray-600">{{ recipes.length }} рецепт табылды</p>
      </div>

      <!-- Search -->
      <div class="bg-white p-6 rounded-2xl shadow-xl mb-8">
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Рецепт атауын іздеңіз..."
          class="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg transition-all"
        >
      </div>

      <!-- Recipes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="recipe in recipes" 
          :key="recipe.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
        >
          <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span class="text-3xl font-bold text-white">{{ recipe.title.slice(0,1) }}</span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {{ recipe.title }}
            </h3>
            <div class="flex gap-4 text-sm text-gray-500 mb-4">
              <span>{{ recipe.category }}</span>
              <span>{{ recipe.time }}</span>
              <span>{{ recipe.calories }} кал</span>
            </div>
            <button class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
              Рецептті қарау
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const recipesStore = useRecipesStore()

// Reactive refs
const searchQuery = computed({
  get: () => recipesStore.searchQuery,
  set: (val) => recipesStore.searchQuery = val
})

// Custom debounce функциясы (useDebounceFn ЖОҚ!)
const debounceTimer = ref(null)

const handleSearch = () => {
  // Алдыңғы таймерді тазалау
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  // Жаңа таймер қою (300ms)
  debounceTimer.value = setTimeout(() => {
    recipesStore.searchRecipes(searchQuery.value)
  }, 300)
}

// Middleware үшін token (test)
if (import.meta.client) {
  const token = localStorage.getItem('token')
  if (!token) {
    navigateTo('/login')
  }
}
</script>
