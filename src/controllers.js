const Users = require('./models')
const jwt = require('jsonwebtoken')

module.exports = {
    login(req, res) {
        const { id } = req.params
        const user = Users.find(user => user.id == id)

        if (user === undefined) {
            return res
                .status(404)
                .send({ message: 'Usuário não encontrado.' })
        }

        const token = jwt.sign(user, process.env.SECRET, { expiresIn: '24h' })

        res.send({ token })
    },

    /**
     * Valida se o usuário possui permissão para executar determinada ação
     * 
     * Status:
     * 200 => pode executar
     * 400 => o token não é válido
     * 401 => não pode executar
     * 
     * @param {object} req express request
     * @param {object} res express response
     */
    validarACL(req, res) {
        const { token, slug } = req.body

        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err || user === undefined) {
                return res
                    .status(400)
                    .send({ message: 'Token inválido.' })
            }

            const permissao = user.permissoes.find(perm => perm === slug)

            if (permissao === undefined) {
                return res
                    .status(401)
                    .send({ message: 'Permissão não encontrada.' })
            }

            return res
                .status(200)
                .send({ message: 'Permissão encontrada.' })
        })
    }


}