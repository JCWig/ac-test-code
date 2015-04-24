var gulp      = require('gulp');
var shell = require('shelljs');
var rsync = require('rsyncwrapper').rsync;
var globby = require('globby');
var config    = require('../config').production;
var bundleLogger = require('../util/bundle-logger');

gulp.task('deploy', function(){
    var output = shell.exec('git rev-parse --symbolic-full-name --abbrev-ref @{u}');
    bundleLogger.log(output);
    
    /*
    git.revParse({args:'--symbolic-full-name --abbrev-ref @{u}'}, function (err, branchName) {
        bundleLogger.log('current git branch: '+ branchName);
        //clean up branch name:
        var cleanBranchName = branchName.replace('origin/feature/', '').replace(' ', '_');
        bundleLogger.log('clean branch name: '+ cleanBranchName);

        var longFolderName = '/315289/website/branches/' + cleanBranchName;

        bundleLogger.log('rsync destination: '+ longFolderName);
        return;
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
    */
});