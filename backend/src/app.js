import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import fieldRoutes from './routes/fieldRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import timeSlotRoutes from './routes/timeSlotRoutes.js'
import { errorHandler } from './middlewares/errorHandler.js'
import path from 'path'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(errorHandler)

//endpoint
app.use('/api/auth', authRoutes)
app.use('/api/fields', fieldRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/time-slots', timeSlotRoutes)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/api/test', (req, res) => {
  res.json({ message: 'API berjalan' })
})

export default app
