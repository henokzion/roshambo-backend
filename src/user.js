const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  username: String,
  mnemonic: String,
}, {
  timestamps: true,
})

// Before creating a new user, encrypt the password
userSchema.pre('save', async function(next) {
  const user = this
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
    // if (user.mnemonic && user.mnemonic.length > 0) {
    //   const hashedMnemonic = await bcrypt.hash(user.mnemonic, 10)
    //   user.mnemonic = hashedMnemonic
    // }
    next()
  } catch(err) {
    next(err)
  }
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(false)
    cb(isMatch)
  })
}

// userSchema.methods.compareMnemonic = function(candidateMnemonic, cb) {
//   bcrypt.compare(candidateMnemonic, this.mnemonic, (err, isMatch) => {
//     if (err) return cb(false)
//     cb(isMatch)
//   })
// }

const User = mongoose.model('User', userSchema)
module.exports = User
