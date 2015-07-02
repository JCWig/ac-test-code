'use strict';

var gulp = require('gulp');
var shell = require('shelljs');
var rsync = require('rsyncwrapper').rsync;
var bundleLogger = require('../util/bundle-logger');
var maxTries = 3;

function doRsync(location, tries) {
  tries = tries || 1;

  //TODO: Handle scenarios where the folder needs to be generated on the server side
  rsync({
    ssh: true,
    src: ['./dist', './examples'],
    dest: 'sshacs@lunahome.upload.akamai.com:' + location,
    recursive: true,
    args: ['--verbose', '--compress', '--partial', '--progress', '--recursive', '--sockopts=SO_RCVTIMEOUT=0']
    //dryRun: true
  }, function(error, stdout, stderr, cmd) {
    if (error != null) {
      if ( tries >= maxTries ) {
        bundleLogger.log('too many rsync tries failed.');
        return;
      }
      bundleLogger.log('rsync attempt failed.', error, cmd);
      doRsync(location, tries + 1);
    } else {
      bundleLogger.log('rsync success', stdout, cmd);
    }
  });
}

gulp.task('deploy', function() {
  var result, symbolicName, regex, matches, branchName, cleanBranchName, longFolderName;

  result = shell.exec('git branch -a --contains $GIT_COMMIT');
  symbolicName = result.output.trim();
  bundleLogger.log('symbolic name', symbolicName);

  regex = /origin\/feature\/(.+)$/m;

  matches = symbolicName.match(regex);

  if (matches && matches.length > 1) {
    branchName = matches[1];
  } else {
    branchName = 'develop';
  }

  //clean up branch name:
  cleanBranchName = branchName.replace(' ', '_');
  bundleLogger.log('clean branch name: ' + cleanBranchName);

  longFolderName = '/315289/website/branches/' + cleanBranchName;
  bundleLogger.log('rsync destination: ' + longFolderName);

  doRsync(longFolderName, 1);
});

