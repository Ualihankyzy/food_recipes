<template>
  <div class="min-h-screen flex bg-slate-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-slate-200">
        <span class="text-xl font-bold text-slate-900">Admin Panel</span>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1 text-sm">
        <NuxtLink
          to="/admin/dashboard"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
        >
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/users"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white"
        >
          <span>Users</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/recipes"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
        >
          <span>Recipes</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">New Customer</h1>
          <p class="text-xs text-slate-500 mt-1">
            Showing {{ users.length }} customers
          </p>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-full bg-[#7c3aed] text-white text-sm font-semibold shadow hover:bg-[#6d28d9]"
        >
          + New Customer
        </button>
      </div>

      <!-- Filters (қарапайым mock) -->
      <div class="flex flex-wrap items-center gap-3 mb-4 text-xs">
        <button class="px-3 py-2 rounded-full bg-white border border-slate-200 flex items-center gap-2">
          <span class="text-slate-600">Filter</span>
          <span class="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px]">2</span>
        </button>

        <div class="px-3 py-2 rounded-full bg-white border border-slate-200 flex items-center gap-2">
          <span class="text-slate-500">Name:</span>
          <span class="text-slate-900 font-medium">Sh</span>
        </div>

        <div class="px-3 py-2 rounded-full bg-white border border-slate-200 flex items-center gap-2">
          <span class="text-slate-500">Date:</span>
          <span class="text-slate-900 font-medium">Last 6 months</span>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              <th class="w-10 px-4 py-3">
                <input type="checkbox" class="rounded border-slate-300" />
              </th>
              <th class="px-4 py-3">Avatar</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Saved recipes</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Last activity</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="user in users"
              :key="user.userId"
              class="border-t border-slate-100 hover:bg-slate-50/80"
            >
              <td class="px-4 py-3">
                <input type="checkbox" class="rounded border-slate-300" />
              </td>
              <td class="px-4 py-3">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                  <img
                    v-if="user.avatarUrl"
                    :src="user.avatarUrl"
                    alt=""
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-indigo-500 to-sky-400 text-white"
                  >
                    {{ user.initial }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-900 font-medium">
                {{ user.username }}
              </td>
              <td class="px-4 py-3 text-slate-500">
                {{ user.email || '—' }}
              </td>
              <td class="px-4 py-3 text-slate-700">
                {{ user.savedCount }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium"
                  :class="user.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600'
                    : user.status === 'Inactive'
                      ? 'bg-slate-50 text-slate-500'
                      : 'bg-violet-50 text-violet-600'"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-500">
                {{ user.lastSaved }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2 text-slate-400">
                  <button class="p-1.5 rounded-full hover:bg-slate-100">
                    🖊
                  </button>
                  <button class="p-1.5 rounded-full hover:bg-slate-100">
                    🗑
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!users.length && !loading">
              <td colspan="8" class="px-4 py-6 text-center text-slate-400 text-sm">
                No users with favorites yet.
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-100">
          <span>Showing {{ users.length }} customers</span>
          <div class="flex items-center gap-2">
            <span>25 per page</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const MOCK_API_URL = 'https://68448e3771eb5d1be033990d.mockapi.io/api/v1'

const loading = ref(false)
const favorites = ref([])

// users – favorites-тен group-by userId
const users = computed(() => {
  const byUser = new Map()

  for (const fav of favorites.value) {
    const key = fav.userId || 'unknown'
    if (!byUser.has(key)) {
      byUser.set(key, {
        userId: fav.userId,
        username: fav.username || 'Unknown',
        email: fav.email || '',
        avatarUrl: fav.avatarUrl || '',
        savedCount: 0,
        lastSaved: fav.savedAt ? new Date(fav.savedAt).toLocaleDateString() : '',
      })
    }
    const u = byUser.get(key)
    u.savedCount++
    if (fav.savedAt && new Date(fav.savedAt) > new Date(u.lastSaved || 0)) {
      u.lastSaved = new Date(fav.savedAt).toLocaleDateString()
    }
  }

  return Array.from(byUser.values()).map(u => ({
    ...u,
    initial: u.username ? u.username[0].toUpperCase() : 'U',
    status: u.savedCount > 0 ? 'New' : 'Inactive',
  }))
})

onMounted(async () => {
  loading.value = true
  try {
    // барлық favorites – admin үшін
    favorites.value = await $fetch(`${MOCK_API_URL}/favorites`)
  } finally {
    loading.value = false
  }
})
</script>
