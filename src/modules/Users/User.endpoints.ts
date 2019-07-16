export default [
  {
    'route': '/',
    'method': 'get',
    'description': 'get all users',
    '@middlewares': false,
    '@controller': {
      'method': 'index',
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
    'route': '/',
    'method': 'post',
    'description': 'post a new user',
    '@controller': {
      'method': 'create',
      'params': ['body.user']
    }
  }
]
