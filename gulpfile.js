'use strict';

var gulp = require('gulp');

gulp.task('images', function() {
    return gulp.src(['blue.svg', 'asw.png'])
        .pipe(gulp.dest('dist'));
});

//Copy readme
gulp.task('readme', function() {
    return gulp.src(['README.md', 'LICENSE'])
        .pipe(gulp.dest('dist'));
});

//Building project with run sequence
gulp.task('build-assets', 
gulp.series('images', 
'readme'));

