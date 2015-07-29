'use strict';

var gulp = require('gulp');
var path = require('path');
var Dgeni = require('dgeni');

function configureDgeni(dgeni, log) {
  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'info';
}

function configurePaths(readFilesProcessor, writeFilesProcessor, computePathsProcessor) {
  readFilesProcessor.basePath = './src';
  readFilesProcessor.sourceFiles = ['indeterminate-progress/**/*.js', 'modal-window/**/*.js', 'status-message/**/*.js'];
  writeFilesProcessor.outputFolder = '../docs';

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    getPath: function(doc) {
      return path.dirname(doc.fileInfo.relativePath);
    },
    outputPathTemplate: '${path}/index.html'
  });
}

function configureIds(computeIdsProcessor) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['module'],
    getId: function(doc) {
      return path.dirname(doc.fileInfo.relativePath);
    }
  });
}

function configureTemplates(templateFinder) {
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));
}

function filterDocsProcessor() {
  return {
    $runBefore: ['computePathsProcessor'],
    $runAfter: ['providerDocsProcessor'],
    $process: function(docs) {
      return docs.filter(function(doc) {
        return doc.docType === 'module';
      });
    }
  };
}

function guideline() {
  return {
    name: 'guideline',
    multi: true,
    docProperty: 'guidelines'
  };
}

gulp.task('docs', ['clean'], function() {
  var pkg = new Dgeni.Package('akamai-package', [
    require('dgeni-packages/ngdoc')
  ])
  .config(configureDgeni)
  .config(configurePaths)
  .config(configureIds)
  .config(configureTemplates)
  .config(function(parseTagsProcessor, getInjectables) {
      parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(  getInjectables([guideline]) );
  })
  .processor(filterDocsProcessor);

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
