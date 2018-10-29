module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-po2json');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  var _ = grunt.util._;

  var locales = ["en", "zh-CN"];
  var moduleName = grunt.option('name') || 'Test';
  var moduleNameUpper = moduleName.toUpperCase();
  var moduleNameCapital = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
  var moduleNameCamel = moduleName.charAt(0).toLowerCase() + moduleName.slice(1)

  // Project configuration.
  grunt.initConfig({
    po2json: {
      target: {
        src: ["translations/*.po"],
        dest: "src/i18n",
        options: {
          nodeJs: true,
          stringOnly: true
        }
      }
    },

    shell: {
      options: {
        failOnError: true
      },
      msgmerge: {
        command: _.map(locales, function (locale) {
          var po = "translations/" + locale + ".po";
          return "if [ -f \"" + po + "\" ]; then\n" +
            "    echo \"Updating " + po + "\"\n" +
            "    msgmerge " + po + " translations/messages.pot > .new.po.tmp\n" +
            "    exitCode=$?\n" +
            "    if [ $exitCode -ne 0 ]; then\n" +
            "        echo \"Msgmerge failed with exit code $?\"\n" +
            "        exit $exitCode\n" +
            "    fi\n" +
            "    mv .new.po.tmp " + po + "\n" +
            "fi\n";
        }).join("")
      }
    },

    exec: {
      msgmerge: {
        cmd: _.map(locales, function (locale) {
          var po = "translations/" + locale + ".po";
          return "if exist \"" + po + "\" ( " +
            "    echo \"Updating " + po + "\" & " +
            "    msgmerge " + po + " translations/messages.pot > .new.po.tmp & " +
            "    if errorlevel 1 ( " +
            "        echo \"Msgmerge failed with exit code %errorlevel%\" & " +
            "        exit /b %errorlevel% " +
            "    ) else ( " +
            "    move .new.po.tmp " + po + " " +
            "  ) " +
            ")";
        }).join(" & ")
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'src/routes/Home',
        src: ['**'],
        dest: 'src/routes/' + moduleNameCapital + '/',
        rename: function (dest, src) {
          return dest + src.replace(/Home/g, moduleNameCapital);
        },
        options: {
          process: function (content, srcpath) {
            return content.replace(/Home/g, moduleNameCapital).replace(/HOME/g, moduleNameUpper).replace(/home/g, moduleNameCamel);
          },
        },
      },
    },
  });
  // tasks
  grunt.registerTask('merge', ['shell']);

  grunt.registerTask('merge-windows', ['exec']);

  grunt.registerTask('po2js', ['po2json']);

  grunt.registerTask('createModule', ['copy']);
};
