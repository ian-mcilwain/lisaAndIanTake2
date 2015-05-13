var gulp = require('gulp');
var	sass = require('gulp-sass');
var notify = require('gulp-notify');

gulp.task('styles', function(){
	gulp.src('./styles/style.scss')
	.pipe( sass({ errLogToConsole : true}))
	.pipe( gulp.dest('./styles'))
	.pipe( notify('css compiled'));
	}); //end gulp.task styles

gulp.task( 'watch', function(){
	gulp.watch('./**/*.scss',['styles']);
	}); //end gulp.task watch