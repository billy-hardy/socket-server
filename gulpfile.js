var DEPLOY_DIR = "./dist";
var CLIENT_DEPLOY = DEPLOY_DIR + "/client/";
var SERVER_DEPLOY = DEPLOY_DIR;

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');


gulp.task('default', function () {
    return runSequence('jsLint', 'server', 'client');
});

gulp.task('jsLint', function () {
    return gulp.src(['server/**/*.js', 'client/**/*.js'])
    .pipe(jshint({
        eqeqeq: true,
        esversion: 6
    }))
    .pipe(notify(function (file) {
        if(file.jshint.success) {
            //Don't show something if success
            return false;
        }
        var errors = file.jshint.results.map(function (data) {
            if(data.error) {
                return '(' +data.error.line + ':' + data.error.character + ') ' + data.error.reason;
            }
        });
        return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    }));
});

gulp.task('server', function() {
    return runSequence('move:server');
});

gulp.task('client', function () {
    return runSequence('browserify', 'move:client');
});

gulp.task('browserify', function() {
    return gulp.src('./client/*.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat('build.js'))
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

gulp.task('move:client', function () {
    return gulp.src(['./client/index.html', './client/favicon.ico'])
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

gulp.task('move:server', function () {
    return gulp.src(['./server/main.js'])
        .pipe(gulp.dest(SERVER_DEPLOY));
});
