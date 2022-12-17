const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (usernameField, passwordField, done) => {
  console.log(email)
  const user = await User.findOne({'email': usernameField})
  if (!user) {
    return done(null, false, {error_msg: 'User Not Found'})
  } else {
    const match = await user.matchPassword(passwordField)
    if (match) {
      return done(null, user)
    } else {
      return done(null, false, {error_msg: 'The credentials are incorrect'})
    }
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})