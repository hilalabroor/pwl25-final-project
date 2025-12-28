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
      ts.price AS price
    FROM fields f
    LEFT JOIN time_slots ts ON ts.field_id = f.id
    GROUP BY f.id, f.name, f.type, f.deskripsi
  `)

  res.json(rows)
}


// CRUD lapangan (untuk admin)
export async function addField(req, res) {
  const { name, type, deskripsi} = req.body
  if (!name || !type) return res.status(400).json({ message: 'Data tidak lengkap' })
  await db.query('INSERT INTO fields (name, type, deskripsi) VALUES (?, ?, ?)', [name, type, deskripsi])
  res.json({ message: 'Lapangan ditambahkan' })
}

export async function updateField(req, res) {
  const { id } = req.params
  const { name, type, deskripsi } = req.body
  await db.query('UPDATE fields SET name=?, type=?, deskripsi=? WHERE id=?', [name, type, deskripsi, id])
  res.json({ message: 'Lapangan diupdate' })
}

export async function deleteField(req, res) {
  const { id } = req.params
  await db.query('DELETE FROM fields WHERE id=?', [id])
  res.json({ message: 'Lapangan dihapus' })
}
