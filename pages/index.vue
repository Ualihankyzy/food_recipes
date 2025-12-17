<template>
  <div class="min-h-screen w-full relative">
   <header 
  class="w-full text-white flex items-center justify-between h-16 px-4 sm:px-8 lg:px-20 absolute top-0 left-0 z-40 mt-4"
>

  <h1 class="text-lg sm:text-2xl font-bold mr-4 sm:mr-20">
    Recipes
  </h1>

  <nav class="flex items-center gap-3 sm:gap-6 text-sm sm:text-lg relative">

    <div
      v-if="isAuth"
      class="flex items-center gap-2 sm:gap-4 ml-1 sm:ml-4"
    >
      <a
        :href="isAdmin ? '/admin/dashboard' : '/dashboard'"
        class=" xs:inline-block sm:inline-block hover:underline font-semibold text-sm sm:text-lg"
      >
        {{ isAdmin ? 'Admin Panel' : 'Dashboard' }}
      </a>

      <button
        @click="router.push('/profile')"
        class="flex items-center gap-2 p-1 rounded-full hover:bg-white/20 transition"
      >
        <div
          class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#588157] to-[#6aa56a] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md"
        >
          {{ userInitial }}
        </div>
      </button>
    </div>


    <div
      v-else
      class="flex flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-6 text-xs sm:text-2xl font-semibold"
    >
      <a href="/login" class="hover:underline">Login</a>
      <a href="/signup" class="hover:underline">Register</a>
    </div>
  </nav>
</header>


 <div
  class="w-full flex justify-center items-center gap-6 absolute top-0 left-0 z-20  sm:mt-0"
>
  <img src="../public/images/light.png" class="w-56 sm:w-64" />
  <img src="../public/images/light.png" class="w-64 hidden sm:block" />
  <img src="../public/images/light.png" class="w-64 hidden sm:block" />
</div>


<section class="relative w-full h-[60vh] md:h-screen flex justify-center items-center overflow-hidden">
  <img
    src="../public/images/pexels-catscoming-1907227 3.jpg"
    class="absolute inset-0 w-full h-full object-contain bg-black"
  />
  <div class="relative z-10 text-center text-white px-4 mb-36 md:mb-56">
    <h2 class="text-3xl md:text-7xl handwriting leading-tight">
      Simple and Tasty <br />
      Recipes
    </h2>
  </div>
</section>




    <section class="w-full bg-slate-50 py-10 sm:py-14 px-4 sm:px-8 lg:px-20">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl sm:text-2xl font-semibold text-slate-900">
           Popular Recipes
          </h3>
          <button
            type="button"
            class="text-xs sm:text-sm text-sky-700 hover:text-sky-900 hover:underline"
            @click="scrollToRecipes"
          >
            
See all →
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="grid gap-4 md:col-span-2">
            <button
              v-if="topMeals[0]"
              type="button"
              class="relative rounded-[20px] sm:rounded-[26px] overflow-hidden h-52 sm:h-64 w-full group"
              @click="openPopularModal(topMeals[0])"
            >
              <img
                :src="topMeals[0].strMealThumb"
                :alt="topMeals[0].strMeal"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              ></div>
              <span
                class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-3 sm:px-4 py-1.5 rounded-full bg-black/70 text-white text-xs sm:text-sm font-medium flex items-center gap-2"
              >
                {{ topMeals[0].strMeal }}
                <span class="text-sm sm:text-base">View →</span>
              </span>
            </button>

            <div class="grid gap-4 sm:grid-cols-2">
              <button
                v-for="(meal, idx) in topMeals.slice(1, 3)"
                :key="'small-left-' + (meal?.idMeal || idx)"
                type="button"
                class="relative rounded-[18px] sm:rounded-[22px] overflow-hidden h-40 sm:h-44 w-full group"
                @click="openPopularModal(meal)"
              >
                <img
                  :src="meal.strMealThumb"
                  :alt="meal.strMeal"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                ></div>
                <span
                  class="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 sm:px-3 py-1.5 rounded-full bg-black/70 text-white text-[10px] sm:text-xs font-medium flex items-center gap-2"
                >
                  {{ meal.strMeal }}
                  <span class="text-xs sm:text-sm">View →</span>
                </span>
              </button>
            </div>
          </div>

          <div>
            <button
              v-if="topMeals[3]"
              type="button"
              class="relative rounded-[22px] sm:rounded-[30px] overflow-hidden h-52 sm:h-full min-h-[220px] sm:min-h-[280px] w-full group"
              @click="openPopularModal(topMeals[3])"
            >
              <img
                :src="topMeals[3].strMealThumb"
                :alt="topMeals[3].strMeal"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
              ></div>
              <span
                class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-3 sm:px-4 py-1.5 rounded-full bg-black/70 text-white text-xs sm:text-sm font-medium flex items-center gap-2"
              >
                {{ topMeals[3].strMeal }}
                <span class="text-sm sm:text-base">View →</span>
              </span>
            </button>

            <button
              v-if="topMeals[4]"
              type="button"
              class="relative rounded-[18px] sm:rounded-[22px] overflow-hidden h-36 sm:h-40 w-full mt-4 group"
              @click="openPopularModal(topMeals[4])"
            >
              <img
                :src="topMeals[4].strMealThumb"
                :alt="topMeals[4].strMeal"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              ></div>
              <span
                class="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 px-2 sm:px-3 py-1.5 rounded-full bg-black/70 text-white text-[10px] sm:text-xs font-medium flex items-center gap-2"
              >
                {{ topMeals[4].strMeal }}
                <span class="text-xs sm:text-sm">View →</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="min-h-screen w-full bg-slate-50 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
   <div 
  class="w-full flex flex-row items-center gap-2 sm:gap-6 mb-8"
>
  <div
    class="flex items-center gap-2 bg-white/90 border border-slate-200 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 shadow-md
           w-[70%] sm:w-[500px]"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 text-slate-400 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
      />
    </svg>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      class="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
      @keyup.enter="scrollToRecipes"
    />
  </div>

  <button
    type="button"
    class="w-[30%] sm:w-auto inline-flex justify-center px-4 py-2.5 rounded-xl bg-[#588157] text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition"
    @click="scrollToRecipes"
  >
    Search
  </button>
</div>



        <div class="mt-6 sm:mt-16">
          <div
            ref="recipesSection"
            v-if="!pending && !errorMessage && paginatedRecipes.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <button
              v-for="recipe in paginatedRecipes"
              :key="recipe.id"
              @click="openModal(recipe)"
              class="bg-transparent text-left"
            >
              <div
                class="relative bg-white rounded-3xl shadow-md w-full pt-10 pb-4 px-4 flex flex-col items-center"
              >
                <div
                  class="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]"
                >
                  <img
                    :src="recipe.imageUrl"
                    :alt="recipe.title"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div
                  class="absolute top-2 left-3 text-[10px] sm:text-[11px] font-semibold text-[#588157]"
                >
                  <span
                    v-if="isNewRecipe(recipe)"
                    class="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs shadow-lg"
                  >
                    NEW
                  </span>
                  <span v-else-if="recipe.discount" class="text-red-500">
                    -{{ recipe.discount }}%
                  </span>
                </div>

                <div class="mt-10 sm:mt-12 w-full text-center flex flex-col gap-2">
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

                <div class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden">
                  <a
                    v-if="recipe.youtubeUrl"
                    :href="recipe.youtubeUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click.stop
                    class="flex-1 flex items-center justify-center text-[11px] sm:text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947] transition-colors"
                  >
                    YouTube video
                  </a>
                  <div v-else class="flex-1 bg-[#588157] opacity-60"></div>

                  <button
                    v-if="isAuth"
                    @click.stop="toggleFavorite(recipe.id)"
                    class="w-24 flex items-center justify-center text-[11px] sm:text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947] border-l border-white/40 transition-colors"
                  >
                    {{ isFavorite(recipe.id) ? 'Saved' : 'Save' }}
                  </button>
                </div>
              </div>
            </button>
          </div>

          <div v-if="pending" class="flex justify-center py-20">
            <div class="relative w-16 h-16 sm:w-20 sm:h-20">
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

          <div v-else-if="errorMessage" class="text-center py-16">
            <p class="text-red-500 text-lg sm:text-xl font-semibold mb-4">
              {{ errorMessage }}
            </p>
            <button
              @click="fetchRecipes"
              class="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm"
            >
              Retry
            </button>
          </div>

          <div v-else-if="!paginatedRecipes.length" class="text-center py-16">
            <p class="text-slate-600 text-lg sm:text-xl font-semibold mb-2">
              No recipes found
            </p>
            <button
              @click="fetchRecipes"
              class="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm"
            >
              Reload
            </button>
          </div>

          <div
            v-if="totalPages > 1"
            class="mt-8 sm:mt-10 flex items-center justify-center gap-4 text-xs sm:text-sm font-medium text-slate-700"
          >
            <button
              class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              ‹ Previous
            </button>

            <div class="flex items-center gap-1 sm:gap-2">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border text-xs sm:text-sm"
                :class="page === currentPage
                  ? 'bg-amber-400 text-black border-transparent'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
              >
                {{ page.toString().padStart(2, '0') }}
              </button>
            </div>

            <button
              class="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="selectedRecipe"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="closeModal"
        >
          <div
            class="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div class="relative h-40 sm:h-48 w-full">
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
                  class="text-lg sm:text-xl font-bold text-white drop-shadow-lg line-clamp-2"
                >
                  {{ selectedRecipe.title }}
                </h2>
              </div>
            </div>

            <div class="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar">
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
                  class="block w-full text-center py-3 px-4 rounded-xl bg-[#588157] hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                >
                  YouTube video
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="popularSelected"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          @click.self="popularSelected = null"
        >
          <div
            class="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div class="relative h-40 sm:h-48 w-full">
              <img
                :src="popularSelected.strMealThumb"
                :alt="popularSelected.strMeal"
                class="w-full h-full object-cover"
              />
              <button
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center text-sm transition-all"
                @click="popularSelected = null"
              >
                ✕
              </button>
              <div class="absolute bottom-3 left-3 right-3">
                <h2
                  class="text-lg sm:text-xl font-bold text-white drop-shadow-lg line-clamp-2"
                >
                  {{ popularSelected.strMeal }}
                </h2>
              </div>
            </div>

            <div class="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar">
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"
                >
                  {{ popularSelected.strCategory }}
                </span>
                <span
                  class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold"
                >
                  {{ popularSelected.strArea }}
                </span>
              </div>

              <div class="mb-4">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">
                  Инструкция
                </h3>
                <p
                  class="text-slate-700 leading-relaxed text-sm whitespace-pre-line"
                >
                  {{ popularSelected.strInstructions }}
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
                    v-for="(item, i) in popularIngredients"
                    :key="i"
                    class="flex justify-between bg-slate-50 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <span class="truncate">{{ item.name }}</span>
                    <span class="text-slate-500 ml-2">{{ item.measure }}</span>
                  </li>
                </ul>
              </div>

              <div class="pt-2 sticky bottom-0 bg-white pb-2">
                <a
                  v-if="popularSelected.strYoutube"
                  :href="popularSelected.strYoutube"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full text-center py-3 px-4 rounded-xl bg-[#588157] hover:bg-red-600 text-white font-semibold text-sm transition-colors"
                >
                  YouTube video
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const userId = ref('')
const userName = ref('')
const userEmail = ref('')
const userRole = ref('')
const isAuth = ref(false)
const isAdmin = ref(false)

const userInitial = computed(() =>
  userName.value ? userName.value[0]?.toUpperCase() : 'U'
)

const showSearch = ref(false)
const searchQuery = ref('')
const recipesSection = ref(null)
const activeLetter = ref(null)

const recipes = ref([])
const pending = ref(true)
const errorMessage = ref(null)

const favorites = ref([])

const topMeals = ref([])
const popularSelected = ref(null)

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

const selectedRecipe = ref(null)

const currentPage = ref(1)
const pageSize = 8

const filteredRecipes = computed(() => {
  let result = recipes.value

  if (activeLetter.value) {
    result = result.filter(r =>
      r.title.toLowerCase().startsWith(activeLetter.value.toLowerCase())
    )
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    )
  }

  return result
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRecipes.value.length / pageSize))
)

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRecipes.value.slice(start, start + pageSize)
})

const isNewRecipe = recipe => {
  if (!recipe.createdAt) return false
  const createdDate = new Date(recipe.createdAt)
  const now = new Date()
  const diffTime = now - createdDate
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

const fetchRecipes = async () => {
  try {
    pending.value = true
    errorMessage.value = null

    const apiRecipes = await $fetch(`${MOCK_API_URL}/recipes`)
    recipes.value = apiRecipes
      .filter(r => r.isPublic !== false)
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Recipes жүктелмеді'
  } finally {
    pending.value = false
  }
}

const fetchPopularMeals = async () => {
  try {
    const res = await $fetch(
      'https://www.themealdb.com/api/json/v1/1/search.php?f=g'
    )
    topMeals.value = (res.meals || []).slice(0, 4)
  } catch (e) {
    console.error(e)
  }
}

const openPopularModal = meal => {
  popularSelected.value = meal
}

const loadFavorites = async () => {
  if (!userId.value) return

  try {
    const data = await $fetch(
      `${MOCK_API_URL}/favorites?userId=${encodeURIComponent(userId.value)}`
    )
    favorites.value = Array.isArray(data) ? data : []
  } catch (e) {
    // Егер MockAPI 404 қайтарса – жай ғана favorites жоқ деп қабылдаймыз
    if (e?.statusCode === 404 || e?.response?.status === 404) {
      favorites.value = []
      return
    }

    console.error('Load favorites error:', e)
    favorites.value = []
  }
}


const toggleFavorite = async recipeId => {
  if (!isAuth.value || !userId.value) {
    router.push('/login')
    return
  }

  try {
    const exists = favorites.value.find(f => f.recipeId === recipeId)

    if (exists) {
      await $fetch(`${MOCK_API_URL}/favorites/${exists.id}`, {
        method: 'DELETE'
      })
    } else {
      await $fetch(`${MOCK_API_URL}/favorites`, {
        method: 'POST',
        body: {
          recipeId,
          userId: userId.value,
          username: userName.value,
          email: userEmail.value,
          savedAt: new Date().toISOString()
        }
      })
    }

    await loadFavorites()
  } catch (e) {
    console.error('Favorite error:', e)
  }
}

const isFavorite = recipeId =>
  favorites.value.some(f => f.recipeId === recipeId)

const openModal = recipe => {
  selectedRecipe.value = recipe
}

const closeModal = () => {
  selectedRecipe.value = null
}

const scrollToRecipes = () => {
  recipesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleScroll = () => {
  if (window.scrollY < 100) showSearch.value = false
}

const goToPage = page => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  nextTick(() => {
    if (recipesSection.value) {
      recipesSection.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const setupUser = () => {
  if (typeof window === 'undefined') return

  userId.value =
    localStorage.getItem('userId') ||
    localStorage.getItem('userEmail') ||
    localStorage.getItem('email') ||
    ''

  userName.value =
    localStorage.getItem('userName') ||
    localStorage.getItem('username') ||
    'User'

  userEmail.value =
    localStorage.getItem('userEmail') ||
    localStorage.getItem('email') ||
    userId.value

  userRole.value = localStorage.getItem('role') || ''
  isAuth.value = !!userId.value
  isAdmin.value = userRole.value === 'admin'
}

onMounted(async () => {
  setupUser()
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }

  await Promise.all([fetchRecipes(), fetchPopularMeals()])
  if (userId.value) await loadFavorites()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

watch(searchQuery, () => {
  activeLetter.value = null
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
  to {
    transform: rotate(360deg);
  }
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
