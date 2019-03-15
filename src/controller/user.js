const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('@model/user');
const Profile = require('@model/profile');
const Token = require('@service/token');
const mailer = require('@service/mailer');
const error = require('@service/error');

const helpers = {
  decodeToken(bearer) {
    return new Promise((resolve, reject) => {
      const [, token] = bearer.split(' ');
      Token
        .decode(token)
        .then(userId => resolve(userId))
        .catch(err => reject(err));
    });
  },
  getUserInfo(id) {
    return new Promise((resolve, reject) => {
      User
        .findById(id)
        .populate('profile')
        .exec((err, user) => {
          err ? reject(err) : resolve(user);
        });
    });
  },
  isAdmin(user) {
    return user.profile.permissions.includes('admin');
  },
  async amITheSource(me, bearer) {
    const userId = await this.decodeToken(bearer);
    return userId === me._id;
  },
};

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

/**
 * Sends a mail to user with the password reset token
 * @param {object} req express request object
 * @param {object} res express response object
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ message: 'Usuário inexistente.' });
    }

    // random 30 char token
    const token = crypto.randomBytes(30).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findOneAndUpdate({ _id: user.id }, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
        tokenIsUsed: false,
      },
    });

    mailer.sendgrid.sendMail({
      to: email,
      from: 'no-reply@teemprego.com.br',
      subject: 'Recuperar senha',
      template: 'mail',
      context: { token, name: user.name },
    }, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .send({
            message: 'Erro ao enviar email para recuperação de senha.',
          });
      }

      res.send();
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Sets a new password to user
 * @param {object} req express request object
 * @param {object} res express response object
 */
const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires tokenIsUsed');

    if (!user) {
      return res
        .status(404)
        .send({ message: 'Credenciais inválidas.' });
    }

    if ((token !== user.passwordResetToken) || user.tokenIsUsed) {
      return res
        .status(400)
        .send({ error: 'Token inválido.' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res
        .status(401)
        .send({ error: 'Token expirado. Gere outro.' });
    }

    user.password = password;
    user.tokenIsUsed = true;
    await user.save();

    res.send({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    if (err) {
      return res
        .status(500)
        .send({ error: 'Erro interno do servidor.' });
    }
  }
};

/**
 * Sets a profile in user info
 *
 * @param {object} req express request object
 * @param {object} res express resposnse object
 */
const setProfile = async (req, res) => {
  const { me } = req;
  const { userId, profileId } = req.body;

  const user = await helpers.getUserInfo(userId);
  const profile = await Profile
    .findOne({ _id: profileId })
    .select('+users');

  if (!helpers.isAdmin(me)) {
    return error({
      res,
      status: 401,
      payload: 'Você não tem permissão para fazer isso.',
    });
  }

  if (!profile) {
    return res
      .status(404)
      .send({ message: 'Perfil não encontrado.' });
  }

  user.profile = profile;

  const has = await Profile.findOne({ users: { _id: userId } });
  if (!has) {
    profile.users.push(user);
  }

  await user.save();
  await profile.save();

  res.send({
    user,
    message: 'Perfil atualizado com sucesso.',
  });
};

/**
 * Verify if token is valid and if the inner
 * profile contains the requested permission
 *
 * @param {object} req express request object
 * @param {object} res express response object
 */
const hasPermission = async (req, res) => {
  const { token, permission } = req.body;

  Token
    .decode(token)
    .then((userId) => {
      User
        .findOne({ _id: userId })
        .populate('profile')
        .exec((err, user) => {
          user.profile.permissions.includes(permission)
            ? res.send(user)
            : res.status(401).send({ message: 'Não tem permissão' });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: 'Token inválido.' });
    });
};

/**
 * Get user info by token
 * @param {object} req express request object
 * @param {object} res express response object
 */
const getUserByToken = async (req, res) => {
  const { authorization } = req.headers;

  const [, token] = authorization.split(' ');

  Token
    .decode(token)
    .then((userId) => {
      User
        .findById(userId)
        .populate('profile')
        .exec((err, user) => {
          err
            ? res.status(500).send({ message: 'Erro interno do servidor. Não foi possível trazer o usuário.' })
            : res.send(user);
        });
    })
    .catch(err => res.status(err.status).send(err.message));
};

/**
 * Update user properties
 *
 * @middleware whoAmI
 * @param {object} req express request object
 * @param {object} res express response object
 */
const updateProps = async (req, res) => {
  const { user } = req.body;
  const { me } = req;

  // check if email already exists
  const exists = await User.findOne({ email: user.email });
  if (exists) {
    return error({
      res,
      status: 400,
      payload: 'O email informado já está cadastrado no sistema.',
    });
  }

  User
    .findOneAndUpdate({ _id: me._id }, {
      $set: {
        ...user,
      },
    }, { new: true })
    .exec((err, newUser) => {
      if (err) {
        console.log(err);
        return error({ res });
      }
      res.send({ newUser });
    });
};

module.exports = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  setProfile,
  hasPermission,
  getUserByToken,
  updateProps,
  helpers,
};
