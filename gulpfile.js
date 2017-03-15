const gulp = require('gulp');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const minifyHTML = require('gulp-minify-html');
const del = require('del');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const minHtmlOpts = {
  conditionals: true,
  quotes: true
};
const config = {
  appDir: 'app',
  bowerDir: 'app/bower_components',
  distDir: 'dist'
};

gulp.task('process-views', () => {
  const assets = useref.assets({searchPath: './app/', base: './dist/'});

  return gulp
    .src('app/**/*.hbs')
    .pipe(assets)
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', () => {
  const srcPath = `${config.appDir}/fonts/**/*`;
  const destPath = `${config.distDir}/fonts`;

  return gulp
    .src(srcPath)
    .pipe(gulp.dest(destPath));
});

gulp.task('minify-html', () => {
  const srcPath = ['dist/**/*.hbs', '!dist/**/md.hbs'];
  const destPath = 'dist';

  return gulp
    .src(srcPath)
    .pipe(gulpIf('*.hbs', minifyHTML(minHtmlOpts)))
    .pipe(gulp.dest(destPath));
});

gulp.task('images', () => {
  const srcPath = `${config.appDir}/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`;
  const destPath = `${config.distDir}/images`;

  return gulp
    .src(srcPath)
    .pipe(imagemin({interlaced: true}))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean:dist', (callback) => {
  const srcPath = [`${config.distDir}/**/*`, `!${config.distDir}/images`, `!${config.distDir}/images/**/*`];

  return del(srcPath, callback);
});

gulp.task('clean', () => {
  const srcPath = config.distDir;
  return del(srcPath);
});

gulp.task('watch', () => {
  gulp.watch(`${config.appDir}/assets/scss/**/*.scss`, ['sass']);
});

gulp.task('sass', () => {
  const srcPath = `${config.appDir}/assets/scss/**/*.scss`;
  const destPath = `${config.appDir}/css`;
  return gulp
    .src(srcPath)
    .pipe(sass())
    .pipe(gulp.dest(destPath));
});

gulp.task('bundle', (callback) => {
  runSequence('images', 'fonts', 'sass', 'process-views', 'minify-html', callback);
});

gulp.task('build', (callback) => {
  return runSequence('clean', ['bundle'], callback);
});
