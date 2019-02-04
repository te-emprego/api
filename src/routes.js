const router = require('express').Router()
const { validarACL, login } = require('./controllers')

router
    .get('/login/:id', login)
    .post('/acl', validarACL)

module.exports = router
