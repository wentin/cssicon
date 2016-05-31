module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/style1.css': 'scss/style1.scss',
                    'css/style2.css': 'scss/style2.scss',
                    'css/style3.css': 'scss/style3.scss',
                    'css/style4.css': 'scss/style4.scss',
                    'css/style5.css': 'scss/style5.scss',
                    'css/style6.css': 'scss/style6.scss',
                    'css/simple.css': 'scss/simple.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                map: true
            },
            dist: {
                files: {
                    'css/style1.css': 'css/style1.css',
                    'css/style2.css': 'css/style2.css',
                    'css/style3.css': 'css/style3.css',
                    'css/style4.css': 'css/style4.css',
                    'css/style5.css': 'css/style5.css',
                    'css/style6.css': 'css/style6.css',
                    'css/simple.css': 'css/simple.css'
                }
            }
        },
        watch: {
            css: {
                files: 'scss/*.scss',
                tasks: ['sass', 'autoprefixer']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.registerTask('default', ['watch']);
}
