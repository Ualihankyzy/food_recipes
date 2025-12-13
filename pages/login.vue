<template>
  <div class="flex min-h-screen font-sans">
    <!-- Сол жақ: full screen сурет -->
    <div class="hidden md:block w-1/2 h-screen">
      <img src="../public/images/food.jpg" class="w-full h-full object-cover" />
    </div>

    <!-- Оң жақ: үлкейтілген Login форма -->
    <div class="flex items-center justify-center bg-white md:w-1/2 w-full">
      <div class="w-full max-w-lg px-8 md:px-12">
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-4 h-4 bg-[#f8961e] rounded-sm"></div>
            <span class="font-semibold text-gray-800 text-base"
              >FoodRecipes</span
            >
          </div>
          <h1
            class="text-3xl text-[#6a994e] md:text-5xl font-extrabold mb-4 leading-tight"
          >
            Hello, Welcome Back
          </h1>
          <p class="text-gray-500 text-base md:text-lg">
            Login to manage your favorite food recipes.
          </p>
        </div>

        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              class="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#f8961e] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            @click="handleLogin"
            class="w-full bg-[#f8961e] text-white py-3.5 rounded-md text-base font-semibold hover:bg-[#f8961e] transition-colors"
          >
            Login
          </button>
        </form>

        <p class="mt-10 text-sm text-gray-500">
          Don’t have an account?
          <a
            href="/signup"
            class="font-semibold text-[#f8961e] hover:underline"
          >
            Signup
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from "axios"; // ✅ 1-ШЫ ЖОЛ
import { ref } from "vue"; // ✅ 2-ШЫ ЖОЛ
import { useRouter } from "vue-router"; // ✅ 3-ШЫ ЖОЛ

const router = useRouter(); // ✅ ROUTER
const form = ref({ email: "", password: "" }); // ✅ FORM
const error = ref(""); // ✅ ERROR

const handleLogin = async () => {
  // ✅ СІЗДІҢ КОДЫҢЫЗ
  try {
    const response = await axios.post(
      "https://medical-backend-54hp.onrender.com/api/auth/login",
      form.value
    );

  localStorage.setItem("userId", response.data.data.user.id);
localStorage.setItem("userName", response.data.data.user.name);
localStorage.setItem("token", response.data.data.token);

router.push("/");
  } catch (err) {
    error.value = err.response?.data?.message;
  }
};
</script>
