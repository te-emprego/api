const Category = require('@model/category');
const logger = require('@service/logger');

/**
 * Creates a new version
 * @error E10001
 * @param {object} req express request object
 * @param {object} res express response object
 */
const create = async (req, res) => {
  const E_CODE = 'E10001';
  const { title, description } = req.body;
  const category = new Category({ title, description });

  await category.save((err, category) => {
    if (err) {
      logger.error(err.message || err, { key: E_CODE });
      return res
        .status(500)
        .send({
          message: 'Erro interno do servidor.',
          code: E_CODE,
        });
    }
    logger.info(`Nova categoria adicionada: ${category.title}`);
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
