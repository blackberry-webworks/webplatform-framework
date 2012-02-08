var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    wrench = require('wrench'),
    zip = require("zip"),
    path = require('path'),
    _c = require('./build/conf');


function _getJSDocToolkit(callback) {
    var jsdoc_url, req, exists;
    exists = path.existsSync(_c.DEPENDENCIES_JSDOC_ZIP);

    if (!exists) {
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

function _exractJSDocToolkit(callback) {
    var data, filesObj, p, parent, to, exists_zip, exists_dir;
    to = _c.DEPENDENCIES;

    exists_zip = path.existsSync(_c.DEPENDENCIES_JSDOC_ZIP);
    exists_dir = path.existsSync(_c.DEPENDENCIES_JSDOC);

    if (!exists_zip) {
        throw (new Error("JSDocs .zip is Missing ..."));
    }

    if (exists_dir) {
        data = fs.readFileSync(_c.DEPENDENCIES_JSDOC_ZIP);
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
        console.log('JSDocs exists');
    }
}

module.exports = function () {
    _getJSDocToolkit(function () {
        _exractJSDocToolkit();
    });
};