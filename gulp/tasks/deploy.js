var gulp      = require('gulp');
var shell = require('shelljs');
var rsync = require('rsyncwrapper').rsync;
var bundleLogger = require('../util/bundle-logger');

gulp.task('deploy', function(){
    var result = shell.exec('echo $GIT_URL');
    var symbolicName = result.output.trim();
    bundleLogger.log('symbolic name', symbolicName);
    
    //clean up branch name:
    var cleanBranchName = symbolicName.replace('origin/feature/', '').replace(' ', '_');
    bundleLogger.log('clean branch name: '+ cleanBranchName);

    var longFolderName = '/315289/website/branches/' + cleanBranchName;

    bundleLogger.log('rsync destination: '+ longFolderName);
    //TODO: Handle scenarios where the folder needs to be generated on the server side
    /*
    rsync({
      ssh: true,
      src: ['./dist', './examples'],
      dest: 'sshacs@lunahome.upload.akamai.com:' + longFolderName,
      recursive: true,
      args: ["--copy-dirlinks", "--verbose", "--compress"]
      //dryRun: true
    }, function(error, stdout, stderr, cmd) {
        bundleLogger.log(error, stdout, cmd);
    });
    */
});