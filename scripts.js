// define namespace
app = {};

// grab the video element with jQuery
app.video = $('.webcam')[0];
// grab the canvas with jquery
app.canvas = $('.photo')[0];

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

  console.log(data);
  
  // 1. create an image 2. set the source the be the data 3. append to an element
  var img = $('<img>').attr('src',data);
  var link = $("<a>").attr("download","so-good-looking").attr("href",data);

  console.log(img);
  console.log(link);


  img.appendTo(link);
  link.appendTo('.strip');
}



app.server = 'http://api.us.faceplusplus.com/v2';
app.key = 'b76b9735bd2795ac44068c6b4d01d96e';
app.secret = 'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw';

app.url = app.server + 'detection/detect' + app.secret;

app.detectFace = function(){
	$.ajax({
		url : 'https://apius.faceplusplus.com/v2/detection/detect?url=http://fabulousbuzz.com/wp-content/uploads/2011/09/michelle-obama-tennis-us-open-05_prphotos.jpg&api_secret=CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw&api_key=b76b9735bd2795ac44068c6b4d01d96e&attribute=smiling',
		type : "GET",
		dataType : 'json',
		success : function(data) {
			console.log(data);
			// weatherApp.isThereWeather(data);
		}
	}); // end ajax
}





// DOCUMENT READY
$(function() {
	// app.init();
  app.getVideo();
  app.detectFace();

    $('a.snap').on('click',function(e) {
      e.preventDefault();
      // find the wait time
      var waitTime = $(this).data('wait');
      var waitedTime = 0;

      // if there is no wait, then just take it
      if(!waitTime) {
        app.takePhoto();
        app.playCameraSounds();
        return; // stop the rest from running          
      }

      // set a timeout to take the photo after X seconds
      setTimeout(function(){
        app.takePhoto();
        app.playCameraSounds();
      },waitTime);

      $('.countdown').text(waitTime / 1000).show();

      var interval = setInterval(function(){
        waitedTime+= 1000;
        var timeLeft = (waitTime - waitedTime) / 1000;
        $('.countdown').text(timeLeft);
        if(waitedTime >= waitTime) {
          clearInterval(interval);
          $('.countdown').hide();
        }
      },1000);


    });

    $('a.flip').on('click',function(e) {
      e.preventDefault();
      $(app.video).toggleClass('flipped');
    });





})
