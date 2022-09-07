const express = require('express')
const router = express.Router()
const clientsController = require('../controllers/clients') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, clientsController.getOpenBoxes)
router.get('/closed', ensureAuth, clientsController.getClosedBoxes)
router.get('/all', ensureAuth, clientsController.getAllBoxes)

router.get('/search', ensureAuth, clientsController.search)

router.get('/add', clientsController.addPage)

router.post('/createClient', ensureAuth, clientsController.createClient)

router.get('/:id', ensureAuth, clientsController.showClient)

router.get('/edit/:id', ensureAuth, clientsController.editClient)

router.put('/:id', ensureAuth, clientsController.updateClient)

router.put('/check/:id', ensureAuth, clientsController.markChecked)

router.put('/uncheck/:id', ensureAuth, clientsController.markUnchecked)

router.put('/close/:id', clientsController.closeMailbox)

router.put('/reopen/:id', clientsController.reopenMailbox)

router.put('/delete/:id', ensureAuth, clientsController.deleteClient)

module.exports = router