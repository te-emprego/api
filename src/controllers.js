const jwt = require('jsonwebtoken');
const Users = require('./models');

function hasRole(perm, slug) {
  return RegExp(`^${perm}`, 'gi').test(slug);
}

module.exports = {
  async criarUsuario(req, res) {
    const {
      email, nome, permissoes, senha,
    } = req.body;

    const created = await Users.create({
      nome, email, senha, permissoes,
    });

    return res
      .status(201)
      .send({ user: created });
  },

  async login(req, res) {
    const { email, senha } = req.body;

    const user = await Users.find(email);

    if (user.senha !== senha) {
      return res
        .status(401)
        .send({ message: 'Credenciais incorretas.' });
    }

    if (user === undefined) {
      return res
        .status(404)
        .send({ message: 'Usuário não encontrado.' });
    }

    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '24h' });

    res
      .status(200)
      .send({ token });
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
    const { token, slug } = req.body;

    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err || user === undefined) {
        return res
          .status(400)
          .send({ message: 'Token inválido.' });
      }

      const permissao = user.permissoes.find(perm => hasRole(perm, slug));

      if (permissao === undefined) {
        return res
          .status(401)
          .send({ message: 'Permissão não encontrada.' });
      }

      return res
        .status(200)
        .send({ message: 'Permissão encontrada.' });
    });
  },


};
