import { db } from '../config/database.js'

// Ambil semua lapangan
// export async function getFields(req, res) {
//   const [rows] = await db.query('SELECT * FROM fields')
//   res.json(rows)
// }

export async function getFields(req, res) {
  const [rows] = await db.query(
    `SELECT 
      f.id,
      f.name,
      f.type,
      f.deskripsi,
      f.image,
      ts.price AS price
    FROM fields f
    LEFT JOIN time_slots ts ON ts.field_id = f.id
    GROUP BY f.id, f.name, f.type, f.deskripsi, f.image
  `)

  res.json(rows)
}


// CRUD lapangan (untuk admin)
export async function addField(req, res) {
  try {
    const { name, type, deskripsi } = req.body
    if (!name || !type) return res.status(400).json({ message: 'Data tidak lengkap' })

    const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image || null)

    await db.query('INSERT INTO fields (name, type, deskripsi, image) VALUES (?, ?, ?, ?)', [name, type, deskripsi, imagePath])
    res.json({ message: 'Lapangan ditambahkan' })
  } catch (err) {
    console.error('addField error', err)
    res.status(500).json({ message: 'Gagal menambahkan lapangan' })
  }
}

export async function updateField(req, res) {
  try {
    const { id } = req.params
    const { name, type, deskripsi } = req.body

    const [rows] = await db.query('SELECT image FROM fields WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ message: 'Lapangan tidak ditemukan' })
    const existingImage = rows[0].image

    const imagePath = req.file ? `/uploads/${req.file.filename}` : (req.body.image ?? existingImage)

    await db.query('UPDATE fields SET name=?, type=?, deskripsi=?, image=? WHERE id=?', [name, type, deskripsi, imagePath, id])
    res.json({ message: 'Lapangan diupdate' })
  } catch (err) {
    console.error('updateField error', err)
    res.status(500).json({ message: 'Gagal update lapangan' })
  }
}

export async function deleteField(req, res) {
  const { id } = req.params
  await db.query('DELETE FROM fields WHERE id=?', [id])
  res.json({ message: 'Lapangan dihapus' })
}
