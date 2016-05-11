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
	  	console.log("uploaded!")
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
			if (data.face[0] !== null) {
			smileData = data.face[0].attribute.smiling.value;
			glassData = data.face[0].attribute.glass.value;
				app.detectSmile(smileData);
				app.deletePic(app.deleteLink);
				
			} else {
				console.log('there is no face here');
			}
		}
	}); // end ajax
}

function changeColor(color){
  $('.moodRing').css("fill", color);
  $('.wrapper').css('border', '3px solid ' + color);
  $('h1, h2, a:not(.snap)').css('color', color);
  $('.tools a').css('background', color)
  // $('body').css('background', color);
};

app.detectSmile = function(){
	console.log(smileData)
	$(".workingBox").removeClass('working'); //This ends the progress effect

	var one = "black",
		two = "#6B0024",
	    three = "#DCC0F4",
	    four = "#29A329",
	    five = "#75A3FF",
	    six = "#000080",
		seven = "#FF7519",
		eight = "#DB1C4C",
		nine = "#DF2683",
		ten = "rgba(204, 255, 0, 1)";


	if (smileData <= 10) {
		console.log("Wow super bummed")
		changeColor(one);
    // $('body').css('background', 'grey');
	} else if (smileData <= 20){
		console.log("Feeling pretty gloomy");
		changeColor(two);
    // $('body').css('background', '#330000');
	} else if (smileData <= 30){
		console.log("you grumpy blech")
		changeColor(three);
	} else if (smileData <= 40){
		console.log("Are you annoyed or?")
		changeColor(four);
	} else if (smileData <= 50){
		console.log("Consumed by nostalgia, perhaps")
		changeColor(five);
	} else if (smileData <= 60){
		console.log("it's an ok day")
		changeColor(six);
	} else if (smileData <= 70){
		console.log("Mystical whimsical babely")
		changeColor(seven);
	} else if (smileData <= 80){
		console.log("It's a lucky day")
		changeColor(eight);
	} else if (smileData <= 90){
		console.log("Feeling somewhat loving")
		changeColor(nine);
	} else if (smileData <= 100){
		console.log("HAPPY AS HECK!")
		changeColor(ten);

	} else if (smileData == undefined ) {
		console.log('can\'t see what your face!');
	}

}

// DOCUMENT READY
$(function() {
 	app.getVideo();
	$('a.snap').on('click',function(e){
		$(".workingBox").addClass('working'); //this cues the beginning of a progress effect 
		e.preventDefault();
		app.takePhoto();
	})

})






// TO DO (LISA)
// a. make one image at a time appear on right same size as canvas
// b. change color of accent and main along with ring changing
// c. pos ab the ring in the center?
// d. add to dom an animation of the words ian is currently console logging
// e. style site
// f. make responsive  

//g. progress graphic while its thinking