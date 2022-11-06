const authMsg = {
    emailAlreadyInUse: 'Email already in use. Please Sign in',
    userDoesnotExist: 'User does not exist',
    emailAndPasswordDonotMatch: 'Email and password do not match',
    signout: 'User signout successfully',
    threeChar: (field) => `${field} must be at least 3 charaters`,
    isRequired: (field) => `${field} is required`,
}

module.exports = { authMsg };