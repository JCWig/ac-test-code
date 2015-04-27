var gulp  = require('gulp');
var shell = require('shelljs');
var rsync = require('rsyncwrapper').rsync;
var bundleLogger = require('../util/bundle-logger');

gulp.task('deploy', function(){
    var result = shell.exec('git branch -a --contains $GIT_COMMIT');
    var symbolicName = result.output.trim();
    bundleLogger.log('symbolic name', symbolicName);

    var regex = /origin\/feature\/(.+)$/;

    var matches = symbolicName.match(regex);

    var branchName = matches[1];
    
    //clean up branch name:
    var cleanBranchName = branchName.replace(' ', '_');
    bundleLogger.log('clean branch name: '+ cleanBranchName);
    
    var longFolderName = '/315289/website/branches/' + cleanBranchName;

    bundleLogger.log('rsync destination: '+ longFolderName);
    
    //TODO: Handle scenarios where the folder needs to be generated on the server side
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
});

