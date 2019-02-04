const router = require('express').Router()
const { validarACL } = require('./controllers')

router
    .post('/acl', validarACL)

module.exports = router