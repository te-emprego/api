const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('@model/user');
const Profile = require('@model/profile');
const Token = require('@service/token');
const mailer = require('@service/mailer');

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

    await User.findByIdAndUpdate(user.id, {
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
      console.log(err);
      if (err) {
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

const setProfile = async (req, res) => {
  const { userId, profileId } = req.body;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res
      .status(404)
      .send({ message: 'Usuário não encontrado.' });
  }

  const profile = await Profile.findOne({ _id: profileId });

  if (!profile) {
    return res
      .status(404)
      .send({ message: 'Perfil não encontrado.' });
  }

  user.profile = profile;
  profile.users.push(profile);

  await user.save();
  await profile.save();

  res.send({
    user,
    message: 'Perfil atualizado com sucesso.',
  });
};

module.exports = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  setProfile,
};
