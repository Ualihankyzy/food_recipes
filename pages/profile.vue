<template>
  <div class="min-h-screen w-full relative">
    <!-- NAVBAR -->
    <header class="w-full text-white flex justify-between items-center h-16 px-20 absolute top-0 left-0 z-40 mt-4">
      <h1 class="text-2xl font-bold mr-20">Recipes</h1>

      <nav class="flex items-center gap-6 text-lg relative">
        <!-- Auth/Guest логикасы -->
        <div v-if="isAuth" class="flex items-center gap-4 ml-4">
          <a href="/dashboard" class="hover:underline">Dashboard</a>
          <a href="/profile" class="flex items-center gap-2 p-1 rounded-full hover:bg-white/20 transition">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#588157] to-[#6aa56a] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {{ userInitial }}
            </div>
          </a>
        </div>
        
        <div v-else class="flex items-center gap-4">
          <a href="/login" class="hover:underline">Login</a>
          <a href="/signup" class="hover:underline">Register</a>
        </div>
      </nav>
    </header>

    <!-- LIGHT PNG -->
    <div class="w-full flex justify-center items-center gap-6 absolute z-20">
      <img src="../public/images/light.png" class="w-64" />
      <img src="../public/images/light.png" class="w-64" />
      <img src="../public/images/light.png" class="w-64" />
    </div>

    <!-- HERO -->
    <section class="relative w-full min-h-screen flex justify-center items-center">
      <img src="../public/images/pexels-catscoming-1907227 3.jpg" class="absolute top-0 left-0 w-full h-full object-cover" />
      <div class="relative z-10 text-center text-white px-4 mb-56">
        <h2 class="text-7xl handwriting">
          Simple and Tasty <br />
          Recipes
        </h2>
      </div>
    </section>

    <!-- POPULAR RECIPES -->
    <section class="w-full bg-slate-50 py-14 px-4 sm:px-8 lg:px-20">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-semibold text-slate-900">Популярные рецепты</h3>
          <button type="button" class="text-sm text-sky-700 hover:text-sky-900 hover:underline" @click="scrollToRecipes">
            Смотреть все →
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <!-- Сол жақ: үлкен + екі кіші -->
          <div class="grid gap-4 md:col-span-2">
            <button v-if="topMeals[0]" type="button" class="relative rounded-[26px] overflow-hidden h-64 w-full group" @click="openPopularModal(topMeals[0])">
              <img :src="topMeals[0].strMealThumb" :alt="topMeals[0].strMeal" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <span class="absolute bottom-4 left-4 px-4 py-1.5 rounded-full bg-black/70 text-white text-sm font-medium flex items-center gap-2">
                {{ topMeals[0].strMeal }}
                <span class="text-base">View →</span>
              </span>
            </button>

            <div class="grid gap-4 sm:grid-cols-2">
              <button v-for="(meal, idx) in topMeals.slice(1, 3)" :key="'small-left-' + (meal?.idMeal || idx)" type="button" class="relative rounded-[22px] overflow-hidden h-44 w-full group" @click="openPopularModal(meal)">
                <img :src="meal.strMealThumb" :alt="meal.strMeal" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                <span class="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium flex items-center gap-2">
                  {{ meal.strMeal }}
                  <span class="text-sm">View →</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Оң жақ -->
          <div>
            <button v-if="topMeals[3]" type="button" class="relative rounded-[30px] overflow-hidden h-full min-h-[280px] w-full group" @click="openPopularModal(topMeals[3])">
              <img :src="topMeals[3].strMealThumb" :alt="topMeals[3].strMeal" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <span class="absolute bottom-4 left-4 px-4 py-1.5 rounded-full bg-black/70 text-white text-sm font-medium flex items-center gap-2">
                {{ topMeals[3].strMeal }}
                <span class="text-base">View →</span>
              </span>
            </button>

            <button v-if="topMeals[4]" type="button" class="relative rounded-[22px] overflow-hidden h-40 w-full mt-4 group" @click="openPopularModal(topMeals[4])">
              <img :src="topMeals[4].strMealThumb" :alt="topMeals[4].strMeal" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <span class="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium flex items-center gap-2">
                {{ topMeals[4].strMeal }}
                <span class="text-sm">View →</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 🔥 РЕЦЕПТТЕР БӨЛІМІ (PROFILE СТИЛІНДЕГІ LOADING) -->
    <div class="min-h-screen w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <!-- Search -->
      <div class="w-full ml-12 mb-10">
        <div class="w-full max-w-xl flex items-center gap-3 bg-white/90 border border-slate-200 rounded-2xl px-5 py-3 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Іздеу..." class="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400" @keyup.enter="scrollToRecipes" />
          <button type="button" class="hidden sm:inline-flex px-4 py-2 rounded-xl bg-[#588157] text-white text-xs font-semibold hover:bg-slate-800 transition" @click="scrollToRecipes">
            Search
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto mt-16">
        <!-- 🔥 PROFILE СТИЛІНДЕГІ LOADING SPINNER -->
        <div v-if="pending" class="flex flex-col items-center justify-center min-h-[500px] space-y-6">
          <div class="w-20 h-20 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin shadow-lg"></div>
          <p class="text-xl font-semibold text-[#588157] tracking-wide">Loading recipes...</p>
        </div>

        <!-- MAIN RECIPES -->
        <div v-else-if="!errorMessage && paginatedRecipes.length" ref="recipesSection" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <button v-for="recipe in paginatedRecipes" :key="recipe.id" @click="openModal(recipe)" class="bg-transparent text-left">
            <div class="relative bg-white rounded-3xl shadow-md w-full pt-10 pb-4 px-4 flex flex-col items-center">
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]">
                <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover" />
              </div>

              <div class="absolute top-2 left-3 text-[11px] font-semibold text-[#588157]">
                <span v-if="isNewRecipe(recipe)" class="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-2 py-0.5 rounded-full text-xs shadow-lg">NEW</span>
                <span v-else-if="recipe.discount" class="text-red-500">-{{ recipe.discount }}%</span>
              </div>

              <div class="mt-12 w-full text-center flex flex-col gap-2">
                <h3 class="text-sm font-semibold text-slate-900 leading-snug">{{ recipe.title }}</h3>
                <p class="text-[11px] text-slate-400">{{ recipe.category }} • {{ recipe.area }}</p>
                <p v-if="recipe.price" class="text-sm font-bold text-slate-900 mt-1">{{ recipe.price }}</p>
              </div>

              <div class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden">
                <a v-if="recipe.youtubeUrl" :href="recipe.youtubeUrl" target="_blank" rel="noopener noreferrer" @click.stop class="flex-1 flex items-center justify-center text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947] transition-colors">
                  YouTube video
                </a>
                <div v-else class="flex-1 bg-[#588157] opacity-60"></div>

                <button v-if="isAuth" @click.stop="toggleFavorite(recipe.id)" class="w-24 flex items-center justify-center text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947] border-l border-white/40 transition-colors">
                  {{ isFavorite(recipe.id) ? 'Saved' : 'Save' }}
                </button>
              </div>
            </div>
          </button>
        </div>

        <!-- ERROR -->
        <div v-else-if="errorMessage" class="text-center py-16">
          <p class="text-red-500 text-xl font-semibold mb-4">{{ errorMessage }}</p>
          <button @click="fetchRecipes" class="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold">Retry</button>
        </div>

        <!-- EMPTY -->
        <div v-else-if="!paginatedRecipes.length" class="text-center py-16">
          <p class="text-slate-600 text-xl font-semibold mb-2">No recipes found</p>
          <button @click="fetchRecipes" class="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold">Reload</button>
        </div>

        <!-- PAGINATION -->
        <div v-if="totalPages > 1" class="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-slate-700">
          <button class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            ‹ Previous
          </button>

          <div class="flex items-center gap-2">
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="w-10 h-10 rounded-full flex items-center justify-center border text-sm" :class="page === currentPage ? 'bg-amber-400 text-black border-transparent' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'">
              {{ page.toString().padStart(2, '0') }}
            </button>
          </div>

          <button class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
            Next ›
          </button>
        </div>
      </div>

      <!-- MODALS (сол күйі) -->
      <!-- Local Recipes Modal -->
      <transition name="fade">
        <div v-if="selectedRecipe" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="closeModal">
          <!-- Modal content сол күйі -->
        </div>
      </transition>

      <!-- Popular Modal -->
      <transition name="fade">
        <div v-if="popularSelected" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="popularSelected = null">
          <!-- Modal content сол күйі -->
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// User
const userName = ref('')
const userInitial = computed(() => userName.value ? userName.value[0]?.toUpperCase() : 'U')
const userId = ref('')
const isAuth = ref(false)

// State
const recipes = ref([])
const pending = ref(true)
const errorMessage = ref(null)
const selectedRecipe = ref(null)
const searchQuery = ref('')
const recipesSection = ref(null)
const favorites = ref([])

// Popular
const topMeals = ref([])
const popularSelected = ref(null)

// onMounted
onMounted(async () => {
  if (typeof window !== 'undefined') {
    userName.value = localStorage.getItem('userName') || 'User'
    userId.value = localStorage.getItem('userId') || ''
    const token = localStorage.getItem('token')
    isAuth.value = !!userId.value || !!token
  }
  
  window.addEventListener('scroll', handleScroll)
  await Promise.all([fetchRecipes(), fetchPopularMeals()])
  if (userId.value) await loadFavorites()
})

// Fetch Recipes (pending дұрыс басқарылады)
const fetchRecipes = async () => {
  try {
    pending.value = true
    errorMessage.value = null
    
    const apiRecipes = await $fetch(`${MOCK_API_URL}/recipes`)
    recipes.value = apiRecipes
      .filter(recipe => recipe.isPublic !== false)
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })
  } catch (e) {
    errorMessage.value = 'Recipes жүктелмеді'
  } finally {
    pending.value = false  // 🔥 LOADING OFF
  }
}

// Popular Meals
const fetchPopularMeals = async () => {
  try {
    const res = await $fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=g')
    topMeals.value = (res.meals || []).slice(0, 5)
  } catch (e) {
    console.error(e)
  }
}

const popularIngredients = computed(() => {
  if (!popularSelected.value) return []
  const meal = popularSelected.value
  const arr = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) {
      arr.push({ name: ing, measure: measure || '' })
    }
  }
  return arr
})

const openPopularModal = (meal) => {
  popularSelected.value = meal
}

// Favorites
const loadFavorites = async () => {
  if (!userId.value) return
  try {
    favorites.value = await $fetch(`${MOCK_API_URL}/favorites?userId=${userId.value}`)
  } catch (e) {
    favorites.value = []
  }
}

const toggleFavorite = async (recipeId) => {
  if (!userId.value) {
    router.push('/login')
    return
  }
  try {
    const exists = favorites.value.find((f) => f.recipeId === recipeId)
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

const isFavorite = (recipeId) => favorites.value.some((f) => f.recipeId === recipeId)

// Filters & Pagination
const filteredRecipes = computed(() => {
  let result = recipes.value
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

const currentPage = ref(1)
const pageSize = 8
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecipes.value.length / pageSize)))
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRecipes.value.slice(start, start + pageSize)
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  nextTick(() => {
    if (recipesSection.value) {
      recipesSection.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// Utils
const openModal = (recipe) => selectedRecipe.value = recipe
const closeModal = () => selectedRecipe.value = null
const scrollToRecipes = () => recipesSection.value?.scrollIntoView({ behavior: 'smooth' })
const handleScroll = () => {}
const isNewRecipe = (recipe) => {
  if (!recipe.createdAt) return false
  const createdDate = new Date(recipe.createdAt)
  const now = new Date()
  const diffDays = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

watch(searchQuery, () => currentPage.value = 1)
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style>
/* Барлық style сол күйі */
.handwriting { font-family: 'Pacifico', cursive !important; }
/* ... басқа стильдер ... */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
