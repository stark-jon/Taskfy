const router = require('express').Router()
const User = require('../model/user')
const { jwtAuthenticationMiddleware, jwtLogin, isAuthenticatedMiddleware, jwtLogout, jwtLogoutAll } = require('../middlewares/auth')
const { readUser, updateUser, deleteUser, createUser, isAuth } = require('../controllers/user.controller')

router.post('/', createUser)
router.use(require('../middlewares/session'))
router.post('/login', jwtLogin)
router.use(jwtAuthenticationMiddleware)
router.post('/isAuth', isAuth)
router.post('/logout', isAuthenticatedMiddleware, jwtLogout)
router.post('/logout/all', isAuthenticatedMiddleware, jwtLogoutAll)

// User R.U.D. Routes
router.route('/')
.get( isAuthenticatedMiddleware, readUser)
.put( isAuthenticatedMiddleware, updateUser)
.delete( isAuthenticatedMiddleware, deleteUser)

module.exports = router