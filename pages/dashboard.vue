<template>
  <div class="min-h-screen flex bg-[#588157]">
    <!-- SIDEBAR -->
<aside
  :class="[
    'h-screen sticky top-0 flex flex-col text-white shadow-xl transition-all duration-300 bg-[#588157]',
    isSidebarOpen ? 'w-64' : 'w-20'
  ]"
>
  <!-- Brand + toggle -->
  <div class="h-20 flex items-center justify-between px-4 border-b border-white/10">
    <h1 v-if="isSidebarOpen" class="text-xl font-bold tracking-wide text-[#fca311]/90">
      Recipes
    </h1>

    <button
      class="text-white/80 hover:text-white hover:text-[#fca311]"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      <span v-if="isSidebarOpen">⟨</span>
      <span v-else>⟩</span>
    </button>
  </div>

  <!-- Menu -->
  <nav class="flex-1 py-6 space-y-1">
    <button
      v-for="item in menuItems"
      :key="item.key"
      @click="item.type === 'route'
        ? router.push(item.to)
        : (activeTab = item.key)"
      class="relative w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-white/10"
    >
      <!-- Active background -->
      <span
        v-if="item.type === 'tab'"
        class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1]/90 shadow-md transition-transform duration-200"
        :class="activeTab === item.key && isSidebarOpen
          ? 'translate-x-0 bg-[#fca311]/20'
          : '-translate-x-full'"
      ></span>

      <!-- Icon -->
      <span
        class="relative z-10 text-lg transition-colors"
        :class="activeTab === item.key ? 'text-[#fca311]' : 'text-white/90 hover:text-[#fca311]/90'"
      >
        {{ item.icon }}
      </span>

      <!-- Label -->
      <span
        v-if="isSidebarOpen"
        class="relative z-10 transition-colors"
        :class="activeTab === item.key ? 'text-[#fca311]' : 'text-white/80 hover:text-[#fca311]/90'"
      >
        {{ item.label }}
      </span>
    </button>
  </nav>

  <!-- Bottom user + logout -->
  <div class="p-4 border-t border-white/10">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold ring-2 ring-[#fca311]/30">
        {{ userInitial }}
      </div>
      <div v-if="isSidebarOpen" class="text-sm">
        <p class="font-semibold text-[#fca311]/90">{{ userName }}</p>
        <p class="text-xs text-white/70">Logged in</p>
      </div>
    </div>

    <button
      @click="logout"
      class="flex items-center gap-2 text-xs text-emerald-50 hover:text-[#fca311] transition-colors"
    >
      <span>⏻</span>
      <span v-if="isSidebarOpen">Logout</span>
    </button>
  </div>
</aside>

    <!-- MAIN PANEL -->
    <main class="flex-1 bg-[#f5f6f1] flex flex-col">
      <!-- Top bar -->
      <header class="h-20 border-b border-[#d0d3c8] flex items-center justify-end px-8 bg-white shadow-sm">
        <button class="flex items-center gap-3 group relative" @click="router.push('/profile')">
          <div class="w-16 h-16 rounded-full bg-[#588157] overflow-hidden shadow-md border-4 border-white ring-2 ring-[#fca311]/20 group-hover:ring-[#fca311]/40 transition-all duration-200">
            <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="Profile Avatar" />
            <div v-else class="w-full h-full flex items-center justify-center bg-white/20">
              <span class="text-sm font-bold text-white">{{ userInitial }}</span>
            </div>
          </div>
        </button>
      </header>

      <!-- Content -->
      <section class="flex-1 p-8 overflow-y-auto">
        <!-- MY RECIPES -->
        <div v-if="activeTab === 'my-recipes'" class="space-y-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-semibold bg-gradient-to-r from-[#31572c] to-[#fca311]/60 bg-clip-text text-transparent">My Recipes</h3>
            <button
              @click="showCreateModal = true"
              class="relative inline-flex items-center gap-2 px-8 py-3 rounded-full
                     text-white text-sm font-medium
                     bg-gradient-to-r from-[#588157] via-[#6aa56a]/90 to-[#fca311]/70
                     shadow-[0_10px_25px_rgba(88,129,87,0.4)]
                     hover:shadow-[0_14px_30px_rgba(252,163,17,0.4)]
                     hover:to-[#fca311]/90
                     transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fca311]/80"
            >
              <span>Create recipe</span>
              <span class="text-lg leading-none">→</span>
            </button>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
            <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#fca311] rounded-full animate-spin"></div>
            <p class="text-[#6c7570]">Loading recipes...</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="recipe in myRecipes" :key="recipe.id" 
     class="bg-white rounded-3xl shadow-sm border border-[#d0d3c8]/50 hover:border-[#fca311]/30 hover:shadow-md hover:shadow-[#fca311]/10 overflow-hidden flex flex-col relative group transition-all duration-200">
             <div v-if="isNewRecipe(recipe)" 
       class="absolute top-3 left-3 z-20 bg-gradient-to-r from-[#fca311] to-[#f7931e] 
              text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg 
              animate-pulse border-2 border-white/80 ring-1 ring-[#fca311]/50">
    NEW
  </div>

  <div class="h-40 bg-[#a3b18a] overflow-hidden pt-2 pl-2 group-hover:ring-2 group-hover:ring-[#fca311]/30 transition-all duration-200">
    <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.title" 
         class="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300"/>
  </div>
              <div class="p-4 flex-1 flex flex-col gap-2">
                <h4 class="font-semibold text-[#31572c] line-clamp-2 hover:text-[#fca311]/90 transition-colors">{{ recipe.title }}</h4>
                <p class="text-xs text-[#6c7570]">{{ recipe.area }} • {{ recipe.category }}</p>
                <p class="text-xs text-[#6c7570] line-clamp-3">{{ recipe.instructions }}</p>
                <div class="mt-auto flex gap-2 pt-2">
                  <button @click="openEditModal(recipe)" class="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#588157] to-[#fca311]/60 text-white text-xs font-semibold hover:from-[#476747] hover:to-[#fca311]/80 transition-all duration-200">
                    Edit
                  </button>
                  <button @click="deleteUserRecipe(recipe.id)" class="px-3 py-2 rounded-xl bg-gradient-to-r from-[#bc4749] to-[#fca311]/20 text-white text-xs font-semibold hover:from-[#a33a3d] hover:to-[#fca311]/40 transition-all duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVED -->
        <div v-else-if="activeTab === 'saved'" class="space-y-6 ">
          <h3 class="text-xl font-semibold bg-gradient-to-r from-[#31572c] to-[#fca311]/60 bg-clip-text text-transparent mb-2">Saved Recipes ({{ savedRecipes.length }})</h3>

          <div v-if="isLoadingSaved" class="flex items-center justify-center py-20 ">
            <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#fca311] rounded-full animate-spin"></div>
          </div>

          <div v-else-if="savedRecipes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <button v-for="recipe in savedRecipes" :key="recipe.id" @click="viewRecipe(recipe)" class="bg-transparent text-left group hover:scale-[1.02] transition-all duration-200">
              <div class="relative mt-12 bg-white rounded-3xl shadow-md hover:shadow-xl hover:shadow-[#fca311]/20 w-full pt-10 pb-4 px-4 flex flex-col items-center ring-1 ring-transparent group-hover:ring-[#fca311]/20 transition-all duration-300">
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0] group-hover:border-[#fca311]/40 group-hover:shadow-[#fca311]/20 transition-all duration-200">
                  <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <div class="mt-12 w-full text-center flex flex-col gap-2">
                  <h3 class="text-sm font-semibold text-slate-900 leading-snug group-hover:text-[#fca311]/90 transition-colors">{{ recipe.title }}</h3>
                  <p class="text-[11px] text-slate-400">{{ recipe.category }} • {{ recipe.area }}</p>
                </div>
                <div class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden ">
                  <a v-if="recipe.youtubeUrl" :href="recipe.youtubeUrl" target="_blank" rel="noopener noreferrer" @click.stop
                     class="flex-1 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-[#588157] to-[#fca311]/70 hover:from-[#476947] hover:to-[#fca311] transition-all duration-200">
                    YouTube video
                  </a>
                  <div v-else class="flex-1 bg-gradient-to-r from-[#588157] to-[#fca311]/40 opacity-60"></div>
                  <button @click.stop="removeFromSaved(recipe.id)"
                          class="w-24 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-[#bc4749] to-[#fca311]/30 hover:from-[#a33a3d] hover:to-[#fca311]/50 border-l border-white/40 transition-all duration-200">
                    Delete
                  </button>
                </div>
              </div>
            </button>
          </div>

          <p v-else class="text-center text-[#6c7570] py-10 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-2xl p-8 shadow-sm">
            No saved recipes yet. Save some from home page! ✨
          </p>
        </div>
      </section>
    </main>

    <!-- CREATE MODAL -->
    <transition name="fade">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeCreateModal">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ring-2 ring-[#fca311]/20">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-gradient-to-r from-[#f5f6f1] to-[#fca311]/5">
            <h3 class="text-lg font-semibold text-[#31572c]">Create Recipe</h3>
            <button @click="closeCreateModal" class="text-[#6c7570] hover:text-[#fca311] transition-colors">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input v-model="form.title" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input v-model="form.category" placeholder="e.g. Beef" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input v-model="form.area" placeholder="e.g. Italian" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input v-model="form.imageUrl" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Ingredients (one per line)</label>
              <textarea v-model="ingredientsText" rows="3" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea v-model="form.instructions" rows="4" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">YouTube Link</label>
              <input v-model="form.youtubeUrl" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
            </div>
            <div class="flex items-center gap-3 pt-2">
              <label class="text-xs font-semibold text-[#31572c] flex items-center gap-2">
                <input type="checkbox" v-model="form.isPublic" class="w-4 h-4 rounded focus:ring-[#fca311]"/>
                <span>Public (show on Home)</span>
              </label>
              <span class="text-xs text-[#6c7570]">(Only You = private)</span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-gradient-to-r from-[#f5f6f1] to-[#fca311]/5 flex justify-end gap-3">
            <button @click="closeCreateModal" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-[#fca311]/10 transition-all">Cancel</button>
            <button @click="createRecipe" class="px-5 py-2 rounded-xl text-sm bg-gradient-to-r from-[#588157] to-[#fca311]/70 text-white font-semibold hover:from-[#476747] hover:to-[#fca311] shadow-md hover:shadow-lg transition-all duration-200">Save</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- EDIT MODAL -->
    <transition name="fade">
      <div v-if="showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showEditModal = false">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ring-2 ring-[#fca311]/20">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-gradient-to-r from-[#f5f6f1] to-[#fca311]/5">
            <h3 class="text-lg font-semibold text-[#31572c]">Edit Recipe</h3>
            <button @click="showEditModal = false" class="text-[#6c757d] hover:text-[#fca311] transition-colors">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input v-model="editForm.title" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input v-model="editForm.category" placeholder="e.g. Beef" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input v-model="editForm.area" placeholder="e.g. Italian" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input v-model="editForm.imageUrl" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Ingredients (one per line)</label>
              <textarea v-model="editIngredientsText" rows="3" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea v-model="editForm.instructions" rows="4" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">YouTube Link</label>
              <input v-model="editForm.youtubeUrl" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fca311]/80 transition-all" />
            </div>
            <div class="flex items-center gap-3 pt-2">
              <label class="text-xs font-semibold text-[#31572c] flex items-center gap-2">
                <input type="checkbox" v-model="editForm.isPublic" class="w-4 h-4 rounded focus:ring-[#fca311]"/>
                <span>Public (show on Home)</span>
              </label>
              <span class="text-xs text-[#6c7570]">(Only You = private)</span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-gradient-to-r from-[#f5f6f1] to-[#fca311]/5 flex justify-end gap-3">
            <button @click="showEditModal = false" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-[#fca311]/10 transition-all">Cancel</button>
            <button @click="saveEditedRecipe" class="px-5 py-2 rounded-xl text-sm bg-gradient-to-r from-[#588157] to-[#fca311]/70 text-white font-semibold hover:from-[#476747] hover:to-[#fca311] shadow-md hover:shadow-lg transition-all duration-200">Save</button>
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
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const isSidebarOpen = ref(true)
// STATE
const activeTab = ref('my-recipes')
const userId = ref('')
const userName = ref('')
const avatarUrl = ref('')
const isLoading = ref(false)
const isLoadingSaved = ref(false)
const myRecipes = ref([])
const savedRecipes = ref([])

// FORM STATE
const form = ref({ title:'', category:'', area:'', imageUrl:'', instructions:'', ingredients:[], youtubeUrl:'', isPublic:true })
const editForm = ref({ id:'', title:'', category:'', area:'', imageUrl:'', instructions:'', ingredients:[], youtubeUrl:'', isPublic:true })

const ingredientsText = computed({
  get: () => form.value.ingredients.join('\n'),
  set: v => form.value.ingredients = v.split('\n').map(s => s.trim()).filter(Boolean)
})

const editIngredientsText = ref('')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const viewedRecipe = ref(null)

const userInitial = computed(() => userName.value ? userName.value[0]?.toUpperCase() : 'U')

const menuItems = [
  { key: 'home', label: ' Home', type: 'route', to: '/' },
  { key: 'my-recipes', label: ' My recipes', type: 'tab'},
  { key: 'saved', label: ' Saved', type: 'tab' }
]

// SETUP USER
const setupUser = () => {
  if (typeof window !== 'undefined') {
    userId.value = localStorage.getItem('userId') || ''
    userName.value = localStorage.getItem('userName') || 'User'
    avatarUrl.value = localStorage.getItem('avatarUrl') || ''
  }
}

// LOAD MY RECIPES
const loadMyRecipes = async () => {
  if (!userId.value) return myRecipes.value = []
  isLoading.value = true
  try {
    myRecipes.value = await $fetch(
      `${MOCK_API_URL}/recipes?userId=${userId.value}&sortBy=createdAt&order=desc`
    )
  } catch (e) {
    myRecipes.value = []
  } finally {
    isLoading.value = false
  }
}

// LOAD SAVED RECIPES
const loadSavedRecipes = async () => {
  if(!userId.value) return savedRecipes.value=[]
  isLoadingSaved.value=true
  try {
    const favorites = await $fetch(`${MOCK_API_URL}/favorites?userId=${userId.value}`).catch(()=>[])
    const recipesResponse = await $fetch(`${MOCK_API_URL}/recipes`).catch(()=>[])
    savedRecipes.value = recipesResponse.filter(r => favorites.some(f => f.recipeId === r.id))
  } catch(e){ savedRecipes.value=[] }
  finally{ isLoadingSaved.value=false }
}

// REMOVE SAVED
const removeFromSaved = async (recipeId) => {
  if(!userId.value) return
  isLoadingSaved.value=true
  try {
    const favorites = await $fetch(`${MOCK_API_URL}/favorites?userId=${userId.value}&recipeId=${recipeId}`).catch(()=>[])
    for(const fav of favorites) await $fetch(`${MOCK_API_URL}/favorites/${fav.id}`, { method:'DELETE' })
    await loadSavedRecipes()
  } catch(e){ console.error(e) }
  finally{ isLoadingSaved.value=false }
}

// CREATE RECIPE
const createRecipe = async () => {
  if (!form.value.title || !userId.value) return
  isLoading.value = true

  const recipe = {
    id: Date.now().toString(),
    userId: userId.value,
    ...form.value,
    createdAt: new Date().toISOString()
  }

  try {
    // серверге жібереміз
    await $fetch(`${MOCK_API_URL}/recipes`, {
      method: 'POST',
      body: recipe
    })

    // 🔥 локалды тізімнің БАСЫНА қосамыз
    myRecipes.value.unshift(recipe)

    // модалды жабу, форманы тазалау
    closeCreateModal()
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

// DELETE RECIPE
const deleteUserRecipe = async (id) => {
  isLoading.value=true
  try { await $fetch(`${MOCK_API_URL}/recipes/${id}`, { method:'DELETE' }); await loadMyRecipes() }
  catch(e){ console.error(e) }
  finally{ isLoading.value=false }
}

// VIEW RECIPE
const viewRecipe = (recipe) => { viewedRecipe.value = { ...recipe } }

// CLOSE CREATE MODAL
const closeCreateModal = () => { 
  showCreateModal.value=false; 
  form.value={ title:'', category:'', area:'', imageUrl:'', instructions:'', ingredients:[], youtubeUrl:'', isPublic:true } 
}

// LOGOUT
const logout = () => { 
  if(typeof window!=='undefined') localStorage.clear(); 
  router.push('/login') 
}

// EDIT RECIPE
const openEditModal = (recipe) => {
  editForm.value = { ...recipe }
  editIngredientsText.value = (recipe.ingredients || []).join('\n')
  showEditModal.value = true
}

const saveEditedRecipe = async () => {
  editForm.value.ingredients = editIngredientsText.value.split('\n').map(s=>s.trim()).filter(Boolean)
  isLoading.value = true
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${editForm.value.id}`, { method:'PUT', body: editForm.value })
    showEditModal.value = false
    await loadMyRecipes()
  } catch(e){ console.error(e) }
  finally{ isLoading.value = false }
}

// Бұл функцияны <script setup> ішіне қосыңыз
const isNewRecipe = (recipe) => {
  if (!recipe.createdAt) return false
  const createdDate = new Date(recipe.createdAt)
  const now = new Date()
  return (now - createdDate) < 7 * 24 * 60 * 60 * 1000 // 7 күн
}

// LIFECYCLE
onMounted(()=>{
  setupUser()
  if(userId.value){ setTimeout(()=>{ loadMyRecipes(); loadSavedRecipes() }, 500) }
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
