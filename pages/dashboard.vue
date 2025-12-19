<template>
  <div class="min-h-screen w-full bg-[#588157]">
    <header
      class="md:hidden flex items-center justify-between px-4 h-14 text-white"
    >
      <h1 class="text-lg font-bold">Recipes</h1>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full border border-white/40 hover:bg-white/10"
        @click="isMobileMenuOpen = true"
      >
        ☰
      </button>
    </header>

    <div class="flex flex-col md:flex-row min-h-screen">
      <aside
        :class="[
          'hidden md:flex h-screen sticky top-0 flex-col text-white shadow-xl transition-all duration-300 bg-[#588157]',
          isSidebarOpen ? 'w-64' : 'w-20'
        ]"
      >
        <div
          class="h-20 flex items-center justify-between px-4 border-b border-white/10"
        >
          <h1 v-if="isSidebarOpen" class="text-xl font-bold tracking-wide">
            Recipes
          </h1>
          <button
            class="text-white/80 hover:text-white"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <span v-if="isSidebarOpen">⟨</span>
            <span v-else>⟩</span>
          </button>
        </div>

        <nav class="flex-1 py-6 space-y-1 overflow-y-auto">
          <button
            v-for="item in menuItems"
            :key="item.key"
            @click="
              item.type === 'route'
                ? router.push(item.to)
                : (activeTab = item.key)
            "
            class="relative w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors"
          >
            <span
              v-if="item.type === 'tab'"
              class="absolute inset-y-0 left-0 w-[220px] rounded-r-full bg-[#f5f6f1] shadow-md transition-transform duration-200"
              :class="
                activeTab === item.key && isSidebarOpen
                  ? 'translate-x-0'
                  : '-translate-x-full'
              "
            ></span>

            <span
              class="relative z-10 text-lg"
              :class="
                activeTab === item.key ? 'text-[#31572c]' : 'text-white/90'
              "
            >
              {{ item.icon }}
            </span>

            <span
              v-if="isSidebarOpen"
              class="relative z-10"
              :class="
                activeTab === item.key ? 'text-[#31572c]' : 'text-white/80'
              "
            >
              {{ item.label }}
            </span>
          </button>
        </nav>

        <div class="p-4 border-t border-white/10">
      

          <button
            @click="logout"
            class="flex items-center gap-2 text-xs text-emerald-50 hover:text-white"
          >
            <span>⏻</span>
            <span v-if="isSidebarOpen">Logout</span>
          </button>
        </div>
      </aside>

      <main class="flex-1 bg-[#f5f6f1] flex flex-col">
        <header
          class="h-16 md:h-20 border-b border-[#d0d3c8] flex items-center justify-end px-4 md:px-8 bg-white"
        >
          <button
            class="flex items-center gap-3 group"
            @click="router.push('/profile')"
          >
            <div
              class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#588157] overflow-hidden shadow-md border-4 border-white"
            >
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                class="w-full h-full object-cover"
                alt="Profile Avatar"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-white/20"
              >
                <span class="text-sm font-bold text-white">
                  {{ userInitial }}
                </span>
              </div>
            </div>
          </button>
        </header>

        <section class="flex-1 p-4 md:p-8 overflow-y-auto">
          <div v-if="activeTab === 'my-recipes'" class="space-y-6">
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2"
            >
              <h3 class="text-lg md:text-xl font-semibold text-[#31572c]">
                My Recipes
              </h3>
              <button
                @click="showCreateModal = true"
                class="relative inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-full text-white text-sm font-medium bg-gradient-to-r from-[#588157] via-[#6aa56a] to-[#88c17f] shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.35)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#588157]"
              >
                <span>Create recipe</span>
                <span class="text-lg leading-none">→</span>
              </button>
            </div>

            <div
              v-if="isLoading"
              class="flex flex-col items-center justify-center py-16 space-y-4"
            >
              <div
                class="w-10 h-10 md:w-12 md:h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"
              ></div>
              <p class="text-[#6c7570] text-sm md:text-base">
                Loading recipes...
              </p>
            </div>

            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <div
                v-for="recipe in myRecipes"
                :key="recipe.id"
                class="bg-white rounded-3xl shadow-sm border border-[#d0d3c8] overflow-hidden flex flex-col relative group"
              >
                <div
                  v-if="isNewRecipe(recipe)"
                  class="absolute top-3 left-3 z-20 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white/80"
                >
                  NEW
                </div>

                <div class="h-40 bg-[#a3b18a] overflow-hidden pt-2 pl-2">
                  <img
                    v-if="recipe.imageUrl"
                    :src="recipe.imageUrl"
                    :alt="recipe.title"
                    class="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div class="p-4 flex-1 flex flex-col gap-2">
                  <h4
                    class="font-semibold text-[#31572c] text-sm md:text-base line-clamp-2"
                  >
                    {{ recipe.title }}
                  </h4>
                  <p class="text-[11px] text-[#6c7570]">
                    {{ recipe.area }} • {{ recipe.category }}
                  </p>
                  <p
                    class="text-[11px] text-[#6c7570] line-clamp-3 leading-snug"
                  >
                    {{ recipe.instructions }}
                  </p>
                  <div class="mt-auto flex gap-2 pt-2">
                    <button
                      @click="openEditModal(recipe)"
                      class="flex-1 px-3 py-2 rounded-xl bg-[#588157] text-white text-xs font-semibold hover:bg-[#476747]"
                    >
                      Edit
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

          <div v-else-if="activeTab === 'saved'" class="space-y-6">
            <h3 class="text-lg md:text-xl font-semibold text-[#31572c] mb-2">
              Saved Recipes ({{ savedRecipes.length }})
            </h3>

            <div
              v-if="isLoadingSaved"
              class="flex items-center justify-center py-16"
            >
              <div
                class="w-10 h-10 md:w-12 md:h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"
              ></div>
            </div>

            <div
              v-else-if="savedRecipes.length"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <button
                v-for="recipe in savedRecipes"
                :key="recipe.id"
                @click="viewRecipe(recipe)"
                class="bg-transparent text-left"
              >
                <div
                  class="relative mt-10 bg-white rounded-3xl shadow-md w-full pt-10 pb-4 px-4 flex flex-col items-center"
                >
                  <div
                    class="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md border-4 border-[#f5f5f0]"
                  >
                    <img
                      :src="recipe.imageUrl"
                      :alt="recipe.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    class="mt-10 md:mt-12 w-full text-center flex flex-col gap-2"
                  >
                    <h3
                      class="text-sm font-semibold text-slate-900 leading-snug"
                    >
                      {{ recipe.title }}
                    </h3>
                    <p class="text-[11px] text-slate-400">
                      {{ recipe.category }} • {{ recipe.area }}
                    </p>
                  </div>
                  <div
                    class="mt-4 w-full h-10 flex rounded-b-3xl overflow-hidden"
                  >
                    <a
                      v-if="recipe.youtubeUrl"
                      :href="recipe.youtubeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click.stop
                      class="flex-1 flex items-center justify-center text-[11px] md:text-xs font-semibold text-white bg-[#588157] hover:bg-[#476947]"
                    >
                      YouTube video
                    </a>
                    <div v-else class="flex-1 bg-[#588157] opacity-60"></div>
                    <button
                      @click.stop="removeFromSaved(recipe.id)"
                      class="w-20 md:w-24 flex items-center justify-center text-[11px] md:text-xs font-semibold text-white bg-[#bc4749] hover:bg-[#a33a3d] border-l border-white/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </button>
            </div>

            <p
              v-else
              class="text-center text-[#6c7570] py-10 text-sm md:text-base"
            >
              No saved recipes yet. Save some from the home page!
            </p>
          </div>
        </section>
      </main>
    </div>

    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 flex md:hidden"
      >
        <div
          class="flex-1 bg-black/50"
          @click="isMobileMenuOpen = false"
        ></div>

        <aside
          class="w-64 max-w-[80vw] bg-[#588157] text-white shadow-2xl h-full flex flex-col"
        >
          <div
            class="h-14 flex items-center justify-between px-4 border-b border-white/10"
          >
            <h2 class="text-lg font-bold">Menu</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              @click="isMobileMenuOpen = false"
            >
              ✕
            </button>
          </div>

          <nav class="flex-1 py-4 space-y-1 overflow-y-auto">
            <button
              v-for="item in menuItems"
              :key="'mobile-' + item.key"
              @click="
                () => {
                  if (item.type === 'route') {
                    router.push(item.to)
                  } else {
                    activeTab = item.key
                  }
                  isMobileMenuOpen = false
                }
              "
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-white/10"
            >
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          </nav>

          <div class="p-4 border-t border-white/10">
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold"
              >
                {{ userInitial }}
              </div>
              <div class="text-xs">
                <p class="font-semibold">{{ userName }}</p>
                <p class="text-[11px] text-white/70">Logged in</p>
              </div>
            </div>
            <button
              @click="logout"
              class="flex items-center gap-2 text-xs text-emerald-50 hover:text-white"
            >
              <span>⏻</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="closeCreateModal"
      >
        <div
          class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div
            class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]"
          >
            <h3 class="text-lg font-semibold text-[#31572c]">
              Create Recipe
            </h3>
            <button
              @click="closeCreateModal"
              class="text-[#6c7570] hover:text-black"
            >
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Title
              </label>
              <input
                v-model="form.title"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label
                  class="block text-xs font-semibold text-[#31572c] mb-1"
                >
                  Category
                </label>
                <input
                  v-model="form.category"
                  placeholder="e.g. Beef"
                  class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-semibold text-[#31572c] mb-1"
                >
                  Area
                </label>
                <input
                  v-model="form.area"
                  placeholder="e.g. Italian"
                  class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Image URL
              </label>
              <input
                v-model="form.imageUrl"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Ingredients (one per line)
              </label>
              <textarea
                v-model="ingredientsText"
                rows="3"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Instructions
              </label>
              <textarea
                v-model="form.instructions"
                rows="4"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                YouTube Link
              </label>
              <input
                v-model="form.youtubeUrl"
                placeholder="https://youtube.com/..."
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
        
          </div>
          <div
            class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3"
          >
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

    <transition name="fade">
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showEditModal = false"
      >
        <div
          class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div
            class="px-6 py-4 border-b border-[#d0d3c8] flex justify-between items-center bg-[#f5f6f1]"
          >
            <h3 class="text-lg font-semibold text-[#31572c]">
              Edit Recipe
            </h3>
            <button
              @click="showEditModal = false"
              class="text-[#6c7570] hover:text-black"
            >
              ✕
            </button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Title
              </label>
              <input
                v-model="editForm.title"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label
                  class="block text-xs font-semibold text-[#31572c] mb-1"
                >
                  Category
                </label>
                <input
                  v-model="editForm.category"
                  placeholder="e.g. Beef"
                  class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-semibold text-[#31572c] mb-1"
                >
                  Area
                </label>
                <input
                  v-model="editForm.area"
                  placeholder="e.g. Italian"
                  class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Image URL
              </label>
              <input
                v-model="editForm.imageUrl"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Ingredients (one per line)
              </label>
              <textarea
                v-model="editIngredientsText"
                rows="3"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                Instructions
              </label>
              <textarea
                v-model="editForm.instructions"
                rows="4"
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-[#31572c] mb-1"
              >
                YouTube Link
              </label>
              <input
                v-model="editForm.youtubeUrl"
                placeholder="https://youtube.com/..."
                class="w-full px-3 py-2 border border-[#d0d3c8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
   
          </div>
          <div
            class="px-6 py-4 border-t border-[#d0d3c8] bg-[#f5f6f1] flex justify-end gap-3"
          >
            <button
              @click="showEditModal = false"
              class="px-4 py-2 rounded-xl text-sm border border-[#d0d3c8] text-[#31572c] hover:bg-white"
            >
              Cancel
            </button>
            <button
              @click="saveEditedRecipe"
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
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const activeTab = ref('my-recipes')
const userId = ref('')
const userName = ref('')
const avatarUrl = ref('')
const isLoading = ref(false)
const isLoadingSaved = ref(false)
const myRecipes = ref([])
const savedRecipes = ref([])



// ✅ createRecipe - тек админге жібереді (home page-ге ЕШҚАШАН шықпайды!)
const createRecipe = async () => {
  if (!form.value.title?.trim() || !userId.value) {
    alert('Title міндетті!')
    return
  }

  isLoading.value = true
  try {
    const recipe = {
      id: Date.now().toString(),
      userId: userId.value,
      ...form.value,
      // ✅ ПАЯНА: pending status + isPublic: false (home page-ге шықпайды!)
      status: 'pending', 
      isPublic: false, 
      createdAt: new Date().toISOString()
    }

    await $fetch(`${MOCK_API_URL}/recipes`, {
      method: 'POST',
      body: recipe
    })

    // ✅ User-дың myRecipes-не қосамыз
    myRecipes.value.unshift(recipe)
    
    // ✅ АДМИН ПАНЕЛІНЕ АВТОМАТТЫҚ БАРАМЫЗ
    closeCreateModal()
    router.push('/admin/recipes')
    
    alert('✅ Рецепт админге жіберілді! Одобрения күтіңіз.')
    
  } catch (e) {
    console.error(e)
    alert('❌ Қате! Қайта көріңіз.')
  } finally {
    isLoading.value = false
  }
}



const editForm = ref({
  id: '',
  title: '',
  category: '',
  area: '',
  imageUrl: '',
  instructions: '',
  ingredients: [],
  youtubeUrl: '',
  isPublic: true
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

const editIngredientsText = ref('')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const viewedRecipe = ref(null)

const userInitial = computed(() =>
  userName.value ? userName.value[0]?.toUpperCase() : 'U'
)

const menuItems = [
  { key: 'home', label: 'Home', type: 'route', to: '/', icon: '🏠' },
  { key: 'my-recipes', label: 'My recipes', type: 'tab', icon: '📖' },
  { key: 'saved', label: 'Saved', type: 'tab', icon: '💾' }
]

const setupUser = () => {
  if (typeof window !== 'undefined') {
    userId.value = localStorage.getItem('userId') || ''
    userName.value = localStorage.getItem('userName') || 'User'
    avatarUrl.value = localStorage.getItem('avatarUrl') || ''
  }
}

const loadMyRecipes = async () => {
  if (!userId.value) {
    myRecipes.value = []
    return
  }
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

const loadSavedRecipes = async () => {
  if (!userId.value) {
    savedRecipes.value = []
    return
  }
  isLoadingSaved.value = true
  try {
    const favorites = await $fetch(
      `${MOCK_API_URL}/favorites?userId=${userId.value}`
    ).catch(() => [])
    const recipesResponse = await $fetch(
      `${MOCK_API_URL}/recipes`
    ).catch(() => [])
    savedRecipes.value = recipesResponse.filter(r =>
      favorites.some(f => f.recipeId === r.id)
    )
  } catch (e) {
    savedRecipes.value = []
  } finally {
    isLoadingSaved.value = false
  }
}

const removeFromSaved = async recipeId => {
  if (!userId.value) return
  isLoadingSaved.value = true
  try {
    const favorites = await $fetch(
      `${MOCK_API_URL}/favorites?userId=${userId.value}&recipeId=${recipeId}`
    ).catch(() => [])
    for (const fav of favorites) {
      await $fetch(`${MOCK_API_URL}/favorites/${fav.id}`, { method: 'DELETE' })
    }
    await loadSavedRecipes()
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingSaved.value = false
  }
}



// closeCreateModal функциясында form-ды reset етеміз
const closeCreateModal = () => {
  showCreateModal.value = false
  form.value = {
    title: '',
    category: '',
    area: '',
    imageUrl: '',
    instructions: '',
    ingredients: [],
    youtubeUrl: ''
  }
}

const deleteUserRecipe = async id => {
  isLoading.value = true
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${id}`, { method: 'DELETE' })
    await loadMyRecipes()
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const viewRecipe = recipe => {
  viewedRecipe.value = { ...recipe }
}



const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
  router.push('/login')
}

const openEditModal = recipe => {
  editForm.value = { ...recipe }
  editIngredientsText.value = (recipe.ingredients || []).join('\n')
  showEditModal.value = true
}

const saveEditedRecipe = async () => {
  editForm.value.ingredients = editIngredientsText.value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
  isLoading.value = true
  try {
    await $fetch(`${MOCK_API_URL}/recipes/${editForm.value.id}`, {
      method: 'PUT',
      body: editForm.value
    })
    showEditModal.value = false
    await loadMyRecipes()
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const isNewRecipe = recipe => {
  if (!recipe.createdAt) return false
  const createdDate = new Date(recipe.createdAt)
  const now = new Date()
  return now - createdDate < 7 * 24 * 60 * 60 * 1000
}

onMounted(() => {
  setupUser()
  if (userId.value) {
    setTimeout(() => {
      loadMyRecipes()
      loadSavedRecipes()
    }, 500)
  }
})





// VALIDATION функциясы
const validateRecipeForHome = (recipe) => {
  const requiredFields = ['title', 'category', 'area']
  const minLength = 3
  
  // Барлық required field толтырылған ба?
  for (const field of requiredFields) {
    if (!recipe[field]?.trim() || recipe[field].trim().length < minLength) {
      return false
    }
  }
  
  // Instructions кемінде 20 символ
  if (!recipe.instructions?.trim() || recipe.instructions.trim().length < 20) {
    return false
  }
  
  // Ingredients кемінде 3 дана
  if (!recipe.ingredients?.length || recipe.ingredients.length < 3) {
    return false
  }
  
  return true
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
