'use strict';

		// "gulp": "^3.9.1",
		// "gulp-util": "^3.0.7",
		// "vinyl-source-stream": "^1.1.0"

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify'); 
 
    "watch": "watchify -t [babelify] js/AppBootstrap.js -o dist/bundle.js -v",
    "build": "browserify -t [babelify] js/AppBootstrap.js | uglifyjs -mc > dist/bundle.min.js",

var customOpts = {
	entries: ['./js/AppBootstrap.js'],
	transform: [babelify],
	debug: true
};
var opts = Object.assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('default', function() {

    return watcher.on('update', function(){
        var updateStart = Date.now();
        b.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('main.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./build/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/'));
});
