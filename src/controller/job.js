const Job = require('@model/job');
const Category = require('@model/category');
const error = require('@service/error');
const _ = require('lodash');

const create = async (req, res) => {
  const {
    title,
    description,
    salary,
    active,
  } = req.body;

  const { me } = req;

  const categoryId = req.body.category;
  const category = await Category.findById(categoryId).select('+jobs');

  if (!category) {
    error({
      res,
      status: 400,
      payload: 'Esta categoria não existe.',
    });
  }

  console.log(me);

  const slug = String(me._id)
    .slice(0, 10)
    .concat(`-${_.snakeCase(title)}`);

  const job = new Job({
    title,
    description,
    salary,
    slug,
    active,
  });

  job.category = category;
  job.author = me;
  category.jobs.push(job);

  try {
    await job.save();
    await category.save();

    res
      .status(201)
      .send({
        message: 'Anúncio criado com sucesso',
        job,
      });
  } catch (err) {
    console.log(err);
    error({ res });
  }
};

const read = async (req, res) => {
  const jobs = await Job.find();
  res.send(jobs);
};

module.exports = {
  create,
  read,
};
