module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'scss/icons',
                        src: ["*.scss", "**/*.scss"],
                        dest: 'css/icons',
                        ext:  '.css'
                    }
                ]
            },
            dist2: {
                options: {
                    style: 'expanded',
                    require: 'sass-globbing'
                },
                files: {
                    'css/app.css': 'scss/app.scss',
                    'css/icons.css': 'scss/icons.scss'
                }
            }
        },
        autoprefixer: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'css/icons',
                        src: ["*.css", "**/*.css"],
                        dest: 'css/icons',
                        ext:  '.css'
                    }
                ]
            },
            dist2: {
                options: {
                    map: true
                },
                files: {
                    'css/app.css': 'css/app.css',
                    'css/icons.css': 'css/icons.css',
                }
            }
        },
        watch: {
            css: {
                // files: 'scss/**/*.scss',
                files: 'scss/*.scss',
                tasks: ['sass', 'autoprefixer']
            },
            options: {
              livereload: true
            }
        },
        connect: {
          server: {
            options: {
              port: 8080,
              hostname: '*'
            }
          }
        }
    });
    grunt.loadNpmTasks('grunt-sass-globbing');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['connect', 'watch']);
}
