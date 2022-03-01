const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
  // compilar sass
  // pasos: 1- Identificar archivo, 2- Compilarla, 3- Guardar el .css

  // la función sass puede recibir un objeto como parámetro para más configuraciones.
  src('src/scss/app.scss')
    .pipe(sourcemaps.init())
    // con compressed minificamos nuestro proyecto, con extended lo mandamos tal y como un humano crearía el código
    .pipe(sass({ outputStyle: 'expanded' }))
    // con postcss podemos hacer que css sea compatible con cualquier navegador
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'));
  done();
}

function imagenes(done) {
  src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest('build/img'));
  done();
}

function conversionWebp(done) {
  src('src/img/**/*.{png,jgp}').pipe(webp()).pipe(dest('build/img'));
  done();
}

function conversionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src('src/img/**/*.{png,jgp}').pipe(avif(opciones)).pipe(dest('build/img'));
  done();
}

function dev() {
  // Podemos utilizar "comodines" para inficarle que vea los archivos con cierta extensión
  // Watch recibe dos valores, primero qué archivo estará vigilando y segundo la función que queremos que se active cuando el archivo base tenga cambios.
  watch('src/scss/**/*.scss', css);
  // watch('src/scss/app.scss', css);
  watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.conversionWebp = conversionWebp;
exports.conversionAvif = conversionAvif;

exports.default = series(imagenes, conversionWebp, conversionAvif, css, dev);

// series - ejecuta la primera tarea y al finalizar corre la siguiente

// parallel - Todas inician al mismo tiempo, si se termina una, terminarán las demás
