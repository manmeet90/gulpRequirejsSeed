
var gulp = require('gulp'),
    uglifyJS = require('gulp-uglify'),
    uglifyCSS = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    shell = require('gulp-shell'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev-mtime'),
    processhtml = require('gulp-processhtml');

var deploy_ROOT = "./deploy/",
src_ROOT = "./src/assets/",
scssFiles = [src_ROOT+"scss/*.scss",src_ROOT+"scss/**/*.scss"],
jsFiles = [src_ROOT+"js/*.js",src_ROOT+"js/**/*.js"],
cssFiles = [src_ROOT+"css/*.css",src_ROOT+"css/**/*.css"],
fontFiles = [src_ROOT+"fonts/*.*",src_ROOT+"fonts/**/*.*"],
imagesFiles = [src_ROOT+"images/**/*.*",src_ROOT+"images/*.*"],
filesToIncludeInLibjs = [],
jsHintTargetResources = [ src_ROOT+"js/*.js",src_ROOT+"js/views/*.js",src_ROOT+"js/views/**/*.js",src_ROOT+"js/services/*.js",src_ROOT+"js/services/**/*.js",src_ROOT+"js/models/*.js",src_ROOT+"js/models/**/*.js"],
jsPreserveAssets = [src_ROOT+"js-preserve/*.*",src_ROOT+"js-preserve/**/*.*"];

// specify all the directories whose files to be merged into lib.min.js.
// NOTE: if order of some libs matters specify in that order e.g. jquery before bootstrap.
// Don't keep minified and dev version together in js-preserve libs directory. 
var directoriesToIncludeInLibJS = ["jquery", "bootstrap", "require"];

for(var idx in directoriesToIncludeInLibJS){
    var path = src_ROOT+"js-preserve/"+ directoriesToIncludeInLibJS[idx] + "/*.js";
    filesToIncludeInLibjs.push(path);
}


var jshint = require('gulp-jshint');
var map = require('map-stream');
 
var myReporter = map(function (file, cb) {
  if (!file.jshint.success) {
    console.log('JSHINT ERROR in '+file.path);
    file.jshint.results.forEach(function (err) {
      if (err) {
        console.log(' '+file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
      }
    });
  }
  cb(null, file);
});
// JSHint 
gulp.task('js-lint', function() {
  return gulp.src(jsHintTargetResources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});


// uglify JS files - This should be used  for simple web application without require based module system.
gulp.task("minifyJsFiles", function(){
    return gulp.src(jsFiles)
        .pipe(uglifyJS())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest(deploy_ROOT+'assets/js'));
});

// optimize JS files
gulp.task('optimizeJS', shell.task([
  'node r.js -o build.js'
]));

// copy app.min.js to deploy
gulp.task("copy:app.min", function(){
    return gulp.src(src_ROOT+'js/app.min.js')
    .pipe(gulp.dest(deploy_ROOT+'assets/js'));
});

// SCSS to css compilation
gulp.task('sass', function () {
  return gulp.src(scssFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(src_ROOT+'css'));
});

// SASS watch for development
gulp.task('sass:watch', function () {
  gulp.watch(scssFiles, ['sass']);
});

// minify css
gulp.task('minifyCssFiles', function(){
   return gulp.src(cssFiles) 
    .pipe(uglifyCSS({
      "max-line-len": 80
    }))
    .pipe(concat("styles.min.css"))
    .pipe(gulp.dest(deploy_ROOT+'assets/css'));
});

// clean build dir task
gulp.task('cleanbuild', function(){
    return gulp.src([deploy_ROOT])
        .pipe(clean());
});

// copy other assets

// copy images
gulp.task("copy:images", function(){
   return gulp.src(imagesFiles)
   .pipe(gulp.dest(deploy_ROOT+"assets/images"));
});

// copy fonts
gulp.task("copy:fonts", function(){
   return gulp.src(fontFiles)
   .pipe(gulp.dest(deploy_ROOT+"assets/fonts"));
});

// copy index.html
gulp.task("copy:index", function(){
   return gulp.src(["./src/index.html"])
   .pipe(processhtml({}))
   .pipe(rev({
        'cwd': deploy_ROOT,
        'suffix': 'rev'
    }))
   .pipe(gulp.dest(deploy_ROOT));
});

// preprocess html
gulp.task('preprocess:index', function () {
    return gulp.src(deploy_ROOT+'index.html')
           .pipe(processhtml({}))
           .pipe(gulp.dest(deploy_ROOT));
});

// append timestamp to each import in index.html
gulp.task('rev', function () {
	return gulp.src(deploy_ROOT+'index.html')
		.pipe(rev({
		  'cwd': deploy_ROOT,
		  'suffix': 'rev'
		}))
		.pipe(gulp.dest(deploy_ROOT));
});

// combine libs from js-preserve directory and create single lib.min.js
gulp.task('copy:js-preserve', function(){
   return gulp.src(filesToIncludeInLibjs)
        .pipe(concat("lib.min.js"))
        .pipe(uglifyJS())
        .pipe(gulp.dest(deploy_ROOT+"assets/js"));
});



// Add tasks for any project specific assets to be copied to deploy directory, and add those tasks to 'copy:assets' tasks array.

// default task
gulp.task('clean', ['cleanbuild']);
gulp.task('runJSHint', ['js-lint'], function(){
    gulp.start('optimizations');
});
gulp.task('optimizations',['clean','sass','optimizeJS'], function(){
     gulp.start('build');
});
gulp.task('build', ['minifyCssFiles','copy:assets']);
gulp.task('copy:assets', ['copy:app.min','copy:js-preserve','copy:images','copy:fonts'], function(){
    gulp.start('copy:index');
});

gulp.task('default', ['runJSHint']);


// Tasks to run by Configuration Manager 
// 1. cd to directory containing package.json(one time task)
// 2. run 'npm install'(one time task)
// 3. cd to directory containing gulpfile.js
// 4.run 'gulp'