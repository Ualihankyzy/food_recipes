<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const error = ref("");

const handleLogin = async () => {
  error.value = ""

  if (!form.value.email || !form.value.password) {
    error.value = "Email және пароль толтырыңыз"
    return
  }

  try {
    const response = await axios.post(
      "https://medical-backend-54hp.onrender.com/api/auth/login",
      form.value
    )

    const user = response.data?.data?.user
    const token = response.data?.data?.token

    if (user?.id && token) {
      // 🔥 Барлық деректерді localStorage-қа сақтау
      localStorage.setItem("userId", user.id)
      localStorage.setItem("userName", user.name)
      localStorage.setItem("token", token)
      localStorage.setItem("email", user.email)
      localStorage.setItem("role", user.role) // "admin" немесе "user"

      // 🔥 РОЛЬ БОЙЫША КӘМІЛГІ РЕДИРЕКТ
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/") // немесе "/dashboard"
      }
    } else {
      error.value = "Email немесе пароль дұрыс емес"
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Email немесе пароль дұрыс емес"
  }
}
</script>
