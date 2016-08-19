var spawn = require('child_process').spawn
var github = require('githubhook').githubhook({
  host: '0.0.0.0',
  port: '9001',
  path: '/',
})

var reponame = 'SomeApp'
var deployDir = '../someapp'

github.on(reponame + ':ref/heads/master', function (event, data) {
  console.log('event', JSON.stringify(event))
  if (
    event.pull_request &&
    event.action === 'closed' &&
    event.pull_request.merged === true
  ) {
    spawn('sh', ['./deploy.sh', deployDir])
  }
})

github.listen()
