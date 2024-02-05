import expres from 'express'
const router = expres.Router()
import {authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUser } from '../controller/userController.js'
import { protect } from '../middleware/authMiddleware.js'



router.post('/auth', authUser)
router.post('/', registerUser)
router.post('/logout', logoutUser)
router.route('/profile')
.get(protect, getUser)
.put(protect, updateUser)


export default router