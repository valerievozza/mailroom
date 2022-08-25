const express = require('express')
const router = express.Router()
const clientsController = require('../controllers/clients') 
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureAuth, clientsController.getClient)

router.post('/createClient', clientsController.createClient)

// router.put('/markComplete', clientsController.markComplete)

// router.put('/markIncomplete', clientsController.markIncomplete)

router.delete('/deleteClient', clientsController.deleteClient)

module.exports = router