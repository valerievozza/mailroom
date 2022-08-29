const mongoose = require('mongoose')

const OrgSchema = new mongoose.Schema({
  orgName: {
    type: String,
    required: true,
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
