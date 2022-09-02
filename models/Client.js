const mongoose = require('mongoose')
const { mailChecks } = require('../helpers/hbs')

const ClientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  otherNames: {
    type: String
  },
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'closed']
  },
  //! add function to autogenerate box letter from first letter of last name
  // boxLetter: {
  //   type: String,
  //   required: true
  // },
  //! add function to autogenerate box number from next available whole number for that letter
  // boxNumber: {
  //   type: Number,
  //   required: true
  // },
  box: {
    type: String,
    //! letter hyphen number
  },
  notes: {
    type: String,
  },
  safetyConcern: {
    type: Boolean,
    default: false
  },
  fwdAddress: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  //! add option to set date manually
  mailChecks: [{
    type: Date,
    default: Date.now
  }],
  lastChecked: {
    type: Date,
    default: mailChecks[mailChecks.length - 1],
    ref: 'Client'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // org: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Org',
  //   required: true
  // }
})

module.exports = mongoose.model('Client', ClientSchema)
