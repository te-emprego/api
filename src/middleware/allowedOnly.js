const error = require('@service/error');

/**
 * Block not allowed users
 * @param {string} permissionNeeded Permission that user need to pass
 * @param {boolean} canAdminDoIt Administrator can do this too
 */
const allowedOnly = (permissionNeeded, canAdminDoIt = true) => (req, res, next) => {
  const { me } = req;

  const permission = me.profile.permissions
    .find(permission => permission === permissionNeeded || (canAdminDoIt && 'admin'));

  const canPass = permission !== undefined;

  return canPass
    ? next()
    : error({
      res,
      status: 400,
      payload: 'Você não pode realizar essa ação.',
    });
};

module.exports = allowedOnly;
