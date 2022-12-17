const { Router } = require('express');
const router = Router()

const { renderSignUpForm, signUp, renderSignInForm, signIn, logOut } = require('../controllers/users.controller')

router.get('/signup', renderSignUpForm)
router.post('/users/signup', signUp)
router.get('/signin', renderSignInForm)
router.post('/users/signin', signIn)
router.post('/logout', logOut)

module.exports = router