const mongoose = require('mongoose')
const { mailChecks } = require('../helpers/hbs')

const SpreadsheetSchema = new mongoose.Schema({
  spreadsheet: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
  },
})

module.exports = mongoose.model('Spreadsheet', SpreadsheetSchema)
