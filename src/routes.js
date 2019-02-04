const router = require('express').Router()
const {
    validarACL,
    login,
    criarUsuario
} = require('./controllers')

router
    .post('/login', login)
    .post('/criar', criarUsuario)
    .post('/acl', validarACL)

module.exports = router
