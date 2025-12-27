<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p>Selamat datang di sistem booking lapangan</p>

    <!-- Menu untuk user -->
    <div v-if="userRole === 'user'" class="menu">
      <router-link to="/booking">
        <button class="btn">Booking Lapangan</button>
      </router-link>

      <router-link to="/booking-history">
        <button class="btn">Riwayat Booking</button>
      </router-link>
    </div>

    <!-- Menu untuk admin -->
    <div v-else-if="userRole === 'admin'" class="menu">
      <router-link to="/admin">
        <button class="btn">Admin Panel</button>
      </router-link>
    </div>

    <button class="btn logout" @click="logout">
      Logout
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userRole = ref('user') // default role

// ambil token dari localStorage
const token = localStorage.getItem('token')

if (token) {
  try {
    // decode payload JWT
    const payload = JSON.parse(atob(token.split('.')[1]))
    userRole.value = payload.role || 'user'
  } catch (error) {
    console.error('Token tidak valid')
  }
}

// logout
function logout() {
  localStorage.removeItem('token')
  router.push('/') // kembali ke Landing page
}
</script>

<style scoped>
/* Container utama */
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9; /* latar belakang lembut */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Menu tombol */
.menu {
  margin: 20px 0;
}

/* Tombol umum */
.btn {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50; /* hijau */
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Tombol hover */
.btn:hover {
  background-color: #45a049;
}

/* Tombol logout */
.logout {
  background-color: #f44336; /* merah */
}

.logout:hover {
  background-color: #d32f2f;
}

/* Judul */
h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

/* Paragraf */
p {
  font-size: 16px;
  color: #666;
}
</style>
