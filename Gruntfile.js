const sass = require('node-sass');
const cheerio = require('cheerio');
const { join } = require('path');

const scripts = ["index", "shake" /* The script file names to compile */];

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Script configuration
    ts: {
      default : {
        tsconfig: './tsconfig.json'
      }
    },
    webpack: Object.fromEntries(((e => [
        ...e
          .map(e => [...e])
          .map(e => {
            e[0] += "-dev";
            e[1] = Object.assign({}, e[1]);
            e[1].mode = "development"
            return e;
          }),
        ...e
          .map(e => [...e])
          .map(e => {
            e[0] += "-prod";
            e[1] = Object.assign({}, e[1]);
            e[1].mode = "production";
            return e;
          }),
      ])(scripts.map(e => [`${e}`, {
        mode: "production",
        entry: join(__dirname, `build/www-tmp/scripts/${e}.ts`),
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
          ],
        },
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
          path: join(__dirname, `build/www/scripts`),
          filename: `${e}.min.js`,
        },
        devtool: "source-map",
    }])))),
    // uglify: {
    //   options: {
    //     sourceMap : true,
    //     sourceMapIncludeSources : true,
    //     sourceMapIn : 'build/www-tmp/webpack-dist/shake.js.map',
    //     'sourceMap.url': '/maps/',
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     expand: true,
    //     cwd: 'build/www-tmp/webpack-dist/',
    //     src: '**/*.js',
    //     dest: 'build/www/scripts/',
    //     ext: '.min.js'
    //   }
    // },


    // Style Configuration
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          'build/www-tmp/sass-dist/style.css': 'src/main/www/style/style.scss',
          'build/www-tmp/sass-dist/materialdesignicons.css': 'src/main/www/style/materialdesignicons.scss',
          'build/www-tmp/sass-dist/editor.css': 'src/main/www/style/editor.scss',
          'build/www-tmp/sass-dist/index.css': 'src/main/www/style/index.scss',
        }
      }
    },
    postcss: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9'],
        map: true,
        processors: [
          require("css-mqpacker")(),
          require('autoprefixer')(),
        ]
      },
      dev: {
        expand: true,
        cwd: 'build/www-tmp/sass-dist/',
        src: '**/*.css',
        dest: 'build/www/style/',
        ext: '.min.css'
      },
      prod: {
        options: {
          map: false
        },
        src: 'build/www-tmp/sass-dist/style.css',
        dest: 'build/www/style/style.min.css'
      }
    },

    'compile-handlebars': {
      allStatic: {
        files: [
          {
          expand: true,
          cwd: 'build/www-tmp/handlebars/',
          src: `**/*.hbs`,
          dest: `build/www/`,
          ext: '.html'
          },
          {
          expand: true,
          cwd: 'src/main/www/',
          src: [`**/*.hbs`, '!template.hbs'],
          dest: `build/www/`,
          ext: '.html'
          }
        ],
        templateData: 'test/fixtures/data.json',
        handlebars: 'node_modules/handlebars'
      },
    },

    markdown: {
      all: {
        files: [{
          expand: true,
          cwd: 'markdown/',
          src: `**/*.md`,
          dest: `build/www-tmp/handlebars/`,
          ext: '.hbs'
        }],
        options: {
          template: 'src/main/www/template.hbs',
          postCompile: (src) => {
            const $ = cheerio.load(src);
            $(Array.from(Array(6).keys()).map(e => `h${e+1}`).join(', ')).each(function() {
               $(`<a class="headline-link" href="#${$(this).attr('id')}"><i class="mdi mdi-link-variant"></i></a>`).appendTo($(this));
            });
            return $.html();
          },
          markdownOptions: {
            gfm: true,
            highlight: 'manual',
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },

    // Watch
    watch: {
      scripts: {
        files: 'src/main/www/scripts/**/*.ts',
        tasks: ['scripts-dev'],
        options: {
          debounceDelay: 250,
        },
      },
      style: {
        files: 'src/main/www/style/**/*.scss',
        tasks: ['style'],
        options: {
          debounceDelay: 250,
        },
      },
      html: {
        files: 'src/main/www/**/*.hbs',
        tasks: ['html'],
        options: {
          debounceDelay: 250,
        },
      },
      html2: {
        files: 'markdown/**/*.md',
        tasks: ['html'],
        options: {
          debounceDelay: 250,
        },
      },
      assets: {
        files: 'assets/**/*',
        tasks: ['assets'],
        options: {
          debounceDelay: 250,
        },
      }
    },

    browserSync: {
      bsFiles: {
        src : './build/www'
      },
      options: {
        watchTask: true,
        server: './build/www'
      }
    },

    clean: {
      html: ['build/www/**/*.html'],
      style: ['build/www/style/**/*.css'],
      scripts: ['build/www/scripts/**/*.js'],
      www: ['build/www'],
      'www-tmp': ['build/www-tmp'],
    },

    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{removeViewBox: false}],
        },
        files: [{
          expand: true,
          cwd: 'src/main/www/',
          src: ['assets/**/*.{png,jpg,gif,ico,svg}'],
          dest: 'build/www/'
        }]
      }
    },

    copy: {
      assets: {
        files: [{
          expand: true,
          cwd: 'src/main/www/',
          src: ['assets/**/*', '!assets/**/*.{png,jpg,gif,ico,svg}'],
          dest: 'build/www/'
        }],
      },
      materialdesignicons: {
        files: [{
          expand: true,
          cwd: join('node_modules/@mdi/font/fonts'),
          src: '**/*',
          dest: 'build/www/assets/fonts/materialdesignicons'
        }],
      },
      scripts: {
        files: [{
            expand: true,
            cwd: 'src/main/www/scripts/',
            src: '**/*',
            dest: 'build/www-tmp/scripts/'
          },
          {
            src: 'build/distributions/shake.js',
            dest: 'build/www-tmp/scripts/shake_environment.js'
          },
          {
            src: 'build/distributions/shake.js.map',
            dest: 'build/www-tmp/scripts/shake_environment.js.map'
          }],
      }
    },
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks("grunt-ts");
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-compile-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('style', ['sass', 'postcss'])
  grunt.registerTask('webpack-dev', scripts.map(e => `webpack:${e}-dev`))
  grunt.registerTask('webpack-prod', scripts.map(e => `webpack:${e}-prod`))
  grunt.registerTask('scripts-dev', ['copy:scripts', 'webpack-dev'])
  grunt.registerTask('scripts-prod', ['copy:scripts', 'webpack-prod'])
  grunt.registerTask('html', ['clean:html', 'markdown', 'compile-handlebars'])
  grunt.registerTask('watch-browser-sync', ['browserSync', 'watch'])
  grunt.registerTask('assets', ['imagemin', 'copy:assets', 'copy:materialdesignicons'])

  grunt.registerTask('all-dev', ['scripts-dev', 'style', 'html', 'assets']);
  grunt.registerTask('all-prod', ['scripts-prod', 'style', 'html', 'assets']);
  grunt.registerTask('dev', ['all-dev', 'watch-browser-sync']);
  grunt.registerTask('default', ['all-prod']);
  grunt.registerTask('build', ['all-prod']);

};

