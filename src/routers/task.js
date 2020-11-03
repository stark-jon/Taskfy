const router = require('express').Router()
const Task = require('../model/task')
const controllers = require('../controllers/task.controller')
const { jwtAuthenticationMiddleware, isAuthenticatedMiddleware } = require('../middlewares/auth')

router.use(require('../middlewares/session'))
router.use(jwtAuthenticationMiddleware)

router.route('/')
.post( isAuthenticatedMiddleware, controllers.createTask)
.get( isAuthenticatedMiddleware, controllers.getTasks)

router.route('/task/:_id')
.get( isAuthenticatedMiddleware, controllers.getTask)
// .put( isAuthenticatedMiddleware, controllers.updateTask)
// .delete( isAuthenticatedMiddleware, controllers.deleteTask)
router.post('/task/update', isAuthenticatedMiddleware, controllers.updateTask)
router.post('/task/delete', isAuthenticatedMiddleware, controllers.deleteTask)
module.exports = router
