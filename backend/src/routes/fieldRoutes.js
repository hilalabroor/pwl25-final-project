import express from 'express'
import multer from 'multer'
import { getFields, addField, updateField, deleteField } from '../controllers/fieldController.js'
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'
import { validate } from '../middlewares/validateMiddleware.js'

const router = express.Router()

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

router.get('/', getFields)
// accept multipart/form-data with field name `image`
router.post('/', verifyToken, upload.single('image'), validate(['name', 'type', 'deskripsi']), isAdmin, addField)
router.put('/:id', verifyToken, upload.single('image'), isAdmin, updateField)
router.delete('/:id', verifyToken, isAdmin, deleteField)

export default router
