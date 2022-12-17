const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')

const SessionSchema = new Schema ({
  user_id: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  token: {
    type: String,
    required: true
  }

}, {
  timestamps: true
})

SessionSchema.methods.encryptToken = async token => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(token, salt)
}

SessionSchema.methods.matchToken = async function (token) {
  return await bcrypt.compare(token, this.token)
}

module.exports = model('Session', SessionSchema);