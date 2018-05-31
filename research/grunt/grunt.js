/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    min: {
      dist: {
        src: ['dist/test.css'],
        dest: 'dist/test.min.css'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'min');

};
