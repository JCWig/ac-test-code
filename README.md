# Akamai Core


## Overview

This project provides a set of reusable Angular.js components that adhere to
the Akamai user experience guidelines. It depends upon the Akamai styles 
project which defines the markup patterns and associated CSS rules.

Currently, this project leverages the
[Bootstrap Angular UI](http://angular-ui.github.io/bootstrap/) open source
project for implementations of basic user interface components. These
components are wrapped in an Akamai-specific API that follow the UX
guidelines and may be swapped out for a different implementation in the
future.

## App Usage

To use the components, an app developer must include a link to the Akamai
stylesheet in addition to referencing scripts for Angular.js 1.3.x and the
components.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Example</title>
    <link rel="stylesheet" href="path/to/akamai-core.css">
</head>
<body>
    <div class="container">
    </div> 

    <script src="path/to/angular.js"></script>
    <script src="path/to/akamai-core.js"></script>
</body>
</html>
```

## Development

### Examples

The project includes usage examples for each component in the **examples/**
directory. To view the examples locally, run: 

`npm start`

This will launch the examples within your browser and will subsequently reload
the web page every time a source file is updated.

### Tests

The test suite for components may be found in the **test/** directory. To
execute the tests in a headless browser (PhantomJS), run:

`npm test`

This will lint the source code and execute the full test suite reporting to
the console the passed/failed specs and code coverage summary.

### Individual Folder Testing

When working on a single component, you may notice that running the entire suite is a pain
and may take a considerable amount of time.  Instead, you can use the the testDir argument
as follows:

`npm run gulp -- test --testDir=spinner --production`

OR:

`npm test -- --testDir=spinner`

This will run the tests for only the folder with the pattern `spec/${testDir}/**/*.js`

### API Documentation

Documentation is written alongside source code using [ngdoc][1].

[1]: https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation

