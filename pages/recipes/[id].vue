<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Верх «Назад» -->
    <div class="max-w-5xl mx-auto px-4 sm:px-8 pt-6">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm mb-4"
      >
        <span>←</span>
        <span>Назад</span>
      </button>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-8 pb-12">
      <div v-if="pending" class="py-20 text-center text-slate-500">
        Loading...
      </div>

      <div v-else-if="errorMessage" class="py-20 text-center text-red-500">
        {{ errorMessage }}
      </div>

      <div v-else-if="recipe" class="bg-white rounded-3xl shadow-sm p-6 sm:p-10">
        <!-- Үлкен сурет -->
        <div class="w-full h-64 sm:h-80 bg-slate-100 rounded-2xl mb-8 overflow-hidden flex items-center justify-center">
          <img
            :src="recipe.imageUrl"
            :alt="recipe.title"
            class="max-h-full max-w-full object-contain"
          />
        </div>

        <!-- Атауы, категориясы -->
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {{ recipe.title }}
        </h1>
        <p class="text-sm text-slate-500 mb-4">
          {{ recipe.category }} • {{ recipe.area }}
        </p>

        <!-- Ингредиенттер -->
        <h2 class="text-lg font-semibold text-slate-900 mb-3">
          Ингредиенттер
        </h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-sm text-slate-700">
          <li v-for="(ing, idx) in recipe.ingredients" :key="idx">
            {{ ing }}
          </li>
        </ul>

        <!-- Инструкция -->
        <h2 class="text-lg font-semibold text-slate-900 mb-3">
          Дайындау жолы
        </h2>
        <p class="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
          {{ recipe.instructions }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'

const route = useRoute()
const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const recipe = ref(null)
const pending = ref(true)
const errorMessage = ref('')

const fetchRecipe = async () => {
  try {
    pending.value = true
    errorMessage.value = ''
    const id = route.params.id
    const data = await $fetch(`${MOCK_API_URL}/recipes/${id}`)
    recipe.value = data
  } catch (e) {
    errorMessage.value = 'Рецепт табылмады немесе жүктелмеді'
  } finally {
    pending.value = false
  }
}

const goBack = () => {
  // Егер history бар болса – алдыңғы бетке, әйтпесе home-қа
  if (window.history.length > 1) router.back()
  else router.push('/')
}

onMounted(fetchRecipe)
</script>
