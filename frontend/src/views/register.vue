<template>
  <div class="container">
    <h2>Register</h2>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <form @submit.prevent="register" class="form">
      <label>Nama</label>
      <input type="text" v-model="name" required />

      <label>Email</label>
      <input type="email" v-model="email" required />

      <label>Password</label>
      <input type="password" v-model="password" required />

      <button type="submit">Register</button>
    </form>

    <p class="login-link">
      Sudah punya akun?
      <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

const router = useRouter()

async function register() {
  error.value = ''
  success.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()
    console.log(data)
    if (!res.ok) throw new Error(data.message || 'Register gagal')

    success.value = 'Register berhasil, silakan login'
    name.value = ''
    email.value = ''
    password.value = ''

    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
/* Container pusat */
.container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Judul */
h2 {
  margin-bottom: 20px;
  color: #333;
}

/* Error & success */
.error {
  color: #e74c3c;
  margin-bottom: 10px;
}

.success {
  color: #2ecc71;
  margin-bottom: 10px;
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* Tombol */
button {
  margin-top: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

/* Link login */
.login-link {
  margin-top: 15px;
  text-align: center;
}

.login-link a {
  color: #4caf50;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
