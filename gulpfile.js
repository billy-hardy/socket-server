var DEPLOY_DIR = "./dist";
var CLIENT_DEPLOY = DEPLOY_DIR + "/client/";
var SERVER_DEPLOY = DEPLOY_DIR;

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var paths = {
    server: 'server/**/*.js',
    client: 'client/**/*.js'
};

gulp.task('default', ['server', 'client']);
gulp.task('server', ['move:server']); 
gulp.task('client', ['move:client']);

gulp.task('jsLint:server', jsLint.bind(this, paths.server));
gulp.task('jsLint:client', jsLint.bind(this, paths.client));

function jsLint(filePath) {
    return gulp.src([filePath])
        .pipe(jshint({
            eqeqeq: true,
            esversion: 6
        }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
}

gulp.task('browserify', ['jsLint:client'], function() {
    return gulp.src('./client/*.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat('build.js'))
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

gulp.task('move:client', ['browserify'], function () {
    return gulp.src(['./client/index.html', './client/favicon.ico'])
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

gulp.task('move:server', ['jsLint:server'], function () {
    return gulp.src(['./server/main.js'])
        .pipe(gulp.dest(SERVER_DEPLOY));
});
