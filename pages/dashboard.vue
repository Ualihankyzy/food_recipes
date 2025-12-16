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
          @click="item.type === 'route' ? router.push(item.to) : (activeTab = item.key)"
          class="relative w-full flex items-center gap-3 pl-6 pr-4 py-3 text-left text-sm font-medium transition-colors duration-200"
          :class="[item.type === 'tab' && activeTab === item.key ? 'text-[#31572c]' : 'text-white/80 hover:text-white']"
        >
          <span v-if="item.type === 'tab'" class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200"
            :class="activeTab === item.key ? 'translate-x-0' : '-translate-x-full'"></span>
          <span class="relative z-10 text-lg">{{ item.icon }}</span>
          <span class="relative z-10">{{ item.label }}</span>
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
        <button @click="logout" class="w-full mt-2 flex items-center gap-2 text-sm text-emerald-50 hover:text-white">
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- MAIN PANEL -->
    <main class="flex-1 bg-[#f5f6f1] flex flex-col">
      <!-- Top bar -->
      <header class="h-20 border-b border-[#d0d3c8] flex items-center justify-end px-8 bg-white">
        <button class="flex items-center gap-3 group" @click="router.push('/profile')">
          <div class="w-16 h-16 rounded-full bg-[#588157] overflow-hidden shadow-md border-4 border-white">
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
            </button>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
            <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
            <p class="text-[#6c7570]">Loading recipes...</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="recipe in myRecipes" :key="recipe.id" 
     class="bg-white rounded-3xl shadow-sm border border-[#d0d3c8] overflow-hidden flex flex-col relative group">
             <div v-if="isNewRecipe(recipe)" 
       class="absolute top-3 left-3 z-20 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] 
              text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg 
              animate-pulse border-2 border-white/80">
    NEW
  </div>

  <div class="h-40 bg-[#a3b18a] overflow-hidden pt-2 pl-2"> <!-- padding қостым -->
    <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.title" 
         class="w-full h-full object-cover rounded-2xl"/>
  </div>
              <div class="p-4 flex-1 flex flex-col gap-2">
                <h4 class="font-semibold text-[#31572c] line-clamp-2">{{ recipe.title }}</h4>
                <p class="text-xs text-[#6c7570]">{{ recipe.area }} • {{ recipe.category }}</p>
                <p class="text-xs text-[#6c7570] line-clamp-3">{{ recipe.instructions }}</p>
                <div class="mt-auto flex gap-2 pt-2">
                  <button @click="openEditModal(recipe)" class="flex-1 px-3 py-2 rounded-xl bg-[#588157] text-white text-xs font-semibold hover:bg-[#476747]">
                    Edit
                  </button>
                  <button @click="deleteUserRecipe(recipe.id)" class="px-3 py-2 rounded-xl bg-[#bc4749] text-white text-xs font-semibold hover:bg-[#a33a3d]">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVED -->
        <div v-else-if="activeTab === 'saved'" class="space-y-6 ">
          <h3 class="text-xl font-semibold text-[#31572c] mb-2">Saved Recipes ({{ savedRecipes.length }})</h3>

          <div v-if="isLoadingSaved" class="flex items-center justify-center py-20 ">
            <div class="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
          </div>

          <div v-else-if="savedRecipes.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <button v-for="recipe in savedRecipes" :key="recipe.id" @click="viewRecipe(recipe)" class="bg-transparent text-left">
              <div class=" relative mt-28 bg-white rounded-3xl shadow-md w-full pt-10 pb-4 px-4 flex flex-col items-center">
                <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]">
                  <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover" />
                </div>
                <div class="mt-12 w-full text-center flex flex-col gap-2">
                  <h3 class="text-sm font-semibold text-slate-900 leading-snug">{{ recipe.title }}</h3>
                  <p class="text-[11px] text-slate-400">{{ recipe.category }} • {{ recipe.area }}</p>
                </div>
                <div class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden ">
                  <a v-if="recipe.youtubeUrl" :href="recipe.youtubeUrl" target="_blank" rel="noopener noreferrer" @click.stop
                     class="flex-1 flex items-center justify-center text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947]">
                    YouTube video
                  </a>
                  <div v-else class="flex-1 bg-[#588157] opacity-60"></div>
                  <button @click.stop="removeFromSaved(recipe.id)"
                          class="w-24 flex items-center justify-center text-xs font-semibold text-white bg-[#bc4749] hover:bg-[#a33a3d] border-l border-white/40">
                    Delete
                  </button>
                </div>
              </div>
            </button>
          </div>

          <p v-else class="text-center text-[#6c7570] py-10">
            No saved recipes yet. Save some from home page! ✨
          </p>
        </div>
      </section>
    </main>

    <!-- CREATE MODAL -->
    <transition name="fade">
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeCreateModal">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">Create Recipe</h3>
            <button @click="closeCreateModal" class="text-[#6c7570] hover:text-black">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input v-model="form.title" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input v-model="form.category" placeholder="e.g. Beef" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input v-model="form.area" placeholder="e.g. Italian" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input v-model="form.imageUrl" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Ingredients (one per line)</label>
              <textarea v-model="ingredientsText" rows="3" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea v-model="form.instructions" rows="4" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">YouTube Link</label>
              <input v-model="form.youtubeUrl" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div class="flex items-center gap-3 pt-2">
              <label class="text-xs font-semibold text-[#31572c] flex items-center gap-2">
                <input type="checkbox" v-model="form.isPublic" class="w-4 h-4 rounded"/>
                <span>Public (show on Home)</span>
              </label>
              <span class="text-xs text-[#6c7570]">(Only You = private)</span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button @click="closeCreateModal" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white">Cancel</button>
            <button @click="createRecipe" class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747]">Save</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- EDIT MODAL -->
    <transition name="fade">
      <div v-if="showEditModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="showEditModal = false">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]">
            <h3 class="text-lg font-semibold text-[#31572c]">Edit Recipe</h3>
            <button @click="showEditModal = false" class="text-[#6c7570] hover:text-black">✕</button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Title</label>
              <input v-model="editForm.title" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Category</label>
                <input v-model="editForm.category" placeholder="e.g. Beef" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-[#31572c] mb-1">Area</label>
                <input v-model="editForm.area" placeholder="e.g. Italian" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Image URL</label>
              <input v-model="editForm.imageUrl" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Ingredients (one per line)</label>
              <textarea v-model="editIngredientsText" rows="3" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">Instructions</label>
              <textarea v-model="editForm.instructions" rows="4" class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#31572c] mb-1">YouTube Link</label>
              <input v-model="editForm.youtubeUrl" placeholder="https://youtube.com/..." class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]" />
            </div>
            <div class="flex items-center gap-3 pt-2">
              <label class="text-xs font-semibold text-[#31572c] flex items-center gap-2">
                <input type="checkbox" v-model="editForm.isPublic" class="w-4 h-4 rounded"/>
                <span>Public (show on Home)</span>
              </label>
              <span class="text-xs text-[#6c7570]">(Only You = private)</span>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3">
            <button @click="showEditModal = false" class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white">Cancel</button>
            <button @click="saveEditedRecipe" class="px-5 py-2 rounded-xl text-sm bg-[#588157] text-white font-semibold hover:bg-[#476747]">Save</button>
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
const closeCreateModal = () => { showCreateModal.value=false; form.value={ title:'', category:'', area:'', imageUrl:'', instructions:'', ingredients:[], youtubeUrl:'', isPublic:true } }

// LOGOUT
const logout = () => { if(typeof window!=='undefined') localStorage.clear(); router.push('/login') }

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