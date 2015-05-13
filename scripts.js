// define namespace
app = {};

//mke the canvas and the 2d context
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

// set canvas width and height to be that of the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//add the canvas to the html body
document.body.appendChild(canvas);

app.url = 'apius.faceplusplus.com ';
app.key = 'b76b9735bd2795ac44068c6b4d01d96e';
app.secret = 'CxYS3FuIjXau6bUckY-KKxaKNGTXOPGw';

