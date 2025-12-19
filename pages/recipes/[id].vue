<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

    <div class="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
      <div class="flex items-center justify-between gap-4 mb-4">
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm transition-all duration-200 hover:scale-105"
        >
          <span class="text-lg">←</span>
          <span class="font-medium">Back</span>
        </button>

        <nav class="hidden sm:flex items-center gap-1 text-xs text-slate-400">
          <NuxtLink to="/" class="hover:text-slate-700">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/" class="hover:text-slate-700">Recipes</NuxtLink>
          <span>/</span>
          <span class="text-slate-600 truncate max-w-[140px]">
            {{ recipe?.title || 'Recipe' }}
          </span>
        </nav>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-8 pb-12">

      <div v-if="pending" class="py-20 text-center text-slate-500 animate-pulse">
        Loading recipe...
      </div>


      <div v-else-if="errorMessage" class="py-20 text-center text-red-500">
        {{ errorMessage }}
      </div>


      <Transition enter-active-class="animate-in slide-in-from-bottom-8 duration-700 ease-out" mode="out-in">
        <div v-if="recipe" key="content" class="space-y-16">

          <div class="lg:grid lg:grid-cols-12 lg:gap-12 items-start h-[650px]">
            

            <div class="lg:col-span-6 order-1 animate-in slide-in-from-left-8 duration-700 delay-200 h-full">
              <div class="relative w-full h-full bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  :src="recipe.imageUrl"
                  :alt="recipe.title"
                  class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>

       
            <div class="lg:col-span-6 order-2 animate-in slide-in-from-right-8 duration-700 delay-400 h-full flex flex-col justify-between py-8 lg:py-12 px-4 lg:px-0 space-y-4">
              
           
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
                  Recipe
                </p>
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-2 leading-tight">
                  {{ recipe.title }}
                </h1>
                <p class="text-lg text-slate-500">
                  {{ recipe.category }} • {{ recipe.area }}
                </p>
              </div>

   
              <div class="text-sm">
                <div class="flex items-center gap-3 mb-3 pb-2 border-b border-slate-200">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-bold text-slate-900">Instructions</h3>
                    <p class="text-xs text-slate-500 inline-block ">• Step-by-step guide</p>
                  </div>
                </div>
                
                <div class=" max-h-32 overflow-y-auto pr-3 pb-3">
                  <p class="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                    {{ recipe.instructions }}
                  </p>
                </div>
              </div>

   
              <div class="text-sm">
                <div class="flex items-center gap-3 mb-3 pb-2 border-b border-slate-200">
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-bold text-slate-900">Ingredients</h3>
                    <p class="text-xs text-slate-500">({{ recipe.ingredients?.length || 0 }} items)</p>
                  </div>
                </div>
                
  
                <div class="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-28 overflow-y-auto pr-3 pb-3">
                  <div
                    v-for="(ing, idx) in recipe.ingredients"
                    :key="idx"
                    class="flex items-start gap-2 py-1.5 px-2 bg-[#f0f9f4]/80 rounded-lg border border-[#588157]/30 hover:bg-[#588157]/10 transition-all duration-200"
                  >
                    <span class="text-slate-700 font-medium text-xs leading-tight flex-1">{{ ing }}</span>
                  </div>
                </div>
              </div>


              <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  v-if="recipe.youtubeUrl"
                  :href="recipe.youtubeUrl"
                  target="_blank"
                  rel="noopener"
                  class="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex-1"
                >
                  <span class="text-lg group-hover:rotate-12 transition-transform">▶</span>
                  <span>Watch Video</span>
                </a>

                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg  bg-[#ff9505] text-slate-700 text-sm font-semibold  shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex-1"
                  @click="goBack"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
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
    errorMessage.value = 'Recipe not found or failed to load.'
  } finally {
    pending.value = false
  }
}

const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

onMounted(fetchRecipe)
</script>
