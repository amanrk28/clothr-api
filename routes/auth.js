var express = require('express');
var router = express.Router();
const { signout, signup, signin } = require('../controllers/auth');
const {
    validateSigninBody,
    validateSignupBody,
} = require('../middlewares/auth');

router.post('/signup', validateSignupBody, signup);
router.post('/signin', validateSigninBody, signin);

router.get('/signout', signout);

module.exports = router;
