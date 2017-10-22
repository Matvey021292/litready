"use strict";
var gulp = 				require('gulp');
var connect = 			require('gulp-connect');
var concat = 			require('gulp-concat');
var livereload = 		require('gulp-livereload');
var spritecreator = 	require('gulp.spritesmith');
var html = 				require('gulp-htmlincluder');
var sass = 				require('gulp-sass');
var replace = 			require('gulp-html-replace');
let cleanCSS = 			require('gulp-clean-css');
const imagemin = 		require('gulp-imagemin');
const autoprefixer =	require('gulp-autoprefixer');
var uglify = 			require('gulp-uglify');
var pump = 				require('pump');


gulp.task('compress', function (cb) {
  pump([
        gulp.src('scss/js/**/*.js'),
        uglify(),
        gulp.dest('scss/min_js')
    ],
  cb
  );
});
gulp.task('vendor', function() {  
    return gulp.src('scss/js/*.js')
        .pipe(concat('minify_js.js'))
        .pipe(gulp.dest('build/js/'))
});

gulp.task('sprite', function(){
	var spriteData = gulp.src('img/png/*.png')
						.pipe(spritecreator({
							imgName: 'sprite.png',
							cssName: 'sprite.css',
							algorithm: 'binary-tree'
						}));
	spriteData.img.pipe(gulp.dest('build/img/'));
	spriteData.css.pipe(gulp.dest('build/css/'));
});
gulp.task('images', () =>
    gulp.src('scss/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img/'))
);

gulp.task('sass', function () {
  return gulp.src('scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('scss/css/'))
    .pipe(connect.reload());
});


gulp.task('minify-css', () => {
  return gulp.src('scss/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
     .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(gulp.dest('build/css/'));
});


gulp.task('html', function(){
	gulp.src('scss/**/*.html')
		.pipe(html())
		.pipe(replace({
			css: 'scss/css/style.css'
		}))
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});
gulp.task('server', function(){
	connect.server({
		root : '',
		livereload: true
	});
});

gulp.task('default', function(){
	gulp.start('sass','minify-css','html', 'server','images','compress','vendor');

	gulp.watch('scss/**/*.scss', ['sass'], function(){
		gulp.start('sass');
	});
	
		gulp.watch(['scss/**/*.html'], function(){
		gulp.start('html');
	});
		
		gulp.watch('scss/css/style.css',['minify-css'],function(){
			gulp.start('minify-css');
		});
		gulp.watch(['scss/images/*'],function(){
			gulp.start('images')
		});
		gulp.watch(['scss/js/*.js'],['compress'], function(){
		gulp.start('compress');
		});
		gulp.watch(['scss/**/*.js'],['vendor'], function(){
		gulp.start('vendor');

	});
});