/**
 * Gulpfile to bundle the CSS files.
 */

var clean = require('gulp-clean');
var gulp = require('gulp');
var inlineBase64 = require('gulp-inline-base64');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// SASS configurations
var sassConfigs = {
  'app': {
    sourcePattern: 'src/sass/**/*.scss',
    sourcePath: 'src/sass/',
    outputPath: 'static/css/',
    // Files to clean during the clean task.
    cleanFiles: [
      'static/css/app.css'
    ],
    // Pattern of source files to watch for changes.
    // The pattern is more general than the sourcePattern,
    // so that we can watch for changes in files that depend on each other.
    watchPattern: ['src/**/*.scss']
  }
};

// List of tasks called with the Gulp task clean_sass
var cleanTasks = [];
// List of tasks called with the Gulp task build_sass
var buildTasks = [];
// List of tasks called with the Gulp task watch_sass
var watchTasks = [];

// Create tasks for each configuration.
for (var name in sassConfigs) {
  var tasks = prepareSassTasksFromConfig(name, sassConfigs[name]);
  cleanTasks.push(tasks[0]);
  buildTasks.push(tasks[1]);
  watchTasks.push(tasks[2]);
}

// Create tasks that will call all the created tasks.
gulp.task('clean_sass', cleanTasks);
gulp.task('build_sass', buildTasks);
gulp.task('watch_sass', watchTasks);

/**
 * Generate Gulp tasks from a SASS configuration.
 * This function will generate several Gulp tasks:
 * - Each named configuration in sassConfigs results in 3 tasks.
 *   Suppose our configuration is named 'example', the 3 tasks are:
 *   - clean_sass_example
 *   - build_sass_example
 *   - watch_sass_example
 * - Two main Gulp tasks (build_sass, watch_sass) that will call
 *   the all tasks associated with the configurations.
 * @param {string} name - Name of the configuration.
 * This has to be unique between calls, otherwise,
 * configurations with the same name will be overridden.
 * @param {object} config - SASS configuration
 * @param {string} config.sourcePattern - Pattern for the source files
 * @param {string} config.sourcePath - Path of the source files
 * @param {string} config.outputPath - Path of to output build files
 * @param {string[]} config.cleanFiles - Path of the files to remove
 * when running clean task
 * @param {string} config.watchPattern - Path to watch for changes
 * @return {array} Array with names of three tasks:
 * [0] a clean task, [1] a build task and [2] a watch task.
 */
function prepareSassTasksFromConfig(name, config) {
  var sourcePattern = config.sourcePattern,
      sourcePath = config.sourcePath,
      outputPath = config.outputPath,
      cleanFiles = config.cleanFiles,
      watchPattern = config.watchPattern;

  // Create unique name for tasks.
  var cleanTask = 'clean_sass_' + name;
  var buildTask = 'build_sass_' + name;
  var watchTask = 'watch_sass_' + name;

  // Clean task for the current configuration.
  gulp.task(cleanTask, function() {
    return gulp.src(cleanFiles, { read: false })
        .pipe(clean());
  });

  // Build task for the current configuration.
  gulp.task(buildTask, [cleanTask], function() {
    return gulp.src([sourcePattern])
      // .pipe(sourcemaps.init())
        .pipe(
          sass()
            .on('error', function(error) {
              console.log(error.message);
            })
        )
        // .pipe(inlineBase64({
        //   baseDir: sourcePath,
        //   maxSize: 14 * 1024,
        //   debug: true
        // }))
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(outputPath));
  });

  // Watch task for the current configuration.
  gulp.task(watchTask, [buildTask], function() {
    gulp.watch(watchPattern, [buildTask]);
  });

  // Return names of the tasks
  return [cleanTask, buildTask, watchTask];
}
