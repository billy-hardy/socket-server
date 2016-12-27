var DEPLOY_DIR = "./server/dist";

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');


gulp.task('default', function () {
    return runSequence('server', 'client');
});

gulp.task('server', function() {

});

gulp.task('client', function () {
    return runSequence('browserify', 'move');
});

gulp.task('browserify', function() {
    return gulp.src('./client/*.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat('build.js'))
        .pipe(gulp.dest(DEPLOY_DIR));
});

gulp.task('move', function () {
    return gulp.src(['./client/index.html', './client/favicon.ico'])
        .pipe(gulp.dest(DEPLOY_DIR));
});
