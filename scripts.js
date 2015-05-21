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
  img.appendTo(link);
  link.appendTo('.strip');
  app.upload(img);

}

app.upload = function(img) {
	var $img = $(img);
	localStorage.doUpload = true;
	localStorage.imageBase64 = $img.attr('src').replace(/.*,/, '');
	var uploadImg = localStorage.imageBase64;
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
	    app.init(link);
	  }
	});
}

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
			// console.log(rez);
		}
	});
};

app.init = function(link){
	var imageUrl = link;
	var server = 'http://api.us.faceplusplus.com/v2/detection/detect';
	var key = 'b76b9735bd2795ac44068c6b4d01d96e';
	var secret = 'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw';
	var attribute = 'smiling,glass';

	detectImageUrl = server + '?url=' + imageUrl + '&api_secret=' + secret + '&api_key=' + key + '&attribute=' + attribute;
	//concatinates on to our endpoints
	app.detectFace(detectImageUrl);
}  //init ends here

app.detectFace = function(){
	$.ajax({
		url : detectImageUrl,
		type : "GET",
		dataType : 'json',
		success : function(data) {
			smileData = data.face[0].attribute.smiling.value;
			glassData = data.face[0].attribute.glass.value;
			console.log(glassData);
			app.detectSmile(smileData);
			app.deletePic(app.deleteLink);
		}
	}); // end ajax
}

app.detectSmile = function(){
	console.log(smileData)

	if (smileData <= 10) {
		console.log("Why so sad?")
		$('.moodRing').css("fill", "#000000")
	} else if (smileData <= 20){
		console.log("You're looking gloomy")
		$('.moodRing').css("fill", "#6B0024")
	} else if (smileData <= 30){
		console.log("Meh")
		$('.moodRing').css("fill", "#FF7519")
	} else if (smileData <= 40){
		console.log("Meh")
		$('.moodRing').css("fill", "#29A329")
	} else if (smileData <= 50){
		console.log("Meh")
		$('.moodRing').css("fill", "#75A3FF")
	} else if (smileData <= 60){
		console.log("Meh")
		$('.moodRing').css("fill", "#000080")
	} else if (smileData <= 70){
		console.log("Meh")
		$('.moodRing').css("fill", "#DCC0F4")
	} else if (smileData <= 80){
		console.log("Meh")
		$('.moodRing').css("fill", "#DB1C4C")
	} else if (smileData <= 90){
		console.log("Meh")
		$('.moodRing').css("fill", "#DF2683")
	} else if (smileData <= 100){
		console.log("someone's smiling!")
		$('.moodRing').css("fill", "#CCFF00")
	}
}

// DOCUMENT READY
$(function() {
 	app.getVideo();
	$('a.snap').on('click',function(e){
		e.preventDefault();
		app.takePhoto();
	})

})
