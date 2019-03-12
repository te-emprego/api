const bcrypt = require('bcryptjs');
const User = require('@model/user');
const Token = require('@service/token');

/**
 * Create a user and store it on database
 * @param {object} req express request object
 * @param {object} res express response object
 */
const signUp = async (req, res) => {
  if (await User.findOne({ email: req.body.email })) {
    return res
      .status(400)
      .send({ message: 'Este email já foi cadastrado.' });
  }

  // getting body info
  const {
    name,
    email,
    profile,
    password,
  } = req.body;

  const user = new User({
    name,
    email,
    profile,
    password,
  });

  console.log(user);

  // generates user gravatar
  user.avatar = user.gravatar();

  user.save((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: 'Erro ao criar usuário.', error: err });
    }
    res
      .status(201)
      .send({
        user,
        message: 'Usuário salvo com sucesso',
        token: Token.create(user),
      });
  });
};

/**
 * Generate a token based on user credentials
 * @param {object} req express request object
 * @param {object} res express response object
 */
const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res
      .status(404)
      .send({ message: 'Usuário não encontrado.' });
  }

  console.log(user.password, password);

  if (!await bcrypt.compare(password, user.password)) {
    return res
      .status(400)
      .send({ message: 'Credenciais inválidas.' });
  }

  user.password = undefined;
  res
    .status(200)
    .send({
      user,
      token: Token.create(user),
    });
};

module.exports = {
  signUp,
  signIn,
};
