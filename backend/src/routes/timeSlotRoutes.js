import express from 'express'
import { getTimeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot } from '../controllers/timeSlotController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Semua bisa melihat slot
router.get('/', verifyToken, getTimeSlots)

// ambil semua time slots
router.get('/', verifyToken, getTimeSlots)

// tambah time slot (admin)
router.post('/', verifyToken, isAdmin, addTimeSlot)

// edit time slot (admin)
router.put('/:id', verifyToken, isAdmin, updateTimeSlot)

// hapus time slot (admin)
router.delete('/:id', verifyToken, isAdmin, deleteTimeSlot)

export default router
