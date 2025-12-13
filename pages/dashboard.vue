<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Рецепттер Dashboard
        </h1>
        <p v-if="loading" class="text-xl text-blue-600">Жүктелуде...</p>
        <p v-else-if="error" class="text-xl text-red-600">{{ error }}</p>
        <p v-else class="text-xl text-gray-600">
          {{ recipes.length }} рецепт табылды
        </p>
      </div>

      <!-- Search + Refresh -->
      <div class="bg-white p-6 rounded-2xl shadow-xl mb-8 flex gap-4">
        <input 
          v-model="searchQuery"
          @input="handleSearch"
          :placeholder="loading ? 'Жүктелуде...' : 'Рецепт іздеу...'"
          class="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
          :disabled="loading"
        >
        <button 
          @click="recipesStore.fetchRecipes"
          :disabled="loading"
          class="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {{ loading ? '...' : 'Жаңарту' }}
        </button>
      </div>

      <!-- Recipes -->
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="recipe in recipes" 
          :key="recipe.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
        >
          <img 
            :src="recipe.image" 
            :alt="recipe.title"
            class="w-full h-48 object-cover"
            @error="() => recipe.image = 'https://via.placeholder.com/300x200?text=Фото+жоқ'"
          >
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{{ recipe.title }}</h3>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mb-3 inline-block">
              {{ recipe.category }}
            </span>
            <p class="text-gray-600 text-sm line-clamp-3">{{ recipe.instructions }}</p>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-2xl text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="recipesStore.fetchRecipes"
          class="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700"
        >
          Қайталап көру
        </button>
      </div>

      <!-- Loading Skeleton -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 9" :key="n" class="bg-white rounded-2xl shadow-lg animate-pulse">
          <div class="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-2xl"></div>
          <div class="p-6 space-y-4">
            <div class="h-6 bg-gray-200 rounded w-4/5"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const recipesStore = useRecipesStore()
const { recipes, loading, error, searchQuery, searchRecipes } = recipesStore

// Debounce search
let debounceTimer = null
const handleSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchRecipes(searchQuery.value)
  }, 400)
}
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
</style>


