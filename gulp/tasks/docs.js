'use strict';

var gulp    = require('gulp');
var _       = require('lodash');
var path    = require('path');
var Dgeni   = require('dgeni');
var config  = require('../config');
var packageJson = require('../../package.json');
var packageJsonVersion = getCleanVersion(packageJson.version);

function getCleanVersion(version){
  var dash = version.indexOf('-');
  return dash === -1 ? version : version.substr(0, dash);
}

function configureDgeni(dgeni, log) {
  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'info';
}

function configurePaths(readFilesProcessor, writeFilesProcessor, computePathsProcessor) {
  readFilesProcessor.basePath = config.docs.base;
  readFilesProcessor.sourceFiles = config.docs.sources;
  writeFilesProcessor.outputFolder = config.docs.outputDirectory;

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    getPath: function(doc) {
      return path.dirname(doc.fileInfo.relativePath);
    },
    outputPathTemplate: packageJsonVersion + '/${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['overview'],
    getPath: function(doc) {
      return doc.fileInfo.baseName;
    },
    outputPathTemplate: packageJsonVersion + '.html'
  });
}

function configureIds(computeIdsProcessor) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['module'],
    getId: function(doc) {
      return path.dirname(doc.fileInfo.relativePath);
    }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['overview'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
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
        return doc.docType === 'module' || doc.docType === 'overview';
      });
    }
  };
}

function packageVersionProcessor() {
  return {
    $runBefore: ['computePathsProcessor'],
    $runAfter: ['providerDocsProcessor'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        doc.packageVersion = packageJsonVersion;
      });
    }
  };
}

function guidelineTagProcessor() {
  return {
    name: 'guideline',
    multi: true,
    docProperty: 'guidelines'
  };
}

function imageTagProcessor() {
  return {
    name: 'image'
  };
}

function exampleTagProcessor() {
  var languageConversion = {
    'js' : 'javascript',
    'jsx' : 'javascript',
    'html' : 'html',
    'css' : 'css',
    'scss' : 'css'
  };

  return {
    name: 'example',
    multi: true,
    docProperty: 'examples',
    transforms: function(doc, tag, value) {
      if(value){
        var exampleRegex = /^([^\s]*)\s+([\S\s]*)/;
        var match = exampleRegex.exec(value);
        var exampleInfo = {
          name : match[1],
          content: match[2]
        };
        //get file extension
        var fileExtension = _.last(exampleInfo.name.split('.'));
        //and do lookup for the language highlight represented by the extension used
        exampleInfo.language = languageConversion[fileExtension] || '';
        exampleInfo.templateOutput = '{% highlight ' + exampleInfo.language + '%} \n' + exampleInfo.content + '\n{% endhighlight %}';

        // Attach the example as an object to the doc
        doc.exampleFiles = doc.exampleFiles || [];

        doc.exampleFiles.push(exampleInfo);
        // return the content
        return match[2];
      }
    }
  };
}


gulp.task('docs', [], function() {
  var pkg = new Dgeni.Package('akamai-package', [
    require('dgeni-packages/ngdoc')
  ])
  .config(configureDgeni)
  .config(configurePaths)
  .config(configureIds)
  .config(configureTemplates)
  .config(function(parseTagsProcessor, getInjectables) {
      parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(  getInjectables([guidelineTagProcessor, imageTagProcessor, exampleTagProcessor]) );
  })
  .processor(packageVersionProcessor)
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
