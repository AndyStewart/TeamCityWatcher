module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      jshint: {
        all: ['Gruntfile.js', 'lib/**/*.js', 'specs/**/*.js']
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
  grunt.registerTask('default', ['jshint', 'mochaTest']);
};