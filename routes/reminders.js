const express = require('express')
const router = express.Router()
const upload = require("../middleware/multer")
const reminderController = require('../controllers/reminders') 
const { ensureAuth } = require('../middleware/auth')

// // Show all reminders
// router.get('/', ensureAuth, reminderController.getReminders)

// // Show single reminder
// router.get('/:id', ensureAuth, reminderController.getReminder)

// Show add reminder page
router.get('/add', ensureAuth, reminderController.getAddReminder)

// Save reminder
router.post('/add', ensureAuth, reminderController.createReminder)

// Get edit reminder page
router.get('/edit', ensureAuth, reminderController.getEditReminder)

// Update reminder
router.put('/edit/:id', ensureAuth, reminderController.updateReminder)

// Send reminder to client (by ID)
// TODO: add option to select reminder by ID
router.post('/send/:id', ensureAuth, reminderController.sendReminder)

// Send reminders to all
router.post('/send', ensureAuth, reminderController.sendRemindersToAll)

// // Delete reminder
// router.put('/delete/:id', ensureAuth, reminderController.deleteReminder)

module.exports = router