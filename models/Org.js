const mongoose = require('mongoose')

const OrgSchema = new mongoose.Schema({
  org: {
    type: String,
    required: true,
  },
  codeword: {
    type: String
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }]
})

module.exports = mongoose.model('Org', OrgSchema)
