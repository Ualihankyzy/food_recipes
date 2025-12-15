<template>
  <div class="min-h-screen w-full relative">
    <!-- NAVBAR -->
    <header
      class="w-full text-white flex justify-between items-center h-16 px-20 absolute top-0 left-0 z-40 mt-4"
    >
      <h1 class="text-2xl font-bold mr-20">Recipes</h1>

      <nav class="flex items-center gap-6 text-lg relative">
        <!-- Search Toggle Icon -->
        <svg
          @click="showSearch = !showSearch"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6 cursor-pointer hover:text-gray-300 transition"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
          />
        </svg>

        <!-- Animated Search Input -->
        <transition name="slide-fade">
          <input
            v-if="showSearch"
            v-model="searchQuery"
            @keyup.enter="scrollToRecipes"
            type="text"
            placeholder="Search..."
            class="absolute right-20 top-1/2 -translate-y-1/2 w-48 px-3 py-1.5
                   bg-white/90 text-black rounded-xl shadow-lg border outline-none
                   focus:ring-2 focus:ring-indigo-400 transition"
          />
        </transition>

        <!-- Auth навигация -->
        <template v-if="isAuth">
          <a href="/dashboard" class="hover:underline">Dashboard</a>
          <a href="/profile" class="hover:underline">Profile</a>
        </template>

        <template v-else>
          <a href="/login" class="hover:underline">Login</a>
          <a href="/signup" class="hover:underline">Sign In</a>
        </template>
      </nav>
    </header>

    <!-- LIGHT PNG -->
    <div class="w-full flex justify-center items-center gap-6 absolute z-20">
      <img src="../public/images/light.png" class="w-64" />
      <img src="../public/images/light.png" class="w-64" />
      <img src="../public/images/light.png" class="w-64" />
    </div>

    <!-- HERO BACKGROUND -->
    <section class="relative w-full min-h-screen flex justify-center items-center">
      <img
        src="../public/images/pexels-catscoming-1907227 3.jpg"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div class="relative z-10 text-center text-white px-4 mb-56">
        <h2 class="text-7xl handwriting">
          Simple and Tasty <br />
          Recipes
        </h2>
      </div>
    </section>

    <!-- CONTENT -->
    <div
      class="min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-6xl md:text-6xl font-black text-[#f8961e] mb-4 mt-8">
            Delicious Recipes
          </h1>
        </div>


  

        <!-- Recipes Grid -->
        <div
          ref="recipesSection"
          v-if="!pending && !errorMessage && filteredRecipes.length"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
         <button
  v-for="recipe in filteredRecipes"
  :key="recipe.id"
  @click="openModal(recipe)"
  class="bg-transparent text-left"
>
  <div
    class="relative bg-white rounded-3xl shadow-md w-full pt-10 pb-4 px-4 flex flex-col items-center"
  >
    <!-- Дөңгелек сурет (үстінде тұратын) -->
    <div
      class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]"
    >
      <img
        :src="recipe.imageUrl"
        :alt="recipe.title"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Жоғарғы сол жақта NEW / -15% сияқты бэйдж -->
    <div class="absolute top-2 left-3 text-[11px] font-semibold text-[#588157]">
      <span v-if="recipe.isNew">NEW</span>
      <span
        v-else-if="recipe.discount"
        class="text-red-500"
      >
        -{{ recipe.discount }}%
      </span>
    </div>

    <!-- Контент (атауы + баға) -->
    <div class="mt-12 w-full text-center flex flex-col gap-2">
      <h3 class="text-sm font-semibold text-slate-900 leading-snug">
        {{ recipe.title }}
      </h3>

      <p class="text-[11px] text-slate-400">
        {{ recipe.category }} • {{ recipe.area }}
      </p>

      <p
        v-if="recipe.price"
        class="text-sm font-bold text-slate-900 mt-1"
      >
        {{ recipe.price }}
      </p>
    </div>

    <!-- Төменгі толық енді жолақ -->
    <div class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden">
      <!-- Сол жақ: YouTube video -->
      <a
        v-if="recipe.youtubeUrl"
        :href="recipe.youtubeUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
        class="flex-1 flex items-center justify-center text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947] transition-colors"
      >
        YouTube video
      </a>
      <div
        v-else
        class="flex-1 bg-[#588157] opacity-60"
      ></div>

      <!-- Оң жақ: Save (тек isAuth=true болса) -->
      <button
        v-if="isAuth"
        @click.stop="toggleFavorite(recipe.id)"
        class="w-24 flex items-center justify-center text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947] border-l border-white/40 transition-colors"
      >
        {{ isFavorite(recipe.id) ? 'Saved' : 'Save' }}
      </button>
    </div>
  </div>
</button>

        </div>

        <!-- Loading -->
        <div v-if="pending" class="flex justify-center py-20">
          <div class="relative w-20 h-20">
            <div
              class="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 animate-spin"
            ></div>
            <div
              class="absolute inset-3 rounded-full border-4 border-transparent border-r-red-400 animate-spin-slow"
            ></div>
            <div
              class="absolute inset-6 rounded-full border-4 border-transparent border-b-amber-400 animate-spin-slower"
            ></div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="errorMessage" class="text-center py-16">
          <p class="text-red-500 text-xl font-semibold mb-4">
            {{ errorMessage }}
          </p>
          <button
            @click="fetchRecipes"
            class="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Retry
          </button>
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredRecipes.length" class="text-center py-16">
          <p class="text-slate-600 text-xl font-semibold mb-2">
            No recipes found
          </p>
          <button
            @click="fetchRecipes"
            class="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold"
          >
            Reload
          </button>
        </div>
      </div>

      <!-- MODAL -->
      <transition name="fade">
        <div
          v-if="selectedRecipe"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closeModal"
        >
          <div
            class="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div class="relative h-48 w-full">
              <img
                :src="selectedRecipe.imageUrl"
                :alt="selectedRecipe.title"
                class="w-full h-full object-cover"
              />
              <button
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center text-sm transition-all"
                @click="closeModal"
              >
                ✕
              </button>
              <div class="absolute bottom-3 left-3 right-3">
                <h2
                  class="text-xl font-bold text-white drop-shadow-lg line-clamp-2"
                >
                  {{ selectedRecipe.title }}
                </h2>
              </div>
            </div>

            <div class="flex-1 p-5 overflow-y-auto custom-scrollbar">
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"
                >
                  {{ selectedRecipe.category }}
                </span>
                <span
                  class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"
                >
                  {{ selectedRecipe.area }}
                </span>
              </div>

              <div class="mb-4">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">
                  Инструкция
                </h3>
                <p
                  class="text-slate-700 leading-relaxed text-sm whitespace-pre-line"
                >
                  {{ selectedRecipe.instructions }}
                </p>
              </div>

              <div class="mb-4">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">
                  Ингредиенттер
                </h3>
                <ul
                  class="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar"
                >
                  <li
                    v-for="(ingredient, index) in selectedRecipe.ingredients.slice(0, 12)"
                    :key="index"
                    class="flex justify-between bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <span class="truncate">{{ ingredient }}</span>
                  </li>
                  <li
                    v-if="selectedRecipe.ingredients.length > 12"
                    class="text-xs text-slate-500 text-center py-2"
                  >
                    +{{ selectedRecipe.ingredients.length - 12 }} тағы...
                  </li>
                </ul>
              </div>

              <div class="pt-2 sticky bottom-0 bg-white pb-2">
                <a
                  v-if="selectedRecipe.youtubeUrl"
                  :href="selectedRecipe.youtubeUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full text-center py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                >
                  YouTube-та қарау
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from '#app'

const router = useRouter()

const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// State
const recipes = ref([])
const pending = ref(true)
const errorMessage = ref(null)
const selectedRecipe = ref(null)
const showSearch = ref(false)
const searchQuery = ref('')
const recipesSection = ref(null)
const lettersOpen = ref(false)
const activeLetter = ref(null)
const userId = ref('')
const isAuth = ref(false)
const favorites = ref([])

// User
const setupUser = () => {
  if (typeof window !== 'undefined') {
    userId.value = localStorage.getItem('userId') || ''
    const token = localStorage.getItem('token')
    isAuth.value = !!userId.value || !!token
  }
}

// Recipes
const fetchRecipes = async () => {
  try {
    pending.value = true
    errorMessage.value = null
    recipes.value = await $fetch(`${MOCK_API_URL}/recipes`)
  } catch (e) {
    errorMessage.value = 'Recipes жүктелмеді'
    console.error(e)
  } finally {
    pending.value = false
  }
}

// Favorites (MockAPI)
const loadSavedRecipes = async () => {
  if (!userId.value) return
  
  try {
    // ✅ 404 болса бос массив
    let favorites = []
    try {
      favorites = await $fetch(`${MOCK_API_URL}/favorites?userId=${userId.value}`)
    } catch (e) {
      console.warn('Favorites бос:', e)
    }
    
    const recipesResponse = await $fetch(`${MOCK_API_URL}/recipes`)
    savedRecipes.value = recipesResponse.filter(r => 
      favorites.some(f => f.recipeId === r.id)
    )
  } catch (e) {
    savedRecipes.value = []
  }
}


const toggleFavorite = async (recipeId) => {
  if (!userId.value) {
    router.push('/login')
    return
  }

  try {
    const exists = favorites.value.find(f => f.recipeId === recipeId)
    
    if (exists) {
      await $fetch(`${MOCK_API_URL}/favorites/${exists.id}`, { method: 'DELETE' })
    } else {
      await $fetch(`${MOCK_API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { recipeId, userId: userId.value, savedAt: new Date().toISOString() }
      })
    }
    await loadFavorites()
  } catch (e) {
    console.error('Favorite қатесі:', e)
  }
}

const isFavorite = (recipeId) => favorites.value.some(f => f.recipeId === recipeId)

// Filters
const filteredRecipes = computed(() => {
  let result = recipes.value

  if (activeLetter.value) {
    result = result.filter(r =>
      r.title.toLowerCase().startsWith(activeLetter.value.toLowerCase())
    )
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    )
  }

  return result
})

const filterByLetter = (letter) => {
  activeLetter.value = letter
  lettersOpen.value = false
}
const clearFilter = () => activeLetter.value = null

// Modal & scroll
const openModal = recipe => selectedRecipe.value = recipe
const closeModal = () => selectedRecipe.value = null
const scrollToRecipes = () => recipesSection.value?.scrollIntoView({ behavior: 'smooth' })

// Scroll hide
const handleScroll = () => {
  if (window.scrollY < 100) showSearch.value = false
}

watch(searchQuery, () => {
  activeLetter.value = null
})

onMounted(async () => {
  setupUser()
  window.addEventListener('scroll', handleScroll)
  await fetchRecipes()
  if (userId.value) await loadFavorites()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.handwriting {
  font-family: 'Pacifico', cursive !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.animate-spin-slow {
  animation: spin 1.6s linear infinite;
}
.animate-spin-slower {
  animation: spin 2.4s linear infinite;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
