// define namespace
app = {};

app.locals = {
	token : '204078c03d235e0',
	imgurImg : '',
}

//make the canvas and the 2d context
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

  navigator.getUserMedia ({ video: true,  audio: false }, function(localMediaStream) {
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
  var data = app.canvas.toDataURL('image/jpeg');
  
  // console.log(data);
       // 1. create an image 2. set the source the be the data 3. append to an element
  var img = $('<img>').attr('src',data);
  var link = $("<a>").attr("href",data);
  // console.log(img);
  img.appendTo(link);
  link.appendTo('.strip');
  console.log(img);
  app.upload(img);

}

app.upload = function(img) {
	var $img = $('img');
	localStorage.doUpload = true;
	localStorage.imageBase64 = $img.attr('src').replace(/.*,/, '');
	var uploadImg = localStorage.imageBase64;
	// console.log(uploadImg);

	// console.log(localStorage.imageBase64);
	$.ajax({
	  url: 'https://api.imgur.com/3/image',
	  method: 'POST',
	  headers: {
	    Authorization: 'Client-ID ' + app.locals.token,
	    Accept: 'application/json'
	  },
	  data: {
	    image: localStorage.imageBase64,
	    type: 'base64'
	  },
	  success: function(result) {
	  	app.deleteLink = result.data.deletehash;
	    var id = result.data.id;
	    var link = 'http://i.imgur.com/' + id + '.png';
	    app.locals.imgurImg = result.data.id;
	    // picApp.getEmotions(link);
	    console.log(app.deleteLink);
	    console.log(link);
	    app.init(link);
	  }
	});
}

app.init = function(link){
$('.imgUrl').on('submit',function(e){
	e.preventDefault();
	var imageUrl = link;
	// gets the image url on submit.  later on we will just use this to grab our imgur urls.
	var server = 'http://api.us.faceplusplus.com/v2/detection/detect';
	var key = 'b76b9735bd2795ac44068c6b4d01d96e';
	var secret = 'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw';
	var attribute = 'smiling';

	detectImageUrl = server + '?url=' + imageUrl + '&api_secret=' + secret + '&api_key=' + key + '&attribute=' + attribute;
	//concatinates on to our endpoints
	app.detectFace(detectImageUrl);
	console.log(detectImageUrl);
});
}  //init ends here


app.deletePic = function(info) {
	$.ajax({
		url: 'https://api.imgur.com/3/image/' + info,
		method: 'DELETE',
		dataType: 'json',
		headers: {
		  Authorization: 'Client-ID ' + app.locals.token,
		  Accept: 'application/json'
		},
		success: function(rez) {
			console.log(rez);
		}
	});
};

// app.url = app.server + 'detection/detect' + app.secret;

app.detectFace = function(){
	$.ajax({
		url : detectImageUrl,
		type : "GET",
		dataType : 'json',
		success : function(data) {
			console.log(data);
			// console.log(data.face[0].attribute.smiling.value)
			smileData = data.face[0].attribute.smiling.value;
			// console.log(smileData);
			app.detectSmile(smileData);
			app.deletePic(app.deleteLink);
		}
	}); // end ajax
}

app.detectSmile = function(){
	console.log(smileData)

	if (smileData >= 30) {
		console.log("you're happy!")
	}
}



// DOCUMENT READY
$(function() {
 	app.getVideo();
	$('a.snap').on('click',function(e){
		e.preventDefault();
		// console.log('snaaaaap')
		app.takePhoto();
		// app.upload();
	// app.init();
	})

})
