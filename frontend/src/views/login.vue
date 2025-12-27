<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="submit" class="login-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

async function submit() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()

    if (res.ok) {
      // simpan token
      localStorage.setItem('token', data.token)
      // redirect ke Dashboard
      router.push('/dashboard')
    } else {
      message.value = data.message
    }
  } catch (err) {
    message.value = err.message
  }
}
</script>

<style scoped>
/* Container login */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  text-align: center;
  border: 1px solid #ddd; /* garis tipis */
  border-radius: 10px; /* sudut membulat */
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* bayangan halus */
}

/* Judul */
h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
}

/* Form login */
.login-form input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.login-form button {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #4caf50; /* hijau */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Hover efek tombol */
.login-form button:hover {
  background-color: #45a049;
}

/* Pesan error / info */
.message {
  margin-top: 15px;
  color: red;
  font-size: 14px;
}
</style>
