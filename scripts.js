// define namespace
app = {};

app.locals = {
	token : '204078c03d235e0',
	imgurImg : '',
}

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

// <<<<<<< Updated upstream
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
// =======
// app.init = function(){
//   $('.imgUrl').on('submit',function(e){
//     e.preventDefault();
//     var imageUrl = $('.url').val();
//     // gets the image url on submit.  later on we will just use this to grab urls.
//     var server = 'http://api.us.faceplusplus.com/v2/detection/detect';
//     var key = 'b76b9735bd2795ac44068c6b4d01d96e';
//     var secret = 'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw';
//     var attribute = 'smiling';

//     detectImageUrl = server + '?url=' + imageUrl + '&api_secret=' + secret + '&api_key=' + key + '&attribute=' + attribute;
//     //concatinates on to our endpoints
//     app.detectFace(detectImageUrl);
//     console.log(detectImageUrl);
//   });
// >>>>>>> Stashed changes
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
		$(".messageBox").html("<p>Wow super bummed</p>");
		changeColor(one);
    // $('body').css('background', 'grey');
	} else if (smileData <= 20){
		console.log("Feeling pretty gloomy");
		$(".messageBox").html("<p>Feeling pretty gloomy</p>");
		changeColor(two);
    // $('body').css('background', '#330000');
	} else if (smileData <= 30){
		console.log("you grumpy blech")
		$(".messageBox").html("<p>you grumpy blech</p>");
		changeColor(three);
	} else if (smileData <= 40){
		console.log("Are you annoyed or?");
		$(".messageBox").html("<p>Are you annoyed or?</p>");
		changeColor(four);
	} else if (smileData <= 50){
		console.log("Consumed by nostalgia, perhaps")
		$(".messageBox").html("<p>Consumed by nostalgia, perhaps</p>");
		changeColor(five);
	} else if (smileData <= 60){
		console.log("it's an ok day");
		$(".messageBox").html("<p>it's an ok day</p>");
		changeColor(six);
	} else if (smileData <= 70){
		console.log("Mystical whimsical babely");
		$(".messageBox").html("<p>Mystical whimsical babely</p>");
		changeColor(seven);
	} else if (smileData <= 80){
		console.log("It's a lucky day");
		$(".messageBox").html("<p>It's a lucky day</p>");
		changeColor(eight);
	} else if (smileData <= 90){
		console.log("Feeling somewhat loving");
		$(".messageBox").html("<p>Feeling somewhat loving</p>");
		changeColor(nine);
	} else if (smileData <= 100){
		console.log("HAPPY AS HECK!");
		$(".messageBox").html("<p>HAPPY AS HECK!</p>");
		changeColor(ten);

	} else if (smileData == undefined ) {
		console.log('can\'t see what your face!');
	}

}

// DOCUMENT READY
$(function() {
// <<<<<<< Updated upstream
 	app.getVideo();
	$('a.snap').on('click',function(e){
		$(".messageBox").html("<p>Let Me See how You're feeling...</p>");
		$(".workingBox").addClass('working');
		 //this cues the beginning of a progress effect 

		$("#countdownNum").html("3");
		e.preventDefault();
		setTimeout(function(){
		app.takePhoto();
		$("#countdownNum").html("")
		}, 3000);
		setTimeout(function(){
			$("#countdownNum").html("1")
		}, 2000);
		setTimeout(function(){
			$("#countdownNum").html("2")
		}, 1000);
	})

// =======
 //  app.getVideo();
	// app.init();
 //  app.detectSmile();

 //  $('a.snap').on('click',function(e) {
 //      e.preventDefault();
 //      // find the wait time
 //      var waitTime = $(this).data('wait');
 //      var waitedTime = 0;

 //      // if there is no wait, then just take it
 //      if(!waitTime) {
 //        app.takePhoto();
 //        return; // stop the rest from running          
 //      }

 //      // set a timeout to take the photo after X seconds
 //      setTimeout(function(){
 //        app.takePhoto();
 //      },waitTime);

 //      $('.countdown').text(waitTime / 1000).show();

 //      var interval = setInterval(function(){
 //        waitedTime+= 1000;
 //        var timeLeft = (waitTime - waitedTime) / 1000;
 //        $('.countdown').text(timeLeft);
 //        if(waitedTime >= waitTime) {
 //          clearInterval(interval);
 //          $('.countdown').hide();
 //        }
 //      },1000);


 //    });

 //    $('a.flip').on('click',function(e) {
 //      e.preventDefault();
 //      $(app.video).toggleClass('flipped');
 //    });

  
// >>>>>>> Stashed changes
})






// TO DO (LISA)
// a. make one image at a time appear on right same size as canvas
// b. change color of accent and main along with ring changing
// c. pos ab the ring in the center?
// d. add to dom an animation of the words ian is currently console logging
// e. style site
// f. make responsive  

//g. progress graphic while its thinking