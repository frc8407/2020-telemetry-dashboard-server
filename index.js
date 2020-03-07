const ntClient = require('wpilib-nt-client');
const express = require('express')
const _ = require('lodash')
const io = require('socket.io')(3008)

const client = new ntClient.Client()

// Connects the client to the server on team 3571's roborio
client.start((isConnected, err) => {
  // Displays the error and the state of connection
  console.log({ isConnected, err });
}, 'roborio-8407-frc.local');

const currentRobotData = {

}
// Adds a listener to the client
client.addListener((key, val, type, id) => {
  if (key.startsWith("/dashboard/")) {
    const localKey = key.split("/")[2]

    _.set(currentRobotData, localKey, val)
  }
})

io.on('connection', (socket) => {
  console.log("Connection!")

  socket.on('pid-update', (v) => {
    const name = v.name
    const settings = v.settings

    client.Assign(settings.p, `/dashboard/pid/${name}/p`, true)
    client.Assign(settings.i, `/dashboard/pid/${name}/i`, true)
    client.Assign(settings.d, `/dashboard/pid/${name}/d`, true)
    client.Assign(settings.ff, `/dashboard/pid/${name}/ff`, true)
  })
})

setInterval(() => {
  io.emit('update', currentRobotData)
}, 25)

const app = express()
app.use(express.static('../2020-telemetry-dashboard/www'))

app.listen(8080)
