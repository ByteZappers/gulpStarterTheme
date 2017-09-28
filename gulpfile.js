// 1) npm install -g gulp

// 2) mkdir projectFolderName 
// 	//create folder with name gulpexxa

// 3) cd projectFolderName
// 	//move to the folder created before

// 4) sublime text 3 . 
// 	//to open the folder in sublime

// 5) npm init
// 	//to initialize

// 6) npm install --save-dev gulp
// 	//Now install the gulp in the folder we have to work

		// npm install --save-dev gulp
const gulp = require('gulp');
		//npm install --save-dev gulp-imagemin
const imagemin = require('gulp-imagemin');
		// npm install --save-dev gulp-uglify
const uglify = require('gulp-uglify');
		// npm install --save-dev gulp-sass
const sass = require('gulp-sass');
		// npm install --save-dev gulp-concat
const concat = require('gulp-concat'); // it will only combine the js files of same place
		//npm install browser-sync --save-dev
const browserSync = require('browser-sync').create();
		//npm install gulp-useref --save-dev
const useref = require('gulp-useref');// this plugin can be used when complete all the code of js or css then you can run this function to gernrat combined js or css file
		// npm install --save-dev gulp-if
const gulpif = require('gulp-if');//for gulpif condition
		// npm install --save-dev gulp-cssnano
const cssnano = require('gulp-cssnano');// minify css files
		//npm install --save-dev gulp-cache
const cache = require('gulp-cache');//
		// npm install --save-dev  del
const del = require('del'); // cleaning up (deleting) folder or files
		//npm install --save-dev run-sequence 
const runSequence = require('run-sequence');//run functions in a sequence
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('clean:dist', function() {
  return del.sync('dist');
})
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})
// this plugin can be used when complete all the code of js or css then you can run this function to gernrat combined js or css file
gulp.task('useref', function(){
  return gulp.src('dist/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpif('*.js', uglify()))
    // Minifies only if it's a css file
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});
// <!--build:js js/mainjs.min.js -->
// <script type="text/javascript" src="folderPath.js"></script>
// <script type="text/javascript" src="folderPath.min.js"></script>
// <!-- endbuild -->

// <!--build:css css/mainStyle.min.css-->
// <link rel="stylesheet" href="css/styles.css">
// <link rel="stylesheet" href="css/another-stylesheet.css">
// <!--endbuild-->

//copy copyFilesToDist files
gulp.task('copyFilesToDist', function(){
	gulp.src('src/css/*.css')
		.pipe(gulp.dest('dist/css'));
	gulp.src('src/*.html')
		.pipe(gulp.dest('dist'));
	gulp.src('src/js/*.js')
		.pipe(gulp.dest('dist/js'));
});

//reload browser
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})

//Optimize Images
gulp.task('imageMin', function(){
	gulp.src('src/images/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/images'))
});

//Minify Js
gulp.task('minify', function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('src/js'));
});


// Compile Sass
gulp.task('sass', function(){
	gulp.src('src/scss/*.scss') //== src/**/*.scss ==" double ** means it will also complile any child folder of "== src ==" .scss file to css file 
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError)) // by using "== on('error', sass.logError) ==" it will show error but will not close the function if the error is resolved it will continue doing its task
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({
		     stream: true
		   }));
});

gulp.task('message', function(){
	return console.log('Gulp is runing...');
});

// mifiy and combine all js files into one file but these files must be in same places
gulp.task('changeJs', function(){
	gulp.src('src/js/*.js')
		.pipe(concat('main.js')) //this is the out put file's name in which combined files 
		.pipe(uglify())	//to minify the files
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.reload({
		     stream: true
		 }));
});

gulp.task('reload', function(){
	gulp.src('src/*')
		.pipe(browserSync.reload({
		     stream: true
		 }));
});


gulp.task('default', function(callback) {
  runSequence('message', 'sass','browserSync','watch', callback);
});

gulp.task('build', function(callback) {
  runSequence('message','sass','copyFilesToDist','useref', 'imageMin', callback);
});

gulp.task('task-name', function(callback) {
  runSequence('task-one', ['tasks','two','run','in','parallel'], 'task-three', callback);
});// In this case, Gulp first runs task-one. When task-one is completed, Gulp runs every task in the second argument simultaneously. All tasks in this second argument must be completed before task-three is run.


gulp.task('watch', function(){
	gulp.watch('src/js/*.js', ['reload']); // if its find any changes in src folder in "== js==" files it will run the funtion "scripts"
	gulp.watch('src/**/*.scss', ['sass']); //== src/**/*.scss ==" double ** means he find any changes in any child folder of "== src ==" in file .scss it will run the function "== Sass =="
			// if its find any changes in src folder in "== Sass ==" files it will run the funtion "sass"
	gulp.watch('src/*.html', ['reload']);  // if its find any changes in src folder in "== Html ==" files it will run the funtion "scripts"
});
