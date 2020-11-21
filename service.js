const Service = require('node-mac').Service

require('dotenv').config()

const service = new Service({
  name: 'Doorbell notifier',
  description: 'Sends notifications when doorbell rings',
  script: `${__dirname}/run.js`,
  env: {

  },
})

service.on('install', () => service.start())
service.on('alreadyinstalled', () => service.start())

service.install()
