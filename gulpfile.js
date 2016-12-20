var gulp = require('gulp');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');

gulp.task('default', function () {
    return runSequence('server', 'client');
});

gulp.task('server', function() {

});

gulp.task('client', function () {
    return runSequence('browserify');
});

gulp.task('browserify', function() {
    return gulp.src('./client/*.js')
    .pipe(browserify({
        insertGlobals: true
    }))
    .pipe(gulp.dest('./client/build/js'));
});
