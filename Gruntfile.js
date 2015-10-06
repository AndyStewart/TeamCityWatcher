module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      jshint: {
        all: ['Gruntfile.js', 'lib/**/*.js', 'specs/**/*.js']
      },
      react: {
        dynamic_mappings: {
          files: [
            {
              expand: true,
              cwd: 'public/javascripts/components',
              src: ['**/*.js'],
              dest: 'public/javascripts/build',
              ext: '.js'
            }
          ]
        }
      },
      mochaTest: {
        test: {
          options: {
            reporter: 'spec'
          },
          src: ['specs/**/*.js']
        }
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-react');
  grunt.registerTask('default', [ 'mochaTest', 'react']);
};