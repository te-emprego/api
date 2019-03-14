const Category = require('@model/category');

const create = async (req, res) => {
  const { title, description } = req.body;
  const category = new Category({ title, description });

  await category.save((err, category) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: 'Erro interno do servidor.' });
    }
    res
      .status(201)
      .send({
        message: 'Categoria criada com sucesso',
        category,
      });
  });
};

const read = async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
};

module.exports = {
  create,
  read,
};
