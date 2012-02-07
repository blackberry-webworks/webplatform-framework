var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    wrench = require('wrench'),
    zip = require("zip"),
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

function _getJSDocToolkit(callback) {
    var jsdoc_url = url.parse(_c.DEPENDENCIES_JSDOC_URL)
    
    http.get({'host': jsdoc_url.host, 'path': jsdoc_url.pathname}, function (res) {
        var stream = fs.createWriteStream(_c.DEPENDENCIES_JSDOC_ZIP);
        res.pipe(stream);
        res.on('end', function() {
            callback();
        });
    }).on('error', function(e) {
        throw (new Error("JSDocs Unable to Download ..."));
    });
}

function _exractJSDocToolkit(callback) {
    var data, filesObj, p, parent;
    var from = _c.DEPENDENCIES_JSDOC_ZIP;
    var to = _c.DEPENDENCIES;
    exists = path.existsSync(from);

    if (exists) {
        data = fs.readFileSync(from);
        filesObj = zip.Reader(data).toObject("utf-8");

        if (!path.existsSync(to)) {
            wrench.mkdirSyncRecursive(to, "0755");
        }

        for (p in filesObj) {
            if (p.split("/").length > 1) {
                parent = p.split("/").slice(0, -1).join("/");
                wrench.mkdirSyncRecursive(to + "/" + parent, "0755");
            }

            fs.writeFileSync(to + "/" + p, filesObj[p]);
        }
    } else {
        throw (new Error("JSDocs .zip is Missing ..."));
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

    _getJSDocToolkit(function () {
        _exractJSDocToolkit(build_docs);
    });

    function build_docs() {
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
    }
};