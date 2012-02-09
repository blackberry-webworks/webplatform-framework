var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    wrench = require('wrench'),
    zip = require("zip"),
    path = require('path'),
    _c = require('./build/conf');



function createDependenciesDir(andThen) {
    if (!path.existsSync(_c.DEPENDENCIES)) {
        fs.mkdir(_c.DEPENDENCIES, "0755", andThen);
    } else {
        andThen();
    }

}

function downloadJSDocToolkit(callback) {
    var jsdoc_url, 
        req;

    if (!path.existsSync(_c.DEPENDENCIES_JSDOC_ZIP)) {
        jsdoc_url = url.parse(_c.DEPENDENCIES_JSDOC_URL);
        
        req = http.get({'host': jsdoc_url.host, 'path': jsdoc_url.pathname}, function (res) {
            var stream = fs.createWriteStream(_c.DEPENDENCIES_JSDOC_ZIP);
            res.pipe(stream);
            res.on('end', function () {
                callback();
            });
        }).on('error', function (e) {
            throw (new Error("JSDocs Unable to Download ..."));
        });

        req.on('error', function (e) {
            throw (new Error('Problem with request: ' + e.message));
        });
    } else {
        callback();
    }
}

function extractJSDocToolkit() {
    var data, 
        filesObj, 
        p, 
        parent, 
        to = _c.DEPENDENCIES;
    
    if (!path.existsSync(_c.DEPENDENCIES_JSDOC_ZIP)) {
        throw (new Error("JSDocs .zip is Missing ..."));
    }

    if (!path.existsSync(_c.DEPENDENCIES_JSDOC)) {
        data = fs.readFileSync(_c.DEPENDENCIES_JSDOC_ZIP);
        filesObj = zip.Reader(data).toObject();

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
        console.log('JSDocs already exists at ' + _c.DEPENDENCIES_JSDOC);
    }
}

function _extractJSDocs() {
    createDependenciesDir(function () {
        downloadJSDocToolkit(extractJSDocToolkit);
    });
}

module.exports = _extractJSDocs;
