const Job = require('@model/job');
const Category = require('@model/category');
const error = require('@service/error');
const _ = require('lodash');

const create = async (req, res) => {
  const { job } = req.body;
  const { me } = req;

  const categoryId = req.body.job.category;
  const category = await Category.findById(categoryId).select('+jobs');

  if (!category) {
    error({
      res,
      status: 400,
      payload: 'Esta categoria não existe.',
    });
  }

  const slug = String(me._id)
    .slice(0, 10)
    .concat(`-${_.snakeCase(job.title)}`);

  const newJob = new Job(job);

  newJob.category = category;
  newJob.slug = slug;
  newJob.author = me;
  category.jobs.push(newJob);

  try {
    await newJob.save();
    await category.save();

    res
      .status(201)
      .send({
        message: 'Anúncio criado com sucesso',
        newJob,
      });
  } catch (err) {
    console.log(err);
    error({ res });
  }
};

const read = async (req, res) => {
  const jobs = await Job.find().populate('author');
  res.send(jobs);
};

module.exports = {
  create,
  read,
};
