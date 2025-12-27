import db from '../config/database.js'

export async function getTimeSlots(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT ts.*, f.name AS field_name
      FROM time_slots ts
      JOIN fields f ON ts.field_id = f.id
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gagal mengambil time slots' })
  }
}

// Tambah slot baru (admin)
export async function addTimeSlot(req, res) {
  const { field_id, start_time, end_time, price } = req.body
  if (!field_id || !start_time || !end_time || !price) {
    return res.status(400).json({ message: 'Data tidak lengkap' })
  }

  await db.query(
    'INSERT INTO time_slots (field_id, start_time, end_time, price) VALUES (?, ?, ?, ?)',
    [field_id, start_time, end_time, price]
  )

  res.json({ message: 'Slot waktu berhasil ditambahkan' })
}

// Update slot (admin)
export async function updateTimeSlot(req, res) {
  const id = req.params.id
  const { start_time, end_time, price, status } = req.body

  await db.query(
    'UPDATE time_slots SET start_time = ?, end_time = ?, price = ?, status = ? WHERE id = ?',
    [start_time, end_time, price, status, id]
  )

  res.json({ message: 'Slot waktu berhasil diperbarui' })
}

// Hapus slot (admin)
export async function deleteTimeSlot(req, res) {
  const id = req.params.id

  await db.query('DELETE FROM time_slots WHERE id = ?', [id])
  res.json({ message: 'Slot waktu berhasil dihapus' })
}
