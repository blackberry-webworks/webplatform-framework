var fs = require('fs'),
    _c = require('./conf'),
    childProcess = require("child_process"),
    path = require('path'),
    util,
    exists,
    ghostFile,
    ghostFileStr,
    jsDocsCommand;


function _done(error) {
    util = require('util');
    if (error) {
        util.puts("webplatform-framework DOCS FAILED:\n" + error);
        process.exit(1);
    } else {
        util.puts("webplatform-framework DOCS SUCCESS");
        process.exit();
    }
}

function _getJSDocCommand() {
    exists = path.existsSync(_c.DEPENDENCIES_JSDOC);

    if (!exists) {
        ghostFile = path.resolve(__dirname + '/ghost.txt');
        ghostFileStr = fs.readFileSync(ghostFile, "ASCII");
        console.log(ghostFileStr);
        throw (new Error("JSDocs is Missing ..."));
    }

    jsDocsCommand = "java " +
        "-jar " + _c.DEPENDENCIES_JSDOC + "jsrun.jar " + 
        _c.DEPENDENCIES_JSDOC + "app/run.js " + 
        "-a " + 
        "-p " + _c.LIB + 
        " -t=" + _c.DEPENDENCIES_JSDOC + "templates/jsdoc/ " + 
        "-d=" + _c.DOCS;
    
    return jsDocsCommand;

}

module.exports = function (src, baton) {
    if (baton) {
        baton.take();
    }

    childProcess.exec(_getJSDocCommand(), function (error, stdout, stderr) {
        if (error) {
            console.log(stdout);
            console.log(stderr);
            if (baton) {
                baton.pass(error.code);
            }
        } else {
            if (baton) {
                baton.pass(src);
            }
        }
        _done(error);
    });
  
};
