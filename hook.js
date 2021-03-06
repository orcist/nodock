var spawn = require('child_process').spawn
var githubhook = require('githubhook')

var PROJECT = {
  repository: 'ExampleApp',
  name: 'example',
  path: '../example',
}
var DEPLOY_ARGS = {
  '--name': PROJECT.name + '-container',
  '-e': [
    'host=0.0.0.0',
    'port=80',
  ],
  '-p': '80:80',
  '-v': [
    PROJECT.path + ':/app',
    '/app/node_modules',
    'wwwroot:/wwwroot',
  ]
}

var github = githubhook({
  host: '0.0.0.0',
  port: '9001',
  path: '/',
})

github.on('pull_request:' + PROJECT.repository, function(ref, data) {
  if (
    data.pull_request &&
    data.action === 'closed' &&
    data.pull_request.merged === true &&
    data.pull_request.base.ref === 'master'
  ) {
    var args = unpackArgs(DEPLOY_ARGS)
    console.log('running', './deploy.sh ' + [PROJECT.name, PROJECT.path, 'master', args].join(' '))

    var child = spawn('bash',
      ['./deploy.sh', PROJECT.name, PROJECT.path, 'master']
        .concat(args.split(' '))
        .filter(function(e) { return e !== '' })
    )
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', function(data) {
        console.log(data)
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', function(error) {
        console.log(error)
    })
  }
})

function unpackArgs(args) {
  var strArgs = ''
  for (var key in args) {
    if (typeof args[key] === 'string') {
      strArgs += [key, args[key]].join(' ') + ' '
    } else if (args[key] instanceof Array) {
      strArgs += args[key].cyclicZip([key]).reverse().join(' ') + ' '
    } else {
      console.error('Argument of unexpected type: ' + typeof args[key])
    }
  }
  return strArgs
}

Array.prototype.cyclicZip = function(other) {
  if (!(other instanceof Array)) {
    console.error('Cannot zip Array with ' + (typeof other) + '.')
    return
  }

  return [].concat.apply(
    [],
    this.map(function(e, i) {
      return [e, other[i % other.length]]
    })
  )
}

github.listen()
