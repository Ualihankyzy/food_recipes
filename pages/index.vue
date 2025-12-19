<template>
  <div class="min-h-screen w-full relative">
    <div v-if="showPopularModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showPopularModal = false">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-6 border-b border-slate-100">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold text-slate-900">{{ selectedMeal?.strMeal || 'Popular Recipe' }}</h3>
            <button @click="showPopularModal = false" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition">
              ×
            </button>
          </div>
        </div>
        <div class="p-6 space-y-6">

          <div v-if="selectedMeal?.strMealThumb" class="relative rounded-2xl overflow-hidden h-64">
            <img :src="selectedMeal.strMealThumb" :alt="selectedMeal.strMeal" class="w-full h-full object-cover" />
          </div>
          

          <div class="flex items-center gap-4 text-sm text-slate-600">
            <span class="px-3 py-1 bg-slate-100 rounded-full">{{ selectedMeal?.strCategory }}</span>
            <span class="px-3 py-1 bg-slate-100 rounded-full">{{ selectedMeal?.strArea }}</span>
          </div>
          

          <div>
            <h4 class="text-lg font-semibold text-slate-900 mb-4">Ingredients</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="n in 15" :key="n" class="flex items-start gap-2 text-sm">
                <span v-if="selectedMeal[`strIngredient${n}`]" class="font-medium text-slate-900 min-w-[120px]">
                  {{ selectedMeal[`strIngredient${n}`] }}:
                </span>
                <span v-if="selectedMeal[`strMeasure${n}`]" class="text-slate-700">
                  {{ selectedMeal[`strMeasure${n}`] }}
                </span>
              </div>
            </div>
          </div>
          

          <div>
            <h4 class="text-lg font-semibold text-slate-900 mb-4">Instructions</h4>
            <div class="text-slate-700 leading-relaxed whitespace-pre-line text-sm" v-html="selectedMeal?.strInstructions?.replace(/\r\n/g, '<br>') || 'No instructions available'"></div>
          </div>
          
  
          <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
            <a v-if="selectedMeal?.strYoutube" :href="selectedMeal.strYoutube" target="_blank" 
               class="flex-1 bg-[#ff9505] text-white text-center py-3 px-6 rounded-xl font-semibold  transition">
               Watch Video
            </a>
          </div>
        </div>
      </div>
    </div>


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
            class="xs:inline-block sm:inline-block hover:underline font-semibold text-sm sm:text-lg"
          >
            {{ isAdmin ? 'Admin Panel' : 'Dashboard' }}
          </a>

          <button
            @click="router.push('/profile')"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-white/20 transition"
          >
            <div
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br  bg-[#cc5803] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md"
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
      class="w-full flex justify-center items-center gap-6 absolute top-0 left-0 z-20 sm:mt-0"
    >
      <img src="../public/images/light.png" class="w-56 sm:w-64" />
      <img src="../public/images/light.png" class="w-64 hidden sm:block" />
      <img src="../public/images/light.png" class="w-64 hidden sm:block" />
    </div>


    <section
      class="relative w-full h-[60vh] md:h-screen flex justify-center items-center overflow-hidden"
    >
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
            class="text-xs sm:text-sm text-slate-700 hover:text-slate-900 hover:underline"
            @click="scrollToSlider"
          >
            See all →
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <div class="grid gap-4 md:col-span-2">
            <div
              v-if="topMeals[0]"
              @click="openMealDetail(topMeals[0])"
              class="relative rounded-[20px] sm:rounded-[26px] overflow-hidden h-52 sm:h-64 w-full group block cursor-pointer"
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
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="(meal, idx) in topMeals.slice(1, 3)"
                :key="'small-left-' + (meal?.idMeal || idx)"
                @click="openMealDetail(meal)"
                class="relative rounded-[18px] sm:rounded-[22px] overflow-hidden h-40 sm:h-44 w-full group block cursor-pointer"
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
              </div>
            </div>
          </div>

          <div>
            <div
              v-if="topMeals[3]"
              @click="openMealDetail(topMeals[3])"
              class="relative rounded-[22px] sm:rounded-[30px] overflow-hidden h-52 sm:h-full min-h-[220px] sm:min-h-[280px] w-full group block cursor-pointer"
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
            </div>

            <div
              v-if="topMeals[4]"
              @click="openMealDetail(topMeals[4])"
              class="relative rounded-[18px] sm:rounded-[22px] overflow-hidden h-36 sm:h-40 w-full mt-4 group block cursor-pointer"
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
            </div>
          </div>
        </div>
      </div>
    </section>


    <div ref="sliderSection" class="w-full bg-white pt-6 pb-12 sm:pt-8 sm:pb-14
 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p class="text-xs tracking-[0.35em] text-slate-500 uppercase">
              Recipes by category
            </p>
            <div class="mt-2 h-[3px] w-16 bg-red-500 rounded-full"></div>
          </div>


          <div class="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2">
            <button
              v-for="tag in availableFilters"
              :key="tag.value"
              @click="onFilterClick(tag)"
              class="px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 whitespace-nowrap flex-shrink-0"
              :class="
                activeFilter === tag.value
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              "
            >
              {{ tag.label }}
            </button>
          </div>
        </div>


        <div class="relative">

          <button
            type="button"
            class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-slate-300 bg-white items-center justify-center text-slate-700 shadow-lg hover:bg-slate-50 z-20 transition-all"
            @click="prevSlide"
            :disabled="currentIndex === 0"
            :class="currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''"
          >
            ‹
          </button>


          <button
            type="button"
            class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-slate-300 bg-white items-center justify-center text-slate-700 shadow-lg hover:bg-slate-50 z-20 transition-all"
            @click="nextSlide"
            :disabled="endIndex >= filteredRecipes.length"
            :class="endIndex >= filteredRecipes.length ? 'opacity-40 cursor-not-allowed' : ''"
          >
            ›
          </button>


          <div class="overflow-hidden">
            <div class="flex gap-6 sm:gap-8 transition-transform duration-500" :style="{ transform: `translateX(-${translateX}px)` }" ref="trackRef">
      
<NuxtLink
  v-for="recipe in filteredRecipes"
  :key="recipe.id + '-' + activeFilter"
 :to="`/recipes/${recipe.id}`"
  class="flex-none w-[260px] sm:w-[280px] lg:w-[300px] cursor-pointer"
>
  <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div class="h-[260px] sm:h-[280px] w-full overflow-hidden">
      <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
    </div>
    <div class="px-4 sm:px-5 pt-4 pb-5">
      <h3 class="text-base sm:text-lg font-semibold text-slate-900 leading-snug line-clamp-2 mb-1">
        {{ recipe.title }}
      </h3>
      <p class="text-xs text-slate-500 mb-3">
        {{ recipe.category }} • {{ recipe.area }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1 text-amber-500 text-xs">
          <span v-for="i in 5" :key="i">★</span>
        </div>
        <button
          v-if="isAuth"
          @click.prevent.stop="toggleFavorite(recipe.id)"
          class="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-sm hover:bg-slate-900 hover:text-white transition-all shrink-0"
        >
          {{ isFavorite(recipe.id) ? '★' : '☆' }}
        </button>
      </div>
    </div>
  </div>
</NuxtLink>

            </div>
          </div>

   
          <div class="mt-6 flex items-center justify-center gap-3 text-xs text-slate-600">
            <span>{{ visiblePage }} / {{ totalSliderPages }}</span>
          </div>

      
          <div v-if="pending" class="flex justify-center py-20">...</div>
          <div v-else-if="errorMessage" class="text-center py-16">...</div>
          <div v-else-if="!filteredRecipes.length && !pending" class="text-center py-16">
            <p class="text-slate-600 text-lg sm:text-xl font-semibold mb-2">No recipes found</p>
            <button @click="fetchRecipes" class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">Reload</button>
          </div>
        </div>
      </div>
    </div>
  </div>




<section class="bg-white pt-12 pb-32">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 text-center">

    <div>
      <div class="flex justify-center mb-6">
        <svg class="w-16 h-16 text-orange-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 24h48l-6 28H14L8 24Z"/>
          <path d="M20 24L32 8l12 16"/>
        </svg>
      </div>

      <h4 class="text-sm tracking-[0.35em] text-orange-500 mb-2">
        OUR STORY
      </h4>

      <h3 class="text-xl font-medium text-black mb-4">
        HOME COOKED RECIPES
      </h3>

      <div class="w-14 h-px bg-orange-500 mx-auto mb-4"></div>

      <p class="text-base text-black/70 leading-relaxed">
        Simple and delicious recipes made with love for everyday cooking.
      </p>
    </div>


    <div>
      <div class="flex justify-center mb-6">
        <svg class="w-16 h-16 text-orange-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 40c8-20 32-20 40 0"/>
          <path d="M20 40c6-14 18-14 24 0"/>
        </svg>
      </div>

      <h4 class="text-sm tracking-[0.35em] text-orange-500 mb-2">
        OUR RECIPES
      </h4>

      <h3 class="text-xl font-medium text-black mb-4">
        FRESH INGREDIENTS
      </h3>

      <div class="w-14 h-px bg-orange-500 mx-auto mb-4"></div>

      <p class="text-base text-black/70 leading-relaxed">
        Easy recipes using fresh ingredients you can find anywhere.
      </p>
    </div>


    <div>
      <div class="flex justify-center mb-6">
        <svg class="w-16 h-16 text-orange-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="32" cy="32" r="20"/>
          <path d="M12 32h40"/>
          <path d="M32 12c6 8 6 32 0 40"/>
          <path d="M32 12c-6 8-6 32 0 40"/>
        </svg>
      </div>

      <h4 class="text-sm tracking-[0.35em] text-orange-500 mb-2">
        OUR GOAL
      </h4>

      <h3 class="text-xl font-medium text-black mb-4">
        HEALTHY & TASTY
      </h3>

      <div class="w-14 h-px bg-orange-500 mx-auto mb-4"></div>

      <p class="text-base text-black/70 leading-relaxed">
        Helping you cook healthy, tasty meals without stress.
      </p>
    </div>

  </div>
</section>


 <footer class="bg-black text-gray-200 py-12 px-4 md:px-16 lg:px-24">
  <div class="max-w-6xl mx-auto">

    <div class="flex flex-col gap-10">

      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <h2 class="text-3xl md:text-4xl font-semibold leading-tight">
          Food Recipes
        </h2>


<div class="flex items-center gap-3">
  <RouterLink
    to="/login"
    class="px-4 py-2 text-xs font-medium rounded-full border border-gray-500 text-gray-200 hover:bg-gray-800 transition"
  >
    Login
  </RouterLink>

  <RouterLink
    to="/signup"
    class="px-4 py-2 text-xs font-medium rounded-full bg-[#588157] text-black hover:bg-green-400 transition"
  >
    Sign up
  </RouterLink>
</div>

      </div>


      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

        <div class="md:w-1/3 space-y-2 text-sm">
          <p class="font-semibold tracking-wide text-gray-300">
            CONTACT INFORMATION
          </p>
          <div class="flex items-center gap-2 text-gray-400">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600/10 text-green-400">

              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4 6h16a1 1 0 0 1 .8 1.6l-8 10a1 1 0 0 1-1.6 0l-8-10A1 1 0 0 1 4 6z" />
              </svg>
            </span>
            <span>support@foodrecipes.com</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600/10 text-green-400">

              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 5a2 2 0 0 1 2-2h1.2a1 1 0 0 1 .98.8l.6 3a1 1 0 0 1-.57 1.1l-1.4.7a1 1 0 0 0-.46 1.3 13 13 0 0 0 6.07 6.07 1 1 0 0 0 1.3-.46l.7-1.4a1 1 0 0 1 1.1-.57l3 .6a1 1 0 0 1 .8.98V19a2 2 0 0 1-2 2h-1C9.82 21 3 14.18 3 6V5z" />
              </svg>
            </span>
            <span>+1 (800) 555‑0123</span>
          </div>
        </div>

    <div class="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div class="space-y-3">
            <h4 class="font-semibold text-gray-300 uppercase tracking-wide text-xs">
              Recipes
            </h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-gray-200">Breakfast</a></li>
              <li><a href="#" class="hover:text-gray-200">Lunch</a></li>
              <li><a href="#" class="hover:text-gray-200">Dinner</a></li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="font-semibold text-gray-300 uppercase tracking-wide text-xs">
              Explore
            </h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-gray-200">Popular recipes</a></li>
              <li><a href="#" class="hover:text-gray-200">Quick & easy</a></li>
              <li><a href="#" class="hover:text-gray-200">Healthy meals</a></li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="font-semibold text-gray-300 uppercase tracking-wide text-xs">
              Company
            </h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-gray-200">About</a></li>
              <li><a href="#" class="hover:text-gray-200">Contact</a></li>
              <li><a href="#" class="hover:text-gray-200">Blog</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>


    <div class="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
      <p>© 2025 Food Recipes. All rights reserved.</p>
      <div class="flex items-center gap-6">
        <a href="#" class="hover:text-gray-300">Privacy</a>
        <a href="#" class="hover:text-gray-300">Terms &amp; Conditions</a>
      </div>
    </div>
  </div>
</footer>


</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'


const showPopularModal = ref(false)
const selectedMeal = ref(null)


const userId = ref(''), userName = ref(''), userEmail = ref(''), userRole = ref('')
const isAuth = ref(false), isAdmin = ref(false)
const userInitial = computed(() => userName.value ? userName.value[0]?.toUpperCase() : 'U')


const recipes = ref([])
const pending = ref(true)
const errorMessage = ref(null)
const favorites = ref([])


const topMeals = ref([])


const sliderSection = ref(null)
const trackRef = ref(null)
const cardWidth = ref(0)
const gap = 24
const currentIndex = ref(0)


const allCategories = [
  { label: 'All', value: 'all' },
  { label: 'Beef', value: 'Beef' },
  { label: 'Dessert', value: 'Dessert' },
  { label: 'Vegetarian', value: 'Vegetarian' },
  { label: 'Seafood', value: 'Seafood' },
  { label: 'Pork', value: 'Pork' }
]
const activeFilter = ref('all')

const availableFilters = computed(() => {
  return allCategories.map(cat => ({
    ...cat,
    count: cat.value === 'all' ? 0 : recipes.value.filter(r => r.category === cat.value).length
  })).filter(cat => cat.count > 0 || cat.value === 'all')
})

const filteredRecipes = computed(() => {
  if (activeFilter.value === 'all') return recipes.value
  return recipes.value.filter(r => r.category === activeFilter.value)
})


const openMealDetail = (meal) => {
  selectedMeal.value = meal
  showPopularModal.value = true
}


const onFilterClick = (tag) => {
  activeFilter.value = tag.value
  currentIndex.value = 0
  nextTick(() => {
    sliderSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}


const visibleCount = computed(() => {
  if (typeof window === 'undefined') return 4
  const w = window.innerWidth
  if (w < 640) return 1
  if (w < 1024) return 2
  return 4
})

const translateX = computed(() => cardWidth.value ? currentIndex.value * (cardWidth.value + gap) : 0)
const totalSliderPages = computed(() => !filteredRecipes.value.length ? 1 : Math.ceil(filteredRecipes.value.length / visibleCount.value))
const visiblePage = computed(() => Math.floor(currentIndex.value / visibleCount.value) + 1)
const endIndex = computed(() => currentIndex.value + visibleCount.value)


const nextSlide = () => { if (endIndex.value < filteredRecipes.value.length) currentIndex.value += visibleCount.value }
const prevSlide = () => { if (currentIndex.value > 0) currentIndex.value = Math.max(0, currentIndex.value - visibleCount.value) }
const measureCard = () => { if (trackRef.value?.children[0]) cardWidth.value = trackRef.value.children[0].getBoundingClientRect().width }

watch(filteredRecipes, () => {
  if (currentIndex.value >= filteredRecipes.value.length) currentIndex.value = 0
}, { immediate: true })


const fetchRecipes = async () => {
  try {
    pending.value = true
    errorMessage.value = null
    const apiRecipes = await $fetch(`${MOCK_API_URL}/recipes`)
    const uniqueRecipes = apiRecipes
      .filter(r => r.isPublic !== false)
      .filter((recipe, index, self) => index === self.findIndex(r => r.id === recipe.id))
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bDate - aDate
      })
    recipes.value = uniqueRecipes
  } catch (e) {
    console.error(e)
    errorMessage.value = 'Recipes жүктелмеді'
  } finally {
    pending.value = false
    await nextTick()
    measureCard()
  }
}

const fetchPopularMeals = async () => {
  try {
    const res = await $fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=g')
    topMeals.value = (res.meals || []).slice(0, 4)
  } catch (e) { console.error(e) }
}


const loadFavorites = async () => {
  if (!userId.value) return
  try {
    const data = await $fetch(`${MOCK_API_URL}/favorites?userId=${encodeURIComponent(userId.value)}`)
    favorites.value = Array.isArray(data) ? data : []
  } catch (e) {
    if (e?.statusCode === 404 || e?.response?.status === 404) favorites.value = []
    else console.error('Load favorites error:', e)
  }
}

const toggleFavorite = async recipeId => {
  if (!isAuth.value || !userId.value) { router.push('/login'); return }
  try {
    const exists = favorites.value.find(f => f.recipeId === recipeId)
    if (exists) await $fetch(`${MOCK_API_URL}/favorites/${exists.id}`, { method: 'DELETE' })
    else await $fetch(`${MOCK_API_URL}/favorites`, {
      method: 'POST',
      body: { recipeId, userId: userId.value, username: userName.value, email: userEmail.value, savedAt: new Date().toISOString() }
    })
    await loadFavorites()
  } catch (e) { console.error('Favorite error:', e) }
}

const isFavorite = recipeId => favorites.value.some(f => f.recipeId === recipeId)


const setupUser = () => {
  if (typeof window === 'undefined') return
  userId.value = localStorage.getItem('userId') || localStorage.getItem('userEmail') || localStorage.getItem('email') || ''
  userName.value = localStorage.getItem('userName') || localStorage.getItem('username') || 'User'
  userEmail.value = localStorage.getItem('userEmail') || localStorage.getItem('email') || userId.value
  userRole.value = localStorage.getItem('role') || ''
  isAuth.value = !!userId.value
  isAdmin.value = userRole.value === 'admin'
}

const scrollToSlider = () => sliderSection.value?.scrollIntoView({ behavior: 'smooth' })


const handleResize = () => measureCard()
onMounted(async () => {
  setupUser()
  await Promise.all([fetchRecipes(), fetchPopularMeals()])
  if (userId.value) await loadFavorites()
  await nextTick()
  measureCard()
  if (typeof window !== 'undefined') window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', handleResize)
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
.line-clamp-2 { 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
</style>
