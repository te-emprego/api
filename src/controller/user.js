const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('@model/user');
const Profile = require('@model/profile');
const Token = require('@service/token');
const mailer = require('@service/mailer');
const error = require('@service/error');
const logger = require('@service/logger');
const imgur = require('imgur');
const rimraf = require('rimraf');

const UserController = {
  helpers: {
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
    unlink(filePath) {
      rimraf.sync(filePath);
    },
  },

  /**
   * Create a user and store it on database
   * @param {Request} req express request object
   * @param {Response} req express request object
   */
  async signUp(req, res) {
    if (await User.findOne({ email: req.body.email })) {
      logger.error(`Tentativa de criar uma conta duplicada para o email: ${req.body.email}`);
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

    // email confirmation token
    const token = (await crypto.randomBytes(56)).toString('hex');
    user.email_confirmation_token = token;

    user.save((err) => {
      if (err) {
        logger.error(`Houve um erro ao criar o usuário ${user.email}`);
        return res
          .status(500)
          .send({
            message: 'Erro ao criar usuário.',
            error: err,
          });
      }

      mailer.sendgrid.sendMail({
        to: email,
        from: 'no-reply@teemprego.com.br',
        subject: 'Bem vindo',
        template: 'bem-vindo',
        context: {
          token,
          name: user.name,
          email: user.email,
          appBase: 'http://localhost:3000',
          imagesBase: 'https://teemprego.com.br/content/mail',
        },
      }, (err) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .send({
              message: 'Erro ao enviar email para recuperação de senha.',
            });
        }

        logger.info(`Usuário criado: ${user.email}`);
        res
          .status(201)
          .send({
            user,
            message: 'Conta criada com sucesso.',
            token: Token.create(user),
          });
      });
    });
  },

  /**
 * Generate a token based on user credentials
 * @param {Request} req express request object
 * @param {Response} req express request object
 */
  async signIn(req, res) {
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
  },

  /**
   * Sends a mail to user with the password reset token
   * @param {Request} req express request object
   * @param {Response} req express request object
   */
  async forgotPassword(req, res) {
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
        template: 'recuperar-senha',
        context: { token, name: user.name, email: user.email },
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
  },

  /**
   * Sets a new password to user
   * @param {Request} req express request object
   * @param {Response} req express request object
   */
  async resetPassword(req, res) {
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
  },

  /**
   * Sets a profile in user info
   *
   * @param {Request} req express request object
   * @param {object} res express resposnse object
   */
  async setProfile(req, res) {
    const { me } = req;
    const { userId, profileId } = req.body;

    const user = await this.helpers.getUserInfo(userId);
    const profile = await Profile
      .findOne({ _id: profileId })
      .select('+users');

    if (!this.helpers.isAdmin(me)) {
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
  },
  /**
   * Verify if token is valid and if the inner
   * profile contains the requested permission
   *
   * @param {Request} req express request object
   * @param {Response} req express request object
   */
  async hasPermission(req, res) {
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
  },

  /**
   * Get user info by token
   * @param {Request} req express request object
   * @param {Response} req express request object
   */
  async getUserByToken(req, res) {
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
  },

  /**
   * Update user properties
   *
   * @param {Request} req express request object
   * @param {Response} req express request object
   */
  async updateProps(req, res) {
    const { user } = req.body;
    const { me } = req;

    // can't update email here
    if (user.email) {
      delete user.email;
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
  },

  /**
   * Upload a profile picuture and update it
   * @param {Request} req express request object
   * @param {Response} res express response object
   */
  async uploadProfilePicture(req, res) {
    const { avatar } = req.files;
    if (avatar.size > 100000) {
      return res
        .status(400)
        .send({ message: 'A imagem não pode ter mais que 1Mb' });
    }
    imgur
      .uploadFile(avatar.path)
      .then(async (json) => {
        const { link } = json.data;
        const { me } = req;

        const user = await User.findOne({ _id: me._id });
        user.avatar = link;
        user.save();

        this.helpers.unlink(avatar.path);

        return res
          .status(200)
          .send({
            user,
            message: 'Avatar salvo com sucesso.',
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  /**
   * Confirm user email
   * @param {Request} req express request object
   * @param {Response} res express response object
   */
  async confirmEmail(req, res) {
    const { token } = req.query;

    const user = await User.findOne({ email_confirmation_token: token });

    if (!user) {
      return res
        .status(400)
        .send({ message: 'Este token não é válido' });
    }

    if (user.email_confirmed === true) {
      return res
        .send(200)
        .send({ message: 'Este usuário já está confirmado.' });
    }

    user.email_confirmed = true;

    await user.save();
    return res
      .status(200)
      .send({ message: 'Email confirmado com sucesso.' });
  },

  /**
   * Update actual user email
   * @param {Request} req express request object
   * @param {Response} res express response object
   */
  async requestEmailUpdate(req, res) {
    const { me } = req;
    const { email } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .send({
          message: 'Este email já está cadastrado.',
        });
    }

    try {
      const user = await User.findOne({ _id: me._id });
      const token = (await crypto.randomBytes(56)).toString('hex');

      user.new_email = email;
      user.new_email_confirmation_token = token;

      await user.save();

      mailer.sendgrid.sendMail({
        to: email,
        from: 'no-reply@teemprego.com.br',
        subject: 'Confirmar novo email',
        template: 'novo-email',
        context: {
          token,
          name: user.name,
          email: user.new_email,
          appBase: 'http://localhost:3000',
          imagesBase: 'https://teemprego.com.br/content/mail',
        },
      }, (err) => {
        if (err) { throw err; }

        logger.info(`Usuário solicitou alteração do email: ${user.email} para o email: ${user.new_email}`);

        res
          .status(201)
          .send({
            message: 'Confirme seu novo email.',
          });
      });
    } catch (err) {
      logger.error(err);
      console.log(err);
      return res
        .status(500)
        .send({ message: 'Erro interno do servidor.' });
    }
  },

  /**
   * Confirm the new email
   * @param {Request} req express request object
   * @param {Response} res express response object
   */
  async confirmEmailUpdate(req, res) {
    const { token } = req.query;

    const user = await User.findOne({ new_email_confirmation_token: token });
    if (!user) {
      return res
        .status(200)
        .send({ message: 'O usuário não tem comparativo.' });
    }

    user.email = user.new_email;
    user.new_email = '';
    user.new_email_confirmation_token = '';

    await user.save();
    return res
      .send({ message: 'Email atualizado com sucesso.' });
  },
};

module.exports = UserController;
