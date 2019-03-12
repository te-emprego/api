const Profile = require('@model/profile');

const create = async (req, res) => {
  const { name, permissions } = req.body;
  const profile = new Profile({ name, permissions });

  await profile.save((err, profile) => {
    if (err) {
      return res
        .status(500)
        .send({ message: 'Erro interno do servidor.' });
    }
    res
      .status(201)
      .send({
        message: 'Perfil salvo com sucesso',
        profile,
      });
  });
};

const view = async (req, res) => {
  const profiles = await Profile.find();
  res.send(profiles);
};

module.exports = {
  create,
  view,
};
