module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },

    stylus: {
      compile: {
        files: {
          'dist/css/squarify.css': 'src/styl/squarify.styl'
        }
      }
    },

    babel: {
      dist: {
        files: {
          'dist/js/squarify.js': 'src/js/squarify.js'
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['src/js/squarify.js'],
        tasks: ['babel']
      },

      stylus: {
        files: ['src/styl/squarify.styl'],
        tasks: ['stylus'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('serve', ['stylus', 'babel', 'connect:server', 'watch']);
};
