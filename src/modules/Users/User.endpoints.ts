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
    'route': '/',
    'method': 'post',
    'description': 'post a new user',
    '@controller': {
      'method': 'create',
      'params': ['body.user']
    }
  }
]
