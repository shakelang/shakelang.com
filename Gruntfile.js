const sass = require('node-sass');

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
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/www-tmp/typescript-dist/index.js',
                dest: 'build/www/scripts/index.min.js'
            }
        },


        // Style Configuration
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'build/www-tmp/sass-dist/style.css': 'src/main/www/style/style.scss'
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
                src: 'build/www-tmp/sass-dist/style.css',
                dest: 'build/www/style/style.min.css'
            },
            prod: {
                options: {
                    map: false
                },
                src: 'build/www-tmp/sass-dist/style.css',
                dest: 'build/www/style/style.min.css'
            }
        },

        //
        'compile-handlebars': {
            allStatic: {
                files: [{
                    src: 'src/main/www/index.hbs',
                    dest: 'build/www/index.html'
                }],
                templateData: 'test/fixtures/data.json',
                handlebars: 'node_modules/handlebars'
            },
        },

        // Watch
        watch: {
            scripts: {
                files: 'src/main/www/scripts/**/*.ts',
                tasks: ['scripts'],
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
        }
    });

    grunt.registerMultiTask("hbs", ["compile handlebars", ], handleBarsTask)

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('style', ['sass', 'postcss'])
    grunt.registerTask('scripts', ['ts', 'uglify'])
    grunt.registerTask('html', ['clean:html', 'compile-handlebars'])
    grunt.registerTask('watch-browser-sync', ['browserSync', 'watch'])

    // Default task(s).
    grunt.registerTask('all', ['scripts', 'style', 'html']);
    grunt.registerTask('default', ['all', 'watch-browser-sync']);

};

function handleBarsTask() {

}