<template>
  <div class="min-h-screen flex bg-emerald-600">
    <!-- SIDEBAR -->
    <aside class="w-64 bg-emerald-700 text-white flex flex-col">
      <!-- Brand -->
      <div class="h-20 flex items-center px-6 border-b border-emerald-500">
        <h1 class="text-2xl font-bold tracking-wide">Recipes</h1>
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-6 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="activeTab = item.key"
          class="w-full flex items-center gap-3 px-6 py-3 text-left text-sm font-medium transition
                 hover:bg-emerald-600"
          :class="activeTab === item.key ? 'bg-emerald-500' : ''"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom (Profile / Logout) -->
      <div class="p-6 border-t border-emerald-500 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-lg">
            {{ userInitial }}
          </div>
          <div class="text-sm leading-tight">
            <p class="font-semibold">{{ userName || 'Guest' }}</p>
            <p class="text-emerald-200 text-xs">Logged in</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full mt-2 flex items-center gap-2 text-sm text-emerald-100 hover:text-white"
        >
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN PANEL (ақ аймақ) -->
    <main class="flex-1 bg-emerald-50 flex flex-col">
      <!-- Top bar -->
      <header class="h-16 border-b border-emerald-100 flex items-center justify-between px-8 bg-white">
        <h2 class="text-xl font-semibold text-emerald-800 capitalize">
          {{ activeTabTitle }}
        </h2>
        <span class="text-sm text-emerald-600">
          Welcome back, <strong>{{ userName || 'Guest' }}</strong>
        </span>
      </header>

      <!-- Content -->
      <section class="flex-1 p-8 overflow-y-auto">
        <!-- HOME TAB -->
        <div v-if="activeTab === 'home'" class="space-y-8">
          <div class="bg-white rounded-3xl shadow-md p-8 border border-emerald-100">
            <h3 class="text-2xl font-bold text-emerald-800 mb-2">Dashboard Overview</h3>
            <p class="text-sm text-emerald-600 mb-6">
              Басқару панелі арқылы өз рецепттеріңді құрып, сақтап, жеңіл таба аласың.
            </p>
            <div class="flex flex-wrap gap-4">
              <button
                @click="activeTab = 'my-recipes'"
                class="px-6 py-3 rounded-2xl bg-emerald-500 text-white text-sm font-semibold shadow hover:bg-emerald-600"
              >
                👤 Go to My Recipes
              </button>
              <button
                @click="activeTab = 'saved'"
                class="px-6 py-3 rounded-2xl bg-white text-emerald-700 text-sm font-semibold border border-emerald-300 hover:bg-emerald-50"
              >
                ❤️ View Saved Recipes
              </button>
              <button
                @click="showCreateModal = true"
                class="px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-800 text-sm font-semibold hover:bg-emerald-200"
              >
                ➕ Create New Recipe
              </button>
            </div>
          </div>
        </div>

        <!-- MY RECIPES TAB -->
        <div v-else-if="activeTab === 'my-recipes'" class="space-y-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-semibold text-emerald-800">My Recipes</h3>
            <button
              @click="showCreateModal = true"
              class="px-5 py-2 rounded-2xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
            >
              ➕ New Recipe
            </button>
          </div>

          <div v-if="myRecipesLoading" class="text-center text-emerald-500 py-10">
            Loading your recipes...
          </div>
          <div v-else-if="!myRecipes.length" class="text-center text-emerald-600 py-10">
            Әзірге рецепт жоқ. Жоғарыдағы <strong>New Recipe</strong> батырмасын басып, бірінші рецептіңді құр.
          </div>
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="recipe in myRecipes"
              :key="recipe.id"
              class="bg-white rounded-3xl shadow-md border border-emerald-100 overflow-hidden flex flex-col"
            >
              <div class="h-40 bg-emerald-100 overflow-hidden">
                <img
                  :src="recipe.imageUrl"
                  :alt="recipe.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-4 flex-1 flex flex-col gap-2">
                <h4 class="font-semibold text-emerald-800 line-clamp-2">
                  {{ recipe.title }}
                </h4>
                <p class="text-xs text-emerald-500">
                  {{ recipe.area }} • {{ recipe.category }}
                </p>
                <p class="text-xs text-emerald-700 line-clamp-3">
                  {{ recipe.instructions }}
                </p>
                <div class="mt-auto flex gap-2 pt-2">
                  <button
                    @click="viewRecipe(recipe)"
                    class="flex-1 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600"
                  >
                    View
                  </button>
                  <button
                    @click="deleteUserRecipe(recipe.id)"
                    class="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVED TAB -->
        <div v-else-if="activeTab === 'saved'" class="space-y-6">
          <h3 class="text-xl font-semibold text-emerald-800 mb-2">Saved Recipes</h3>
          <div v-if="savedLoading" class="text-center text-emerald-500 py-10">
            Loading saved recipes...
          </div>
          <div v-else-if="!savedRecipes.length" class="text-center text-emerald-600 py-10">
            Сохраненные рецепттер жоқ. Басты беттен рецепттерді «Сақтау» арқылы қос.
          </div>
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="fav in savedRecipes"
              :key="fav.id"
              class="bg-white rounded-3xl shadow-md border border-emerald-100 overflow-hidden flex flex-col"
            >
              <div class="h-40 bg-emerald-100 overflow-hidden">
                <img
                  :src="getRecipeImage(fav.recipeId)"
                  :alt="getRecipeTitle(fav.recipeId)"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-4 flex-1 flex flex-col gap-2">
                <h4 class="font-semibold text-emerald-800 line-clamp-2">
                  {{ getRecipeTitle(fav.recipeId) }}
                </h4>
                <p class="text-xs text-emerald-500">
                  {{ getRecipeArea(fav.recipeId) }} • {{ getRecipeCategory(fav.recipeId) }}
                </p>
                <div class="mt-auto flex gap-2 pt-2">
                  <button
                    @click="openFromSaved(fav.recipeId)"
                    class="flex-1 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600"
                  >
                    View
                  </button>
                  <button
                    @click="removeFavorite(fav.id)"
                    class="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PROFILE TAB (қарапайым) -->
        <div v-else-if="activeTab === 'profile'" class="space-y-6">
          <div class="bg-white rounded-3xl shadow-md p-8 border border-emerald-100 max-w-xl">
            <h3 class="text-2xl font-bold text-emerald-800 mb-4">Profile</h3>
            <p class="text-sm text-emerald-700 mb-2">Name: {{ userName || 'Guest' }}</p>
            <p class="text-sm text-emerald-700 mb-2">User ID: {{ userId || 'unknown' }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- SIMPLE VIEW MODAL -->
    <transition name="fade">
      <div
        v-if="viewedRecipe"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="viewedRecipe = null"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="relative h-48">
            <img
              :src="viewedRecipe.imageUrl"
              :alt="viewedRecipe.title"
              class="w-full h-full object-cover"
            />
            <button
              class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
              @click="viewedRecipe = null"
            >
              ✕
            </button>
          </div>
          <div class="p-5 overflow-y-auto">
            <h3 class="text-xl font-bold text-emerald-800 mb-2">
              {{ viewedRecipe.title }}
            </h3>
            <p class="text-xs text-emerald-500 mb-4">
              {{ viewedRecipe.area }} • {{ viewedRecipe.category }}
            </p>
            <h4 class="font-semibold text-emerald-800 mb-2">Instructions</h4>
            <p class="text-sm text-emerald-700 whitespace-pre-line mb-4">
              {{ viewedRecipe.instructions }}
            </p>
            <h4 class="font-semibold text-emerald-800 mb-2">Ingredients</h4>
            <ul class="list-disc list-inside text-sm text-emerald-700 space-y-1">
              <li v-for="(ing, i) in viewedRecipe.ingredients || []" :key="i">
                {{ ing }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const MOCK_API = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const userId = ref('')
const userName = ref('')

// sidebar menu
const menuItems = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'my-recipes', label: 'My Recipes', icon: '🍳' },
  { key: 'saved', label: 'Saved', icon: '❤️' },
  { key: 'profile', label: 'Profile', icon: '👤' }
]

const activeTab = ref('home')

const activeTabTitle = computed(() => {
  const item = menuItems.find(m => m.key === activeTab.value)
  return item ? item.label : 'Dashboard'
})

const userInitial = computed(() =>
  userName.value ? userName.value[0]?.toUpperCase() : 'U'
)

// data
const allPublicRecipes = ref([])
const myRecipes = ref([])
const savedRecipes = ref([])
const myRecipesLoading = ref(false)
const savedLoading = ref(false)

const showCreateModal = ref(false)
const viewedRecipe = ref(null)

// --- DATA LOAD FUNCS (өзгермейді) ---
const loadPublicRecipes = async () => {
  try {
    const res = await fetch(`${MOCK_API}/recipes`)
    allPublicRecipes.value = await res.json()
  } catch (e) {
    console.error('loadPublicRecipes error', e)
  }
}

const loadMyRecipes = async () => {
  try {
    myRecipesLoading.value = true
    const res = await fetch(`${MOCK_API}/user-recipes?userId=${userId.value}`)
    myRecipes.value = await res.json()
  } catch (e) {
    console.error('loadMyRecipes error', e)
  } finally {
    myRecipesLoading.value = false
  }
}

const loadSaved = async () => {
  try {
    savedLoading.value = true
    const res = await fetch(`${MOCK_API}/favorites?userId=${userId.value}`)
    savedRecipes.value = await res.json()
  } catch (e) {
    console.error('loadSaved error', e)
  } finally {
    savedLoading.value = false
  }
}

// helpers
const getRecipeById = id =>
  allPublicRecipes.value.find(r => r.id === id) || {}

const getRecipeImage = id => getRecipeById(id).imageUrl || ''
const getRecipeTitle = id => getRecipeById(id).title || 'Unknown'
const getRecipeCategory = id => getRecipeById(id).category || 'Unknown'
const getRecipeArea = id => getRecipeById(id).area || ''

const openFromSaved = recipeId => {
  const base = getRecipeById(recipeId)
  if (!base) return
  viewedRecipe.value = { ...base }
}

const viewRecipe = recipe => {
  viewedRecipe.value = { ...recipe }
}

const deleteUserRecipe = async id => {
  if (!confirm('Delete this recipe?')) return
  await fetch(`${MOCK_API}/user-recipes/${id}`, { method: 'DELETE' })
  await loadMyRecipes()
}

const removeFavorite = async favId => {
  await fetch(`${MOCK_API}/favorites/${favId}`, { method: 'DELETE' })
  await loadSaved()
}

const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
    window.location.href = '/login'
  }
}

// ✅ localStorage тек onMounted ішінде
onMounted(async () => {
  if (typeof window !== 'undefined') {
    userId.value = window.localStorage.getItem('userId') || '1'
    userName.value = window.localStorage.getItem('userName') || 'User'
  } else {
    userId.value = '1'
    userName.value = 'User'
  }

  await Promise.all([loadPublicRecipes(), loadMyRecipes(), loadSaved()])
})
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.handwriting {
  font-family: 'Pacifico', cursive;
}
</style>
