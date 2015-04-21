var target = './target';
var dest = target + '/dist';
var src = './src';
var assets = './assets';

module.exports = {
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest
    }
  },
  sass: {
    src: src + "/styles/**/*.scss",
    dest: dest,
    settings: {
      imagePath: 'assets/images' // Used by the image-url helper
    }
  },
  images: {
    src: assets + "/images/**",
    dest: dest + "/images"
  },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/javascript/global.coffee',
      dest: dest,
      outputName: 'global.js',
      // Additional file extentions to make optional
      extensions: [],
      // list of modules to make require-able externally
      require: []
    }, {
      entries: src + '/javascript/page.js',
      dest: dest,
      outputName: 'app.js'
    }]
  },
  production: {
    cssSrc: dest + '/*.css',
    jsSrc: dest + '/*.js',
    dest: dest,
    target : target
  }
};