export default [
  {
    'route': '/',
    'method': 'get',
    'description': 'get all users',
    '@middlewares': false,
    '@controller': {
      'method': 'list',
      'params': []
    }
  },
  {
    'route': '/login',
    'method': 'post',
    'description': 'login user in',
    '@middlewares': false,
    '@controller': {
      'method': 'login',
      'params': ['body.credentials']
    }
  },
  {
    'route': '/:userId',
    'method': 'put',
    'description': 'update user props',
    '@controller': {
      'method': 'updateInfo',
      'params': ['params.userId', 'body.props']
    }
  },
  {
    'route': '/:userId',
    'method': 'get',
    'description': 'get specific user by id',
    '@controller': {
      'method': 'find',
      'params': ['params.userId']
    }
  },
  {
    'route': '/',
    'method': 'post',
    'description': 'post a new user',
    '@controller': {
      'method': 'create',
      'params': ['body.user']
    }
  }
]
