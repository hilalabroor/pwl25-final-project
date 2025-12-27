<template>
  <div class="container">
    <h2>Booking Lapangan</h2>
    <div v-if="message" class="message">{{ message }}</div>

    <form @submit.prevent="submitBooking" class="form">
      <div class="form-group">
        <label>Lapangan</label>
        <select v-model="selectedField" required>
          <option value="">Pilih Lapangan</option>
          <option v-for="f in fields" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tanggal</label>
        <input type="date" v-model="date" required />
      </div>

      <div class="form-group">
        <label>Jam</label>
        <select v-model="selectedSlot" required>
          <option value="">Pilih Jam</option>
          <option v-for="s in slots" :key="s.id" :value="s.id" :disabled="!s.available">
            {{ s.start_time }} - {{ s.end_time }} {{ !s.available ? '(Booked)' : '' }}
          </option>
        </select>
      </div>

      <div v-if="selectedSlot" class="total-price">
        <strong>Total Harga: Rp {{ totalPrice }}</strong>
      </div>

      <button type="submit" class="btn">Booking</button>
    </form>

    <button @click="goBack" class="btn-back">Kembali ke Dashboard</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

const fields = ref([])
const selectedField = ref('')
const date = ref('')
const slots = ref([])
const selectedSlot = ref('')
const totalPrice = ref(0)
const message = ref('')
const router = useRouter()

function goBack() {
  router.push('/dashboard')
}

async function loadFields() {
  const res = await fetch('http://localhost:3000/api/fields', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  })
  fields.value = await res.json()
}

watch([selectedField, date], async () => {
  if (!selectedField.value || !date.value) {
    slots.value = []
    selectedSlot.value = ''
    totalPrice.value = 0
    return
  }

  const res = await fetch(`http://localhost:3000/api/bookings/time-slots?field_id=${selectedField.value}&date=${date.value}`, {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  })
  slots.value = await res.json()
  selectedSlot.value = ''
  totalPrice.value = 0
})

watch(selectedSlot, () => {
  const slot = slots.value.find(s => s.id === selectedSlot.value)
  totalPrice.value = slot ? slot.price : 0
})

async function submitBooking() {
  if (!selectedField.value || !date.value || !selectedSlot.value) {
    return alert('Lengkapi semua field terlebih dahulu!')
  }

  const res = await fetch('http://localhost:3000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({
      field_id: selectedField.value,
      date: date.value,
      time_slot_id: selectedSlot.value,
      total_price: totalPrice.value
    })
  })

  const data = await res.json()
  message.value = data.message
}

onMounted(() => {
  loadFields()
})
</script>

<style scoped>
/* Kontainer utama */
.container {
  max-width: 480px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9; /* latar belakang */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
}

/* Pesan dari server */
.message {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #e0f7fa; 
  color: #00796b;
  border-radius: 5px;
}

/* Form dan grup input */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  margin-bottom: 5px;
  font-weight: 600;
}

input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

/* Tombol utama */
.btn {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background-color: #45a049;
}

/* Tombol kembali */
.btn-back {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-back:hover {
  background-color: #757575;
}

/* Total harga */
.total-price {
  margin-top: 5px;
  font-size: 16px;
  color: #333;
  text-align: right;
}
</style>
