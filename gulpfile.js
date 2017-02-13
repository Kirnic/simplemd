var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');

gulp.task(
    'ui5preload',
    function() {
        return gulp.src(
                [
                    '**/**.+(js|xml)',
                    '!Component-preload.js',
                    '!gulpfile.js',
                    '!node_modules/**',
                ]
            )
            .pipe(ui5preload({
                base: './',
                namespace: 'ui5bp',
                fileName: 'Component-preload.js'
            }))
            .pipe(gulp.dest('.'));
    }
)