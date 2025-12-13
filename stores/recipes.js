// stores/recipes.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([
    { id: 1, title: 'Плов', category: 'Ет', time: '2 сағ', calories: 650 },
    { id: 2, title: 'Бешбармақ', category: 'Ет', time: '3 сағ', calories: 800 },
    { id: 3, title: 'Бауырсақ', category: 'Ұн', time: '1 сағ', calories: 350 }
  ])
  
  const searchQuery = ref('')
  
  const searchRecipes = (query) => {
    searchQuery.value = query
  }
  
  const filteredRecipes = computed(() => {
    if (!searchQuery.value) return recipes.value
    return recipes.value.filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  
  return { recipes: filteredRecipes, searchRecipes, searchQuery }
})
