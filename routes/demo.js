const express = require('express')
const router = express.Router()
const demoController = require('../controllers/demo') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, demoController.getOpenBoxes)
router.get('/closed', ensureAuth, demoController.getClosedBoxes)
router.get('/all', ensureAuth, demoController.getAllBoxes)

router.get('/search', ensureAuth, demoController.search)

router.get('/add', demoController.addPage)

router.post('/createClient', ensureAuth, demoController.createClient)

router.get('/:id', ensureAuth, demoController.showClient)

router.get('/edit/:id', ensureAuth, demoController.editClient)

router.put('/:id', ensureAuth, demoController.updateClient)

router.put('/check/:id', ensureAuth, demoController.markChecked)

router.put('/uncheck/:id', ensureAuth, demoController.markUnchecked)

router.put('/close/:id', demoController.closeMailbox)

router.put('/reopen/:id', demoController.reopenMailbox)

router.put('/delete/:id', ensureAuth, demoController.deleteClient)

module.exports = router