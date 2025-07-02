// const { response } = require("express")

const passwordValidation = (request) => {
    const password = request.headers.authorization

    if (
        password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$&*]/.test(password)) {
        return true
    }
    else {
        return false
    }


}
module.exports = { passwordValidation }