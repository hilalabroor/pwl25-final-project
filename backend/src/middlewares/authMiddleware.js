import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    const err = new Error('Token tidak ditemukan')
    err.status = 401
    return next(err)
  }

  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (error) {
    error.status = 401
    next(error)
  }
}

export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    const err = new Error('Akses ditolak')
    err.status = 403
    return next(err)
  }
  next()
}
