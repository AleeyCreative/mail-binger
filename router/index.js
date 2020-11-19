const controllers = require('../controllers')
const router = require('express').Router()


// router.get('/', controller.home)
router.get('/callback', controllers.callbackHandler)
router.get('/', controllers.home)
// router.get('/user/:id', controller.user)
// router.get('/user/:id/:aggregateID', controller.aggregateMail)
// router.post('/user/:id/edit', controller.edit)

module.exports = router