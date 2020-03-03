const ntClient = require('wpilib-nt-client');
const express = require('express')
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
    const stage1 = localKey.split(".")[0]
    const stage2 = localKey.split(".")[1]

    if (!currentRobotData[stage1]) {
      currentRobotData[stage1] = {}
    }

    currentRobotData[stage1][stage2] = val
  }
})

io.on('connection', (socket) => {
  console.log("Connection!")
})

setInterval(() => {
  io.emit('update', currentRobotData)
}, 25)

const app = express()
app.use(express.static('../2020-telemetry-dashboard/www'))

app.listen(8080)
