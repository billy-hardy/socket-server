var DEPLOY_DIR = "./dist/";
var CLIENT_DEPLOY = DEPLOY_DIR + "client/";
var SERVER_DEPLOY = DEPLOY_DIR;

var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var paths = {
    services: 'services/**/*.js',
    server: 'server/**/*.js',
    client: 'client/**/*.js'
};

gulp.task('default', ['server', 'client']);
gulp.task('server', ['move:server']); 
gulp.task('services', ['move:services']); 
gulp.task('client', ['move:client']);

gulp.task('move:client', ['move:services:client', 'transpile:client', 'browserify'], function () {
    return gulp.src(['./client/index.html', './client/favicon.ico'])
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

gulp.task('transpile:client', transpile(paths.client, CLIENT_DEPLOY));
gulp.task('transpile:services', transpile(paths.services, CLIENT_DEPLOY+'/services/'));

function transpile(src, dest) {
    return function() {
        return gulp.src([src])
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(dest));
    }
}

gulp.task('browserify', ['jsLint:client'], function() {
    return gulp.src(['./client/*.js'])
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat('build.js'))
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

function services(dest) {
    return function() {
        return gulp.src([paths.services])
            .pipe(gulp.dest(dest + '/services/'));
    }
}

gulp.task('move:services:server', ['jsLint:services'], services(SERVER_DEPLOY));
gulp.task('move:services:client', ['jsLint:services', 'transpile:services'], services(CLIENT_DEPLOY));

gulp.task('move:server', ['jsLint:server', 'move:services:server'], function () {
    return gulp.src(['./server/main.js'])
        .pipe(gulp.dest(SERVER_DEPLOY));
});

gulp.task('jsLint:server', jsLint(paths.server));
gulp.task('jsLint:services', jsLint(paths.services));
gulp.task('jsLint:client', jsLint(paths.client));

function jsLint(filePath) {
    return function() {
        return gulp.src([filePath])
            .pipe(jshint({
                eqeqeq: true,
                esversion: 6
            }))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'));
    }
}

