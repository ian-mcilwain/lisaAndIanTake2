// define namespace
app = {};

//mke the canvas and the 2d context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// set canvas width and height to be that of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// grab the video element with jQuery
app.video = $('video.webcam')[0];
// grab the canvas with jquery
app.canvas = $('canvas.photo')[0];

app.getVideo = function() {

  // normalize so it works on all browsers in the future all browsers will get navigator.getUserMedia()
  navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  navigator.getUserMedia ({ video: true,  audio: true }, function(localMediaStream) {
    // set the video source
    app.video.src = window.URL.createObjectURL(localMediaStream);
    // play the video!
    app.video.play();
  },
  // errorCallback
  function(err) {
    console.log("The following error occured: " + err);
 });
}

app.takePhoto = function() {
  /* The next four lines set the canvas to the same size as the video */
  var width = $(app.video).width();
  var height = $(app.video).height();
  app.canvas.width = width;
  app.canvas.height = height;

  // Then we "draw" the video (one frame) to the canvas
  app.canvas.getContext('2d').drawImage(app.video, 0, 0, width, height);
  
  // Then we convert that canvas to a "data blob"  which is like an image src
  var data = app.canvas.toDataURL('image/png');
  
  // 1. create an image 2. set the source the be the data 3. append to an element
  $('<img>').attr('src',data).appendTo('.strip');
}



app.server = 'http://api.us.faceplusplus.com/v2';
app.key = 'b76b9735bd2795ac44068c6b4d01d96e';
app.secret = 'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw';

app.url = app.server + 'detection/detect' + app.secret;

//http://apius.faceplusplus.com/v2/detection/detect?api_key=DEMO_KEY&api_secret=DEMO_SECRET

// Initialize API Object.
var api = new FacePP('b76b9735bd2795ac44068c6b4d01d96e',
                     'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw',
                     { apiURL: 'http://apius.faceplusplus.com /v2/detection/detect?api_key=b76b9735bd2795ac44068c6b4d01d96e&api_secret=CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw' });

// Call the Detection request.
api.request('detection/detect', {
  url: 'http://cn.faceplusplus.com/static/resources/python_demo/1.jpg'
}, function(err, result) {
  if (err) {
    $('#response').text('Load failed.');
    return;
  }

  //append the response to the DOM
  $('#response').text(JSON.stringify(result));

  console.log(result);

}); // end api.request

// DOCUMENT READY
$(function() {
	// app.init();
  app.getVideo();
})
