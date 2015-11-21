// Generated on 2015-11-13 using generator-chrome-extension 0.4.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  // Configurable paths
  var config = {
    app: ''
  };

  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['scss/*.scss'],
        tasks: ['sass']
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    }
  });

  grunt.registerTask('debug', function () {
    grunt.task.run([
      'watch'
    ]);
  });

  grunt.registerTask('test', [
  ]);

  grunt.registerTask('build', [
    'sass'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
