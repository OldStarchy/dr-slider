//@ts-check
'use strict';

//Common
const gulp = require('gulp');
const del = require('del');

//TS
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const commonShake = require('common-shakeify');
const typedoc = require("gulp-typedoc");

//SASS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const packageName = 'slider';

const srcDir = './src';
const inFile = `${srcDir}/ts/main.ts`;

const dist = './dist';
const outFile = `${dist}/slider.js`;

function logError(error)  {
	console.log(error.toString());

	this.emit('end');
}

function createBrowserifier(entry) {
	return (
		browserify({
			basedir: '.',
			debug: true,
			entries: [entry],
			cache: {},
			packageCache: {}
		})
			.plugin(tsify)
			.plugin(commonShake)
	);
}

gulp.task('clean', () => {
	return del('./dist/**/*');
});

gulp.task('build:ts', () => {
	return createBrowserifier(inFile)
		.bundle()
		.on('error', logError)
		.pipe(source(`slider.js`))
		.pipe(gulp.dest(`${dist}/js`));
});


gulp.task("typedoc", function() {
    return gulp
        .src(["src/ts/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs)
            module: "commonjs",
            target: "es5",
			// includeDeclarations: true,

            // Output options (see typedoc docs)
            out: "./doc",

            // TypeDoc options (see typedoc docs)
			entryPoint: inFile,
            name: packageName,
            ignoreCompilerErrors: false,
            version: true,
        }))
    ;
});

gulp.task('build:scss', () => {
	return gulp.src(`${srcDir}/scss/**/*.scss`)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer({browsers: [
			'ie >= 10',
			'ie_mob >= 10',
			'ff >= 30',
			'chrome >= 34',
			'safari >= 7',
			'opera >= 23',
			'ios >= 7',
			'android >= 4.4',
			'bb >= 10',
		]}))
		.pipe(gulp.dest(`${dist}/css`));
});

gulp.task('watch:scss', (done) => {
	return gulp.watch([`${srcDir}/scss/**/*.scss`], ['build:scss']);
});
gulp.task('watch:ts', (done) => {
	return gulp.watch([`${srcDir}/ts/**/*.ts`], ['build:ts']);
});
