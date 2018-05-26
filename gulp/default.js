/**
 * Default Gulp task
 */

var gulp = require('gulp');

gulp.task('default', ['watch']);

// Task to build the different files.
gulp.task('build', [
  'build_sass'
]);

// Task to watch changes for files, then build them.
gulp.task('watch', [
  'watch_sass'
]);
