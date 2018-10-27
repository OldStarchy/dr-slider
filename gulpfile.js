//@ts-check
'use strict';
//Common
const gulp = require('gulp');
const del = require('del');
const map = require('vinyl-map');
const concat = require('gulp-concat');

//TS
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const commonShake = require('common-shakeify');
const typedoc = require('gulp-typedoc');
const typescript = require('gulp-typescript');
const exorsist = require('exorcist');

//SASS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const packageName = 'slider';

const srcDir = './src';
const inFile = `${srcDir}/ts/main.ts`;

const dist = './lib';

function logError(error) {
	console.log(error.toString());

	this.emit('end');
}

gulp.task('clean', () => {
	return del('./lib/**/*');
});

// parts taken from https://github.com/awayjs/core/blob/5102af04f2f1660593ec9d59592f9416b8c92a5d/gulpfile.js#L26

//Uses typescript to compile the source, and create the d.ts files. The d.ts files are concatenated and tweaked slightly using ambientWrap. The compiled js files though are just thrown away because I couldn't figure out how to pipe them into browserify.
gulp.task('build:dts', () => {
	var tsProject = typescript.createProject({
		declarationFiles: true,
		noResolve: true,
		target: 'ES5',
		module: 'commonjs',
		rootDir: './src/ts/',
	});
	var ambientWrap = map(function(code, filename) {
		code = code.toString();
		code =
			code
				.replace(/export /g, '')
				.replace(/declare global {([^{]*(?:\{[^}]*?\}[^{]*)*)}/g, (full, first) =>
					first.replace(/\n(?:\t|    )/g, '\n'),
				)
				.split('\n')
				.filter(line => !/^(\/\/#|import).*/.test(line))
				.join('\n') + '\n'; // +
		return code;
	});

	var tsResult = gulp
		.src(['./src/ts/**/*.ts', '!**/__tests__/**'])
		.pipe(tsProject())
		.on('error', logError);

	return tsResult.dts
		.pipe(ambientWrap)
		.pipe(concat('slider.d.ts'))
		.pipe(gulp.dest(dist));
});

//Uses browserify to create the js and js.map files. Ideally this would be a part of the above task.
gulp.task('build:ts', function(callback) {
	var b = browserify({ debug: true, entries: ['src/ts/main.ts'] })
		.plugin(tsify)
		// .plugin(commonShake)

		.bundle()
		.on('error', logError)
		.pipe(exorsist('lib/slider.js.map'))
		.pipe(source('slider.js'))
		.pipe(gulp.dest(dist))
		.on('end', callback);
});

gulp.task('build:scss', () => {
	return gulp
		.src(`${srcDir}/scss/**/*.scss`)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(
			autoprefixer({
				browsers: [
					'ie >= 10',
					'ie_mob >= 10',
					'ff >= 30',
					'chrome >= 34',
					'safari >= 7',
					'opera >= 23',
					'ios >= 7',
					'android >= 4.4',
					'bb >= 10',
				],
			}),
		)
		.pipe(gulp.dest(dist));
});

gulp.task('build', ['build:ts', 'build:dts', 'build:scss'], done => {});

gulp.task('watch:scss', ['build:scss'], done => {
	return gulp.watch([`${srcDir}/scss/**/*.scss`], ['build:scss']);
});

gulp.task('watch:ts', ['build:ts'], done => {
	return gulp.watch([`${srcDir}/ts/**/*.ts`], ['build:ts']);
});

gulp.task('watch', ['build:ts', 'build:scss'], done => {
	return Promise.all([
		gulp.watch([`${srcDir}/scss/**/*.scss`], ['build:scss']),
		gulp.watch([`${srcDir}/ts/**/*.ts`], ['build:ts', 'build:dts']),
	]);
});

gulp.task('typedoc', function() {
	return gulp.src(['src/ts/*.ts']).pipe(
		typedoc({
			// TypeScript options (see typescript docs)
			module: 'commonjs',
			target: 'es5',
			// includeDeclarations: true,

			// Output options (see typedoc docs)
			out: './doc',

			// TypeDoc options (see typedoc docs)
			entryPoint: inFile,
			name: packageName,
			version: true,
			excludePrivate: true,
		}),
	);
});
