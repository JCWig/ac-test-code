'use strict';

var gulp = require('gulp');
var path = require('path');
var Dgeni = require('dgeni');

var pkg = new Dgeni.Package('akamai-package', [
  require('dgeni-packages/ngdoc')
])
.config(function(dgeni, log, readFilesProcessor, writeFilesProcessor) {
  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'info';

  readFilesProcessor.basePath = './src';
  readFilesProcessor.sourceFiles = ['indeterminate-progress/**/*.js'];
  writeFilesProcessor.outputFolder = '../docs';
})
.config(function(templateFinder) {
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));
})
.config(function(computePathsProcessor) {
    computePathsProcessor.pathTemplates.push({
        docTypes: ['module'],
        getPath: function(doc) {
          return path.dirname(doc.fileInfo.relativePath);
        },
        outputPathTemplate: '${path}/index.html'
    });
})
.processor(function filterDocsProcessor() {
  return {
    $runBefore: ['computePathsProcessor'],
    $runAfter: ['providerDocsProcessor'],
    $process: function(docs) {
      return docs.filter(function(doc) {
        return doc.docType === 'module';
      });
    }
  };
});

gulp.task('docs', ['clean'], function() {
    var dgeni = new Dgeni([pkg]);

    dgeni.generate()
    .then(function(docs) {
      console.log(docs.length, 'docs generated');
    })
    .catch(function(error) {
      console.log(error);
      process.exit(1);
    });
});
