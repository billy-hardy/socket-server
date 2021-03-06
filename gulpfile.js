var DEPLOY_DIR = './dist/';
var BEANS_SUFFIX= 'beans/';
var CLIENT_DEPLOY = DEPLOY_DIR + 'server/client/';
var SERVER_DEPLOY = DEPLOY_DIR + 'server/';
var SERVICES_SUFFIX= 'services/';
var UTILS_SUFFIX= 'utils/';

var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglifyjs');
var jscs = require('gulp-jscs');

var paths = {
    beans: 'beans/**/*.js',
    client: 'client/**/*.js',
    server: 'server/**/*.js',
    services: 'services/**/*.js',
    utils: 'utils/**/*.js'
};

gulp.task('default', ['server', 'client']);
gulp.task('client', ['move:client']);
gulp.task('server', ['move:server']); 
gulp.task('services', ['move:services']); 

gulp.task('move:beans', ['jsLint:beans'], move([paths.beans], DEPLOY_DIR+BEANS_SUFFIX));
gulp.task('move:client', ['jsLint:services', 'jsLint:beans', 'transpile:client', 'browserify'], move([paths.client, './client/index.html', './client/favicon.ico'], CLIENT_DEPLOY));
gulp.task('move:server', ['jsLint:server', 'move:beans', 'move:services:server', 'move:utils:server'], move([paths.server], SERVER_DEPLOY));
gulp.task('move:services', ['move:services:server', 'move:services:client']);
gulp.task('move:services:server', ['jsLint:services'], move([paths.services], DEPLOY_DIR+SERVICES_SUFFIX));
gulp.task('move:services:client', ['jsLint:services', 'transpile:services'], move([paths.services], CLIENT_DEPLOY+SERVICES_SUFFIX));
gulp.task('move:utils:server', ['jsLint:utils'], move([paths.utils], DEPLOY_DIR+UTILS_SUFFIX));

function move(src, dest) {
    return function() {
        return gulp.src(src)
            .pipe(gulp.dest(dest));
    };
}


gulp.task('transpile:client', transpile([paths.client], CLIENT_DEPLOY));
gulp.task('transpile:services', transpile([paths.services], CLIENT_DEPLOY+SERVICES_SUFFIX));

function transpile(src, dest) {
    return function() {
        return gulp.src(src)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(uglify())
            .pipe(gulp.dest(dest));
    };
}

gulp.task('browserify', ['jsLint:client'], function() {
    return gulp.src(['./client/*.js'])
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(concat('build.js'))
        .pipe(gulp.dest(CLIENT_DEPLOY));
});

gulp.task('jsLint:server', jsLint(paths.server));
gulp.task('jsLint:services', jsLint(paths.services));
gulp.task('jsLint:beans', jsLint(paths.beans));
gulp.task('jsLint:client', jsLint(paths.client));
gulp.task('jsLint:utils', jsLint(paths.utils));

function jsLint(filePath) {
    return function() {
        return gulp.src([filePath])
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'));
    };
}

gulp.task('jscs', function() {
    var src = [];
    for(var key in paths) {
        src.push(paths[key]);
    }
    gulp.src(src, {base: './'})
        .pipe(jscs({fix: true}))
        .pipe(gulp.dest('./'));
});

