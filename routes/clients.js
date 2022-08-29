const express = require('express')
const router = express.Router()
const clientsController = require('../controllers/clients') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, clientsController.getClient)

router.get('/add', clientsController.addPage)

router.post('/createClient', ensureAuth, clientsController.createClient)

router.get('/edit/:id', ensureAuth, clientsController.editClient)

router.put('/:id', ensureAuth, clientsController.updateClient)

// router.put('/markComplete', clientsController.markComplete)

// router.put('/markIncomplete', clientsController.markIncomplete)

router.delete('/deleteClient', ensureAuth, clientsController.deleteClient)

module.exports = router