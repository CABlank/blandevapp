const path = require('path')

const usersCtrl = { }
const User = require('../models/User')
const Session = require('../models/Session')

const passport = require('passport')

usersCtrl.renderSignUpForm = async (req, res) => {
  res.render(path.join(__dirname, '../signUp.html'))
}

closeSession = async(sessionId) => {
  const sessionFinded = await Session.findById(sessionId)
  sessionFinded.active = false
  sessionFinded.save()
  console.log('Session Closed')
}

usersCtrl.signUp = async (req, res) => {
  const form = req.fields
  let error_msgs = []
  
  

  if (form.password.length < 4) {
    error_msgs.push('Password must be at least 4 characters')
  }
  if (form.password != form.confirm_password) {
    error_msgs.push('Passwords do not match')
  }
  const findedUser = await User.findOne({email: form.email})
  if(findedUser) {
    error_msgs.push('Email is already in use.')
  }
  else {
    const newUser = new User({name: form.name, lastname: form.lastname, email: form.email, password: form.password, role: form.role})
    newUser.password = await newUser.encryptPassword(form.password)
    await newUser.save()
  }

  console.log(error_msgs)

  if(error_msgs.length > 0) {
    res.send({error_msgs: error_msgs})
  } else {
    res.send({ success_msg: 'User Registred Correctly'})
  }
}

usersCtrl.renderSignInForm = async (req, res) => {
  res.render(path.join(__dirname, '../signIn.html'))
}

usersCtrl.signIn =  async (req, res) => {
  const user = await User.findOne({'email': req.fields.email})
 
  if (user) {
    const match = await user.matchPassword(req.fields.password)
    if(match) {
      const newSession = new Session({'user_id': user.id, 'active': true})
      const d = new Date();
      let hour = d.getHours();
      const tokenNotEncrypted = user.id+'-'+hour+'H'
      const token = await newSession.encryptToken(tokenNotEncrypted)
      // console.log(token)
      newSession.token = token
      newSession.save()
      console.log('Successfull Login')
      await setTimeout( function() { closeSession(newSession.id); }, 2000 * 60 * 60);
      res.send({'token': tokenNotEncrypted, 'id': newSession.id})
    } else {
      console.log('Password not match')
      res.send({'error_msg': 'Password not match'})
    }
  } else {
    console.log('Email has not registered')
    res.send({'error_msg': 'Email has not registered'})
  }
}

usersCtrl.logOut = async (req, res) => {
  res.send('Logout')
}

module.exports = usersCtrl