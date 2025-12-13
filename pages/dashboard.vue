<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Рецепттер Dashboard
        </h1>
        <p class="text-xl text-gray-600">
          {{ loading ? 'Жүктелуде...' : `${recipes.length} рецепт табылды` }}
        </p>
      </div>

      <!-- Search -->
      <div class="bg-white p-6 rounded-2xl shadow-xl mb-8">
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          :placeholder="loading ? 'Жүктелуде...' : 'Рецепт атауын іздеңіз...'"
          class="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg transition-all"
          :disabled="loading"
        >
      </div>

      <!-- Recipes Grid -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="recipe in recipes" 
          :key="recipe.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group cursor-pointer"
          @click="navigateTo(`/recipe/${recipe.id}`)"
        >
          <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
            <img 
              v-if="recipe.image" 
              :src="recipe.image" 
              :alt="recipe.title"
              class="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
            >
            <span class="text-3xl font-bold text-white absolute z-10">
              {{ recipe.title.slice(0,1).toUpperCase() }}
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {{ recipe.title }}
            </h3>
            <div class="flex gap-4 text-sm text-gray-500 mb-4">
              <span class="px-3 py-1 bg-blue-100 rounded-full text-blue-800">{{ recipe.category }}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">{{ recipe.instructions }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl shadow-lg animate-pulse">
          <div class="h-48 bg-gray-200 rounded-t-2xl"></div>
          <div class="p-6 space-y-3">
            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const recipesStore = useRecipesStore()

// Reactive мәліметтер
const { recipes, loading, searchQuery, searchRecipes } = recipesStore

// Custom debounce
const debounceTimer = ref(null)

const handleSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  debounceTimer.value = setTimeout(() => {
    searchRecipes(searchQuery.value)
  }, 300)
}
</script>

