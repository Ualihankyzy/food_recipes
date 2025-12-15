<template>
  <div class="min-h-screen flex bg-[#588157]">
    <!-- SIDEBAR -->
    <aside class="w-64 bg-[#588157] text-white flex flex-col border-r border-white/10">
      <!-- Brand -->
      <div class="h-20 flex items-center px-6 border-b border-white/10">
        <h1 class="text-2xl font-bold tracking-wide">Recipes</h1>
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-6 space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="
            item.type === 'route'
              ? router.push(item.to)
              : (activeTab = item.key)
          "
          class="relative w-full flex items-center gap-3 pl-6 pr-4 py-3 text-left text-sm font-medium
                 transition-colors duration-200"
          :class="[
            item.type === 'tab' && activeTab === item.key
              ? 'text-[#31572c]'
              : 'text-white/80 hover:text-white'
          ]"
        >
          <!-- Ақ pill тек табтар үшін -->
          <span
            v-if="item.type === 'tab'"
            class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md
                   transition-transform duration-200"
            :class="activeTab === item.key ? 'translate-x-0' : '-translate-x-full'"
          ></span>

          <span class="relative z-10 text-lg">
            {{ item.icon }}
          </span>
          <span class="relative z-10">
            {{ item.label }}
          </span>
        </button>
      </nav>

      <!-- Bottom (Logout) -->
      <div class="p-6 border-t border-white/10 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
            {{ userInitial }}
          </div>
          <div class="text-sm leading-tight">
            <p class="font-semibold">{{ userName || 'Guest' }}</p>
            <p class="text-emerald-100/80 text-xs">Logged in</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full mt-2 flex items-center gap-2 text-sm text-emerald-50 hover:text-white"
        >
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN PANEL -->
    <main class="flex-1 bg-[#f5f6f1] flex flex-col">
      <!-- Top bar -->
 <header class="h-20 border-b border-[#d0d3c8] flex items-center justify-end px-8 bg-white">
  <!-- Avatar ғана қалады -->
  <button
    class="flex items-center gap-3 group"
    @click="router.push('/profile')"
  >
    <div
      class="w-16 h-16 rounded-full bg-[#588157] overflow-hidden shadow-md border-4 border-white"
    >
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        class="w-full h-full object-cover"
        alt="Profile Avatar"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-white/20">
        <span class="text-sm font-bold text-white">
          {{ userInitial }}
        </span>
      </div>
    </div>
  </button>
</header>


      <!-- Content -->
      <section class="flex-1 p-8 overflow-y-auto">
        <!-- MY RECIPES (default tab) -->
        <div v-if="activeTab === 'my-recipes'" class="space-y-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-semibold text-[#31572c]">My Recipes</h3>
           


             <button
              @click="showCreateModal = true"
    class="relative inline-flex items-center gap-2 px-8 py-3 rounded-full
           text-white text-sm font-medium
           bg-gradient-to-r from-[#588157] via-[#6aa56a] to-[#88c17f]
           shadow-[0_10px_25px_rgba(0,0,0,0.25)]
           hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)]
           transition-all duration-300
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#588157]"
  >
    <span>Create recipe</span>
    <span class="text-lg leading-none">→</span>

    <!-- жылтыр эффект үшін үстіне ақ градиент қабаты -->
    <span
      class="pointer-events-none absolute inset-[2px] rounded-full
             bg-gradient-to-b from-white/60 via-white/10 to-transparent
             opacity-80"
    ></span>

    <!-- үстіңгі контент үстіне шығу үшін -->
    <span class="absolute inset-0 rounded-full mix-blend-soft-light"></span>
  </button>


          </div>
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
    <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
    <p class="text-[#6c7570]">
Loading recipes... </p>
  </div>

      

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="recipe in myRecipes"
              :key="recipe.id"
              class="bg-white rounded-3xl shadow-sm border border-[#d0d3c8] overflow-hidden flex flex-col"
            >
              <div class="h-40 bg-[#a3b18a] overflow-hidden">
                <img
                  v-if="recipe.imageUrl"
                  :src="recipe.imageUrl"
                  :alt="recipe.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-4 flex-1 flex flex-col gap-2">
                <h4 class="font-semibold text-[#31572c] line-clamp-2">
                  {{ recipe.title }}
                </h4>
                <p class="text-xs text-[#6c7570]">
                  {{ recipe.area }} • {{ recipe.category }}
                </p>
                <p class="text-xs text-[#6c7570] line-clamp-3">
                  {{ recipe.instructions }}
                </p>
                <div class="mt-auto flex gap-2 pt-2">
                  <button
                    @click="viewRecipe(recipe)"
                    class="flex-1 px-3 py-2 rounded-xl bg-[#588157] text-white text-xs font-semibold hover:bg-[#476747]"
                  >
                    View
                  </button>
                  <button
                    @click="deleteUserRecipe(recipe.id)"
                    class="px-3 py-2 rounded-xl bg-[#bc4749] text-white text-xs font-semibold hover:bg-[#a33a3d]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVED -->
<!-- SAVED (ескі кодты толық өшіріп, мынаны қой) -->
<div v-else-if="activeTab === 'saved'" class="space-y-6">
  <h3 class="text-xl font-semibold text-[#31572c] mb-2">Saved Recipes ({{ savedRecipes.length }})</h3>
  
  <!-- Loading -->
  <div v-if="isLoadingSaved" class="flex items-center justify-center py-20">
    <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
  </div>
  
  <!-- Home дизайнымен карточкалар -->
  <div v-else-if="savedRecipes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <button v-for="recipe in savedRecipes" :key="recipe.id" @click="viewRecipe(recipe)" class="bg-transparent text-left">
      <!-- Home карточкасының ДӘЛ СОЛ КӨРІНІСІ -->
      <div class="relative bg-white rounded-3xl shadow-md w-full pt-10 pb-4 px-4 flex flex-col items-center">
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]">
          <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover" />
        </div>
        <div class="absolute top-2 left-3 text-[11px] font-semibold text-[#588157]">
          <span v-if="recipe.isNew">NEW</span>
          <span v-else-if="recipe.discount" class="text-red-500">-{{ recipe.discount }}%</span>
        </div>
        <div class="mt-12 w-full text-center flex flex-col gap-2">
          <h3 class="text-sm font-semibold text-slate-900 leading-snug">{{ recipe.title }}</h3>
          <p class="text-[11px] text-slate-400">{{ recipe.category }} • {{ recipe.area }}</p>
          <p v-if="recipe.price" class="text-sm font-bold text-slate-900 mt-1">{{ recipe.price }}</p>
        </div>
        <div class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden">
          <a v-if="recipe.youtubeUrl" :href="recipe.youtubeUrl" target="_blank" rel="noopener noreferrer" @click.stop 
             class="flex-1 flex items-center justify-center text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947]">
            YouTube video
          </a>
          <div v-else class="flex-1 bg-[#588157] opacity-60"></div>
          <!-- DELETE батырмасы -->
         <button @click.stop="removeFromSaved(recipe.id)" class="w-24 flex items-center justify-center text-xs font-semibold text-white bg-[#bc4749] hover:bg-[#a33a3d] border-l border-white/40">
  Delete
</button>
        </div>
      </div>
    </button>
  </div>
  
  <p v-else class="text-center text-[#6c7570] py-10">No saved recipes yet. Save some from home page! ✨</p>
</div>


      </section>
    </main>

    <!-- VIEW MODAL -->
    <transition name="fade">
      <div
        v-if="viewedRecipe"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="viewedRecipe = null"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="relative h-48 bg-[#a3b18a]">
            <img
              v-if="viewedRecipe.imageUrl"
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
            <h3 class="text-xl font-bold text-[#31572c] mb-2">
              {{ viewedRecipe.title }}
            </h3>
            <p class="text-xs text-[#6c7570] mb-4">
              {{ viewedRecipe.area }} • {{ viewedRecipe.category }}
            </p>
            <h4 class="font-semibold text-[#31572c] mb-2">Instructions</h4>
            <p class="text-sm text-[#6c7570] whitespace-pre-line mb-4">
              {{ viewedRecipe.instructions }}
            </p>
            <h4 class="font-semibold text-[#31572c] mb-2">Ingredients</h4>
            <ul class="list-disc list-inside text-sm text-[#6c7570] space-y-1">
              <li v-for="(ing, i) in viewedRecipe.ingredients || []" :key="i">
                {{ ing }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- CREATE MODAL -->
    <transition name="fade">
    <div
  v-if="showCreateModal"
  class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
  @click.self="closeCreateModal"
>

        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">Create Recipe</h3>
            <button @click="closeCreateModal" class="text-[#6c7570] hover:text-black">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input
                v-model="form.title"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input
                  v-model="form.category"
                  class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
                  placeholder="e.g. Beef"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input
                  v-model="form.area"
                  class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
                  placeholder="e.g. Italian"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input
                v-model="form.imageUrl"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Ingredients (one per line)</label>
              <textarea
                v-model="ingredientsText"
                rows="3"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              ></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea
                v-model="form.instructions"
                rows="4"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              ></textarea>
              <!-- Visibility toggle -->
<div class="flex items-center gap-3 pt-2">
  <label class="text-xs font-semibold text-[#31572c] flex items-center gap-2">
    <input 
      type="checkbox" 
      v-model="form.isPublic" 
      class="w-4 h-4 rounded"
    />
    <span>Public (show on Home)</span>
  </label>
  <span class="text-xs text-[#6c7570]">(Only You = private)</span>
</div>

            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button
              @click="closeCreateModal"
              class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white"
            >
              Cancel
            </button>
            <button
            @click="createRecipe"
              class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>



<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { $db, $collection, $addDoc, $deleteDoc, $doc, $onSnapshot, $query, $where } = useNuxtApp()

const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

// State
const activeTab = ref('my-recipes')
const userId = ref('')
const userName = ref('')
const avatarUrl = ref('')
const isLoading = ref(false)
const myRecipes = ref([])
const savedRecipes = ref([])
const viewedRecipe = ref(null)
const showCreateModal = ref(false)

// Form
const form = ref({
  title: '',
  category: '',
  area: '',
  imageUrl: '',
  instructions: '',
  ingredients: [],
    isPublic: true 
})

// Computed
const userInitial = computed(() => userName.value ? userName.value[0]?.toUpperCase() : 'U')
const ingredientsText = computed({
  get: () => form.value.ingredients.join('\n'),
  set: v => {
    form.value.ingredients = v.split('\n').map(s => s.trim()).filter(Boolean)
  }
})

// Menu
const menuItems = [
  { key: 'home', label: 'Home', type: 'route', to: '/' },
  { key: 'my-recipes', label: 'My recipes', type: 'tab' },
  { key: 'saved', label: 'Saved', type: 'tab'}
]

// Listeners
let unsubscribeMyRecipes = null

// User
const setupUser = () => {
  if (typeof window !== 'undefined') {
    userId.value = localStorage.getItem('userId') || ''
    userName.value = localStorage.getItem('userName') || 'User'
    avatarUrl.value = localStorage.getItem('avatarUrl') || ''
  }
}

// Firebase: My Recipes
const loadMyRecipes = () => {
  if (unsubscribeMyRecipes) unsubscribeMyRecipes()
  if (!userId.value) return

  isLoading.value = true

  const q = $query(
    $collection($db, 'recipes'),
    $where('userId', '==', userId.value)
  )

  unsubscribeMyRecipes = $onSnapshot(q, (snapshot) => {
    myRecipes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    isLoading.value = false
  }, (error) => {
    console.error('Error loading recipes:', error)
    isLoading.value = false
  })
}

// MockAPI: Saved Recipes
// ✅ 404 error-ды ұстап, бос массив қайтару
// Saved ішінен өшіру
const isLoadingSaved = ref(false)
const removeFromSaved = async (recipeId) => {
  if (!userId.value) return
  isLoadingSaved.value = true
  try {
    const favorites = await $fetch(`${MOCK_API_URL}/favorites?userId=${userId.value}&recipeId=${recipeId}`).catch(() => [])
    for (const fav of favorites) {
      await $fetch(`${MOCK_API_URL}/favorites/${fav.id}`, { method: 'DELETE' })
    }
    await loadSavedRecipes() // қайта жүктеу
  } catch (e) {
    console.error('Remove error:', e)
  } finally {
    isLoadingSaved.value = false
  }
}

// loadSavedRecipes функциясын жаңарту (ескі бар болса)
const loadSavedRecipes = async () => {
  if (!userId.value) {
    savedRecipes.value = []
    return
  }
  isLoadingSaved.value = true
  try {
    const favorites = await $fetch(`${MOCK_API_URL}/favorites?userId=${userId.value}`).catch(() => [])
    const recipesResponse = await $fetch(`${MOCK_API_URL}/recipes`)
    savedRecipes.value = recipesResponse.filter(r => favorites.some(f => f.recipeId === r.id))
  } catch (e) {
    savedRecipes.value = []
  } finally {
    isLoadingSaved.value = false
  }
}



// Create Recipe
const createRecipe = async () => {
  if (!form.value.title || !userId.value) return

  isLoading.value = true

  const recipe = {
    id: Date.now().toString(),
    title: form.value.title,
    category: form.value.category,
    area: form.value.area,
    imageUrl: form.value.imageUrl,
    instructions: form.value.instructions,
    ingredients: form.value.ingredients,
    userId: userId.value,
    createdAt: new Date().toISOString(),
    isNew: true,
    discount: null,
    price: null,
    youtubeUrl: null,
    isPublic: form.value.isPublic  // ✅ Visibility
  }

  try {
    // 1️⃣ ӘРҚашан Firebase-қа сақтау (My Recipes)
    await $addDoc($collection($db, 'recipes'), recipe)
    
    // 2️⃣ Тек Public болса MockAPI-ға сақтау (Home)
    if (form.value.isPublic) {
      await $fetch(`${MOCK_API_URL}/recipes`, {
        method: 'POST',
        body: recipe
      })
    }
    
    closeCreateModal()
  } catch (error) {
    console.error('Create error:', error)
  } finally {
    isLoading.value = false
  }
}



// UI
const closeCreateModal = () => {
  showCreateModal.value = false
  form.value = {
    title: '',
    category: '',
    area: '',
    imageUrl: '',
    instructions: '',
    ingredients: []
  }
}

const viewRecipe = (recipe) => {
  viewedRecipe.value = { ...recipe }
}

const deleteUserRecipe = async (id) => {
  isLoading.value = true
  try {
    // 1. Firebase-тан өшіру
    await $deleteDoc($doc($db, 'recipes', id))
    
    // 2. Егер favorites-та бар болса, өшіру
    await removeFromSaved(id)
    
    console.log('✅ Fully deleted!')
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    isLoading.value = false
  }
}




const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
  if (unsubscribeMyRecipes) unsubscribeMyRecipes()
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  setupUser()
  if (userId.value) {
    setTimeout(() => {
      loadMyRecipes()
      loadSavedRecipes()
    }, 500)
  }
})

onUnmounted(() => {
  if (unsubscribeMyRecipes) unsubscribeMyRecipes()
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
</style>