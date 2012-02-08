# WebPlatform Framework APIS
## Build
1. Run the configuration script (./configure or configure.bat)

2. Call jake

## Docs

#### Setting up your Environment
1. Download the [jsdoc-toolkit](http://code.google.com/p/jsdoc-toolkit/downloads/list)

2. Extract the contents of the downloaded jsdoc zip into the dependencies folder

3. If you don't already have one, download and configure a [Java Runtime Environment] (http://www.oracle.com/technetwork/java/javase/downloads/index.html) on your machine

### Building the Documentation
1. The docs are automatically created in the build process (jake build). You can also specifically build them by calling jake docs

## Viewing the Documentation
After you have generated the documentation you will find all the HTML for the API docs in your docs folder

The documentation can also be viewed online on github at this [link](http://blackberry-webworks.github.com/webplatform-framework/index.html).

## Additional Information

### About the jsdoc-toolkit open source project

JsDoc Toolkit is an application used to document JavaScript interfaces and automatically generate template-formatted HTML documentation from commented JavaScript source code. It's similar to JavaDoc, where you can use tags like @param to document your APIs.

If you wish to read more information, or find out about more available tag references, please visit [this link](http://code.google.com/p/jsdoc-toolkit/w/list)
