var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
 
// "watch": "watchify -t [babelify] js/AppBootstrap.js -o dist/bundle.js -v",
// "build": "browserify -t [babelify] js/AppBootstrap.js | uglifyjs -mc > dist/bundle.min.js",

var bundler = browserify('./js/AppBootstrap.js').transform(babelify);

gulp.task('watch', function() {
    var watcher = watchify(bundler);

    function bundle() {
        watcher.bundle()
        .on('error', function(e) {
            gutil.log(e);
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist'));
    }

    watcher.on('update', function() {
        var updateStart = Date.now();
        bundle();
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    });

    bundle();
});

gulp.task('default', ['watch']);
