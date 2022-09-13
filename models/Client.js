const mongoose = require('mongoose')
const { mailChecks } = require('../helpers/hbs')
const uniqueValidator = require('mongoose-unique-validator')

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
    default: 'Open',
    enum: ['Open', 'Closed']
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
    unique: true,
    uniqueCaseInsensitive: true
    //! letter hyphen number
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  notes: {
    type: String,
  },
  safetyConcern: {
    type: Boolean,
    required: true
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
  // lastChecked: {
  //   type: Date,
  //   default: Date.now
  // },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  // org: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Org',
  //   required: true
  // }
})

// ClientSchema.virtual('lastChecked').get(function() {
//   return this.mailChecks[mailChecks.length - 1]
// })

ClientSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Client', ClientSchema)
