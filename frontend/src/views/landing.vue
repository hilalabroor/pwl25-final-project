<template>
  <div class="container">
    <h1>Selamat datang di Sistem Booking Lapangan</h1>
    <p>Pilih aksi untuk mulai:</p>

    <div class="button-group">
      <button class="btn" @click="goRegister">Register</button>
      <button class="btn" @click="goLogin">Login</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goRegister() {
  router.push('/register')
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
/* Container pusat */
.container {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  padding: 20px;
  border: 1px solid #ddd; /* garis tipis */
  border-radius: 10px; /* sudut membulat */
  background-color: #f9f9f9; /* warna latar */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* efek bayangan */
}

/* Grup tombol agar berjajar */
.button-group {
  margin-top: 20px;
}

/* Tombol */
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

/* Hover efek tombol */
.btn:hover {
  background-color: #45a049;
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
