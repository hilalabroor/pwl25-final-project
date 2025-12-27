import express from 'express'
import { getFields, addField, updateField, deleteField } from '../controllers/fieldController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getFields)
router.post('/', verifyToken, isAdmin, addField)
router.put('/:id', verifyToken, isAdmin, updateField)
router.delete('/:id', verifyToken, isAdmin, deleteField)

export default router
