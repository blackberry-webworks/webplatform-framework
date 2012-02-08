var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    wrench = require('wrench'),
    zip = require("zip"),
    path = require('path'),
    _c = require('./build/conf');


function _getJSDocToolkit(callback) {
    var jsdoc_url = url.parse(_c.DEPENDENCIES_JSDOC_URL)
    
    var req = http.get({'host': jsdoc_url.host, 'path': jsdoc_url.pathname}, function (res) {
        var stream = fs.createWriteStream(_c.DEPENDENCIES_JSDOC_ZIP);
        res.pipe(stream);
        res.on('end', function() {
            console.log('done');
            callback();
        });
    }).on('error', function(e) {
        throw (new Error("JSDocs Unable to Download ..."));
    });

    req.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
    });
}

function _exractJSDocToolkit(callback) {
    var data, filesObj, p, parent;
    var from = _c.DEPENDENCIES_JSDOC_ZIP;
    var to = _c.DEPENDENCIES;
    var exists = path.existsSync(from);

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

module.exports = function () {
    _getJSDocToolkit(function () {
        _exractJSDocToolkit();
    });
};