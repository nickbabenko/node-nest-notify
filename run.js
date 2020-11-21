const mqtt = require('mqtt')
const notifier = require('node-notifier')
const open = require('open')
const axios = require('axios')

const client = mqtt.connect(process.env.MQTT_URL)

client.on('connect', () => { 
  console.log('MQTT connected')
  client.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) {
      console.log('Failed to subscribe to topic')
    }
  })
})

client.on('disconnect', () => {
  console.log('MQTT disconnected. Reconnecting')
  client.reconnect()
})

client.on('message', async (topic, payload) => {
  console.log('message received')
  if (topic === process.env.MQTT_TOPIC) {
    const body = JSON.parse(payload)

    let contentImage = undefined
    try {
      const response = await axios({
        url: body.url,
        headers: {
          'Authorization': `Basic ${body.token}`,
        }
      })
      contentImage = `/tmp/nest-doorbell-${new Date().getTime()}`
      require('fs').writeFileSync(imageFile, response.body)
    } catch (e) {}

    notifier.notify({
      title: 'Nest',
      message: 'There is someone at the door',
      sound: true,
      wait: true,
      contentImage,
    })
  }
})

notifier.on('click', () => {
  open('https://home.nest.com')
})
