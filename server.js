const express = require('express')
const ffmpeg = require('fluent-ffmpeg');
const app = express()
const port = 3200
const bodyParser = require('body-parser')
const path = require('path');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const resizeVideo = async (inputFilePath, outputFilePath) => {
        const newWidth = 1080
        const newHeight = 1920
        const command = ffmpeg(inputFilePath).size(`${newWidth}x${newHeight}`).output(outputFilePath).on('start', function(commandLine) {
            console.log('Command issued');
          })
          .on('error', function(err, stdout, stderr) {
            console.log('An error occurred:', err.message);
            console.log('ffmpeg stdout:', stdout);
            console.log('ffmpeg stderr:', stderr);
          })
          .on('end', function() {
            console.log('Finished processing');
          });
        await command.run()
}

app.post('/', async (req, res) => {
    try{
        let inputFilePath = req.body.inputFilePath
        inputFilePath = path.normalize(inputFilePath)
        console.log("inputFilePath")
        let outputFilePath = req.body.outputFilePath
        outputFilePath = path.normalize(outputFilePath)
        resizeVideo(inputFilePath, outputFilePath)
        console.log("Video Resized Successfully")
        res.send("Video Resized.")
    }
    catch(e) {
        console.log(e.message || e.toString())
    }
})

app.listen(port, () => {
  console.log(`ffmpeg resizer listening on port ${port}`)
})