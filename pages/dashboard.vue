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
    <p class="text-[#6c7570]">Рецепттерді жүктеу... 🚀</p>
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
       <div v-else-if="activeTab === 'saved'" class="space-y-6">
  <h3 class="text-xl font-semibold text-[#31572c]">Saved Recipes ({{ savedRecipes.length }})</h3>
  
  <div v-if="savedRecipes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="recipe in savedRecipes" :key="recipe.id" class="bg-white rounded-3xl p-6 text-center">
      <h4>{{ recipe.title }}</h4>
      <button @click="viewRecipe(recipe)" class="mt-4 px-4 py-2 bg-[#588157] text-white rounded-xl">View</button>
    </div>
  </div>
  
  <p v-else class="text-center text-[#6c7570] py-10">Home page-де Save басыңыз!</p>
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
        @click.self="closeCreate"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">Create Recipe</h3>
            <button @click="closeCreate" class="text-[#6c7570] hover:text-black">✕</button>
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
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button
              @click="closeCreate"
              class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white"
            >
              Cancel
            </button>
            <button
              @click="createLocalRecipe"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 🔥 Firebase imports
const { $db, $collection, $addDoc, $deleteDoc, $doc, $onSnapshot, $query, $where } = useNuxtApp()

// tabs
const activeTab = ref('my-recipes')

const menuItems = [
  { key: 'home', label: 'Home', type: 'route', to: '/' },
  { key: 'my-recipes', label: 'My recipes', type: 'tab' },
  { key: 'saved', label: 'Saved', type: 'tab' }
]

const activeTabTitle = computed(() => {
  if (activeTab.value === 'my-recipes') return 'My Recipes'
  if (activeTab.value === 'saved') return 'Saved Recipes'
  return 'Dashboard'
})

// user info
const isAuth = ref(false)
const userId = ref('')
const userName = ref('')
const avatarUrl = ref('')
const userInitial = computed(() =>
  userName.value ? userName.value[0]?.toUpperCase() : 'U'
)

// 🔥 LOADING + RECIPES
const isLoading = ref(false)
const myRecipes = ref([])
let unsubscribe = null
const viewedRecipe = ref(null)  // 🔥 VIEWED_RECIPE ref қосылды!

// create modal
const showCreateModal = ref(false)
const form = ref({
  title: '',
  category: '',
  area: '',
  imageUrl: '',
  instructions: '',
  ingredients: []
})

const ingredientsText = computed({
  get: () => form.value.ingredients.join('\n'),
  set: v => {
    form.value.ingredients = v
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
  }
})

// 🔥 LOADING + Firebase: User рецепттерін жүктеу
const loadUserRecipes = async () => {
  if (unsubscribe) unsubscribe()
  
  isLoading.value = true  // 🔥 LOADING ON
  
  if (!userId.value) {
    isLoading.value = false
    return
  }
  
  try {
    const q = $query(
      $collection($db, 'recipes'), 
      $where('userId', '==', userId.value)
    )
    
    unsubscribe = $onSnapshot(q, (snapshot) => {
      myRecipes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      isLoading.value = false  // 🔥 LOADING OFF
    })
  } catch (error) {
    console.error('Рецепттерді жүктеу қатесі:', error)
    isLoading.value = false
  }
}

const closeCreate = () => {
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

// 🔥 Firebase: рецепт жасау
const createLocalRecipe = async () => {
  if (!form.value.title || !userId.value) return
  
  isLoading.value = true
  
  const recipe = {
    userId: userId.value,
    title: form.value.title,
    category: form.value.category,
    area: form.value.area,
    imageUrl: form.value.imageUrl,
    instructions: form.value.instructions,
    ingredients: form.value.ingredients,
    createdAt: new Date().toISOString()
  }
  
  try {
    await $addDoc($collection($db, 'recipes'), recipe)
    closeCreate()
  } catch (error) {
    console.error('Рецепт сақтау қатесі:', error)
  } finally {
    isLoading.value = false
  }
}

// 🔥 VIEW RECIPE - түзетілді!
const viewRecipe = (recipe) => {
  viewedRecipe.value = { ...recipe }
  console.log('View recipe:', recipe)  // debug
}

const deleteUserRecipe = async (id) => {
  isLoading.value = true
  try {
    await $deleteDoc($doc($db, 'recipes', id))
  } catch (error) {
    console.error('Рецепт өшіру қатесі:', error)
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    if (unsubscribe) unsubscribe()
    router.push('/login')
  }
}

const initAuth = () => {
  userId.value = localStorage.getItem('userId') || ''
  userName.value = localStorage.getItem('userName') || 'User'
  isAuth.value = localStorage.getItem('isAuth') === 'true'
  
  if (isAuth.value && userId.value) {
    loadUserRecipes()
    loadSavedRecipes()  // 🔥 SAVED!
  }
}
// Cleanup
onMounted(() => {
  initAuth()  // 🔥 localStorage + recipes load
})

const savedRecipes = ref([])
const loadSavedRecipes = async () => {
  if (!userId.value) return
  try {
    // MockAPI favorites
    savedRecipes.value = await $fetch(`https://68448e3771eb5d1be033990d.mockapi.io/api/v1/favorites?userId=${userId.value}`)
    savedRecipes.value = savedRecipes.value.map(fav => ({
      id: fav.recipeId,
      title: 'Saved recipe',  // Home-дан title алу керек
      // ... басқа fields
    }))
  } catch(e) {
    console.error('Saved recipes error:', e)
  }
}
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
