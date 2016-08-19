var spawn = require('child_process').spawn
var github = require('githubhook').githubhook({
  host: '0.0.0.0',
  port: '9001',
  path: '/',
})

var reponame = 'ExampleApp'
var deployDir = '../example'
var deployEnv = 'exenv'

github.on(reponame + ':ref/heads/master', function (event, data) {
  console.log('event', JSON.stringify(event))
  if (
    event.pull_request &&
    event.action === 'closed' &&
    event.pull_request.merged === true
  ) {
    spawn('sh', ['./deploy.sh', deployDir, deployEnv])
  }
})

github.listen()
