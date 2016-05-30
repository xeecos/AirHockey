var MjpegCamera = require('mjpeg-camera');
var FileOnWrite = require('file-on-write');
var fs = require('fs');
 
// Create a writable stream to generate files 
var fileWriter = new FileOnWrite({
  path: './frames',
  ext: '.jpeg',
  filename: function(frame) {
    return frame.name + '-' + frame.time;
  },
  transform: function(frame) {
    return frame.data;
  }
});
 
// Create an MjpegCamera instance 
var camera = new MjpegCamera({
  name: 'backdoor',
  url: 'http://localhost/video',
  motion: true
});
 
// Pipe frames to our fileWriter so we gather jpeg frames into the /frames folder 
camera.pipe(fileWriter);
 
// Start streaming 
camera.start();
 
// Stop recording after an hour 
setTimeout(function() {
 
  // Stahp 
  camera.stop();
 
  // Get one last frame 
  // Will open a connection long enough to get a single frame and then 
  // immediately close the connection 
  camera.getScreenshot(function(err, frame) {
    fs.writeFile('final.jpeg', frame, process.exit);
  });
 
}, 60*60*1000);