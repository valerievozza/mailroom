const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer")
const clientsController = require('../controllers/clients') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, clientsController.getOpenBoxes)
router.get('/closed', ensureAuth, clientsController.getClosedBoxes)
router.get('/all', ensureAuth, clientsController.getAllBoxes)

// !todo: Add inactive filter
// router.get('/inactive', ensureAuth, clientsController.getInactiveBoxes)

router.get('/search', ensureAuth, clientsController.search)

router.get('/add', ensureAuth, clientsController.addPage)

router.post('/createClient', ensureAuth, clientsController.createClient)

router.get('/:id', ensureAuth, clientsController.showClient)

router.get('/edit/:id', ensureAuth, clientsController.editClient)

router.put('/:id', ensureAuth, clientsController.updateClient)

router.put('/upload/:id', ensureAuth, upload.single("file"), clientsController.uploadDoc)

router.put('/check/:id', ensureAuth, clientsController.markChecked)

router.put('/uncheck/:id', ensureAuth, clientsController.markUnchecked)

router.put('/close/:id', ensureAuth, clientsController.closeMailbox)

router.put('/reopen/:id', ensureAuth, clientsController.reopenMailbox)

router.put('/delete/:id', ensureAuth, clientsController.deleteClient)

module.exports = router