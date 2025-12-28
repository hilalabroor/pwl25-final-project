<template>
  <div style="max-width:1600px; margin:auto">
    <h1>Admin Panel</h1>
    <button @click="logout" style="margin-bottom:20px">Logout</button>

    <div class="grid-2x2">

      <!-- Daftar Lapangan -->
      <section class="box">
        <h2>Daftar Lapangan</h2>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Tipe</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in fields" :key="field.id">
              <td>{{ field.name }}</td>
              <td>{{ field.type }}</td>
              <td>{{ field.deskripsi }}</td>
              <td>
                <button @click="editField(field)">Edit</button>
                <button @click="deleteField(field.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="addField" style="margin-top:10px">Tambah Lapangan</button>
      </section>

      <!-- Daftar Booking -->
      <section class="box">
        <h2>Daftar Booking</h2>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Lapangan</th>
              <th>Tanggal</th>
              <th>Jam</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td>{{ booking.field_name }}</td>
              <td>{{ formatDate(booking.booking_date) }}</td>
              <td>{{ booking.start_time }} - {{ booking.end_time }}</td>
              <td>{{ bookingStatusLabel(booking.status) }}</td>
              <td>
                <button
                  v-if="booking.status === 0"
                  @click="completeBooking(booking)">
                  Tandai Selesai
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Daftar Time Slots -->
      <section class="box">
        <h2>Daftar Time Slots</h2>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Lapangan</th>
              <th>Jam Mulai</th>
              <th>Jam Selesai</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in timeSlots" :key="slot.id">
              <td>{{ slot.field_name }}</td>
              <td>{{ slot.start_time }}</td>
              <td>{{ slot.end_time }}</td>
              <td>Rp {{ slot.price }}</td>
              <td>{{ slot.status === 1 ? 'Booked' : 'Tersedia' }}</td>
              <td>
                <button @click="openEdit(slot)">Edit</button>
                <button @click="deleteSlot(slot.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="openAdd" style="margin-top:10px">
          Tambah Time Slot
        </button>
      </section>

      <!-- Form Tambah / Edit -->
      <section class="box" v-if="showForm">
        <h3>{{ isEdit ? 'Edit Time Slot' : 'Tambah Time Slot' }}</h3>
        <form @submit.prevent="submitSlot">
          <div>
            <label>Lapangan</label>
            <select v-model="form.field_id" required>
              <option value="">-- Pilih Lapangan --</option>
              <option v-for="f in fields" :key="f.id" :value="f.id">
                {{ f.name }}
              </option>
            </select>
          </div>

          <div>
            <label>Jam Mulai</label>
            <input type="time" v-model="form.start_time" required>
          </div>

          <div>
            <label>Jam Selesai</label>
            <input type="time" v-model="form.end_time" required>
          </div>

          <div>
            <label>Harga</label>
            <input type="number" v-model="form.price" required>
          </div>

          <div v-if="isEdit">
            <label>Status</label>
            <select v-model="form.status">
              <option :value="0">Tersedia</option>
              <option :value="1">Booked</option>
            </select>
          </div>

          <button type="submit">{{ isEdit ? 'Update' : 'Simpan' }}</button>
          <button type="button" @click="resetForm">Batal</button>
        </form>
      </section>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '../api.js'

const router = useRouter()
const token = localStorage.getItem('token')


// state
const fields = ref([])
const bookings = ref([])
const timeSlots = ref([])

const showForm = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  field_id: '',
  start_time: '',
  end_time: '',
  price: '',
  status: 0
})

// fetch fields
async function loadFields() {
  fields.value = await apiFetch('/api/fields')
}

// fetch bookings
async function loadBookings() {
  bookings.value = await apiFetch('/api/bookings')
}

// tambah lapangan
async function addField() {
  const name = prompt('Nama Lapangan:')
  const type = prompt('Tipe Lapangan:')
  const deskripsi = prompt('Deskripsi Lapangan:')
  if (!name || !type || !deskripsi) return alert('Data tidak lengkap')

  try {
    const data = await apiFetch('/api/fields', {
      method: 'POST',
      body: { name, type, deskripsi },
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal menambah lapangan')
  }
  loadFields()
}

// edit lapangan
async function editField(field) {
  const name = prompt('Nama Lapangan:', field.name) || field.name
  const type = prompt('Tipe Lapangan:', field.type) || field.type
  const deskripsi = prompt('Deskripsi Lapangan:', field.deskripsi) || field.deskripsi

  try {
    const data = await apiFetch(`/api/fields/${field.id}`, {
      method: 'PUT',
      body: { name, type, deskripsi },
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal update lapangan')
  }
  loadFields()
}

// hapus lapangan
async function deleteField(id) {
  if (!confirm('Hapus lapangan ini?')) return

  try {
    const data = await apiFetch(`/api/fields/${id}`, {
      method: 'DELETE',
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal hapus lapangan')
  }
  loadFields()
}

// fetch semua time slots
async function loadTimeSlots() {
  timeSlots.value = await apiFetch('/api/time-slots')
}

// hapus slot
async function deleteSlot(id) {
  if (!confirm('Hapus slot ini?')) return
  try {
    const data = await apiFetch(`/api/time-slots/${id}`, {
      method: 'DELETE',
    })
    alert(data.message)
  } catch (err) {
    alert(err?.message || 'Gagal hapus slot')
  }
  loadTimeSlots()
}

function openAdd() {
  resetForm()
  isEdit.value = false
  showForm.value = true
}

function openEdit(slot) {
  form.value = {
    id: slot.id,
    field_id: slot.field_id,
    start_time: slot.start_time,
    end_time: slot.end_time,
    price: slot.price,
    status: slot.status
  }
  isEdit.value = true
  showForm.value = true
}

function resetForm() {
  form.value = {
    id: null,
    field_id: '',
    start_time: '',
    end_time: '',
    price: '',
    status: 0
  }
  showForm.value = false
}

async function submitSlot() {
  try {
    if (isEdit.value) {
      const data = await apiFetch(`/api/time-slots/${form.value.id}`, {
        method: 'PUT',
        body: {
          start_time: form.value.start_time,
          end_time: form.value.end_time,
          price: form.value.price,
          status: form.value.status
        }
      })
      alert(data.message)
    } else {
      const data = await apiFetch('/api/time-slots', {
        method: 'POST',
        body: {
          field_id: form.value.field_id,
          start_time: form.value.start_time,
          end_time: form.value.end_time,
          price: form.value.price
        }
      })
      alert(data.message)
    }

    resetForm()
    loadTimeSlots()
  } catch (err) {
    alert(err?.message || 'Gagal simpan data')
  }
}


// logout
function logout() {
  localStorage.removeItem('token')
  router.push('/')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // bulan 0-11
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

function bookingStatusLabel(status) {
  if (status === 0) return 'Aktif'
  if (status === 1) return 'Selesai'
  return '-'
}

async function completeBooking(booking) {
  if (!confirm('Tandai booking ini sebagai selesai?')) return
    const res = await fetch(`http://localhost:3000/api/bookings/${booking.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ status: 1 }) // 1 = complete
    })
  const data = await res.json()
  alert(data.message)

  // reload booking & slot
  loadBookings()
  loadTimeSlots()
}

// load data awal
onMounted(() => {
    loadFields()
    loadBookings()
    loadTimeSlots()
})
</script>

<style scoped>

/* container utama */
div {
  max-width: 100%;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* judul halaman */
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* layout grid 2x2 */
.grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* Box tiap section */
.box {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* subjudul */
section h2,
section h3 {
  margin-bottom: 10px;
  color: #4caf50;
}

/* tabel */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 14px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

/* button */
button {
  padding: 6px 12px;
  margin: 5px 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, opacity 0.3s;
}

/* Hover effect */
button:hover {
  opacity: 0.9;
}

/* Tombol disabled */
button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Logout button */
button:first-of-type {
  background-color: #f44336;
  color: white;
}

/* Tombol aksi lainnya */
button:not(:first-of-type) {
  background-color: #4caf50;
  color: white;
}

/* form */
form div {
  margin-bottom: 10px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

input,
select {
  width: 100%;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* responsive */
@media (max-width: 900px) {
  .grid-2x2 {
    grid-template-columns: 1fr;
  }

  table {
    display: block;
    overflow-x: auto;
  }
}
</style>
