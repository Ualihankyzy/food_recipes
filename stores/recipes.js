// stores/recipes.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  const error = ref(null)
  
  // ✅ CLIENT-ТЕГІ API call (SSR қатесіз)
  const fetchRecipes = async () => {
    if (!import.meta.client) return // SSR-да өткізу
    
    try {
      loading.value = true
      error.value = null
      
      // MockAPI толық URL
      const data = await $fetch('https://68448e3771eb5d1be033990d.mockapi.io/api/v1/recipes')
      
      recipes.value = data.map(recipe => ({
        id: recipe.idMeal,
        title: recipe.strMeal,
        category: recipe.strCategory,
        image: recipe.strMealThumb || 'https://via.placeholder.com/300x200?text=Рецепт',
        instructions: recipe.strInstructions.slice(0, 100) + '...'
      }))
      
    } catch (err) {
      console.error('API қатесі:', err)
      error.value = 'Рецепттерді жүктеу мүмкін емес'
      recipes.value = []
    } finally {
      loading.value = false
    }
  }
  
  const searchRecipes = (query) => {
    searchQuery.value = query
  }
  
  const filteredRecipes = computed(() => {
    const allRecipes = recipes.value || []
    if (!searchQuery.value) return allRecipes
    return allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  
  // Бастапқы жүктеу (тек клиентте)
  if (import.meta.client) {
    fetchRecipes()
  }
  
  return { 
    recipes: filteredRecipes, 
    loading, 
    error,
    searchQuery, 
    searchRecipes, 
    fetchRecipes 
  }
})
