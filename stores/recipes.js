// stores/recipes.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  
  // API-ден рецепттерді алу
  const fetchRecipes = async () => {
    try {
      loading.value = true
      const data = await $fetch('https://68448e3771eb5d1be033990d.mockapi.io/api/v1/recipes')
      recipes.value = data.map(recipe => ({
        id: recipe.idMeal,
        title: recipe.strMeal,
        category: recipe.strCategory,
        image: recipe.strMealThumb,
        instructions: recipe.strInstructions
      }))
    } catch (error) {
      console.error('Рецепттерді жүктеу қатесі:', error)
      recipes.value = []
    } finally {
      loading.value = false
    }
  }
  
  // Іздеу
  const searchRecipes = (query) => {
    searchQuery.value = query
  }
  
  // Фильтрленген рецепттер
  const filteredRecipes = computed(() => {
    if (!searchQuery.value) return recipes.value
    return recipes.value.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  
  // Бастапқы жүктеу
  fetchRecipes()
  
  return { 
    recipes: filteredRecipes, 
    loading, 
    searchRecipes, 
    searchQuery,
    fetchRecipes 
  }
})
