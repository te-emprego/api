const Users = require('./models')

module.exports = {
    validarACL(req, res) {
        const { uid, slg } = req.body
        
        const user = Users.find(user => user.id === uid)

        if (user === undefined) {
            return res
                .status(404)
                .send({ message: 'Usuário não encontrado.' })
        }

        const permissao = user.permissoes.find(slug => slug === slg)

        if (permissao === undefined) {
            return res
                .status(401)
                .send({ message: 'Permissão não encontrada.' })
        }
        
        return res
            .status(200)
            .send({ message: 'Permissão encontrada' })
    }
}