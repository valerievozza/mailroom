const mongoose = require('mongoose')

const ReminderSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org'
  },
  deleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Reminder', ReminderSchema)
