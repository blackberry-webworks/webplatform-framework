var fs = require('fs'),
    http,
    url,
    _c = require('./conf'),
    stats,
    jsdocs_url,
    file_name,
    file,
    options,
    gzip,
    zlib,
    zipIn,
    zipOut,
    childProcess = require("child_process"),
    size,
    path = require('path');

function begin () {
   path.exists(_c.DEPENDENCIES_JSDOC, getJSDocs);
} 



function getJSDocs (exists) {
    if (!exists) {
        console.log("File Missing :( Let's get some!");
        url = require('url');
        http = require('http');
        
        jsdocs_url = url.parse(_c.DEPENDENCIES_JSDOC_URL);
        var DOWNLOAD_DIR = _c.DEPENDENCIES + "/";

        var options = {
            host: jsdocs_url.host,
            port: 80,
            path: jsdocs_url.pathname
        };

        console.log(options);

        var file_name = jsdocs_url.pathname.split('/').pop();
        var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

        http.get(options, function(res) {
            console.log("Response was " + res.statusCode);
            res.on('data', function(data) {
                file.write(data);
            }).on('end', function() {
                file.end();
                console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
            });
        });
    };
};


function unzipJSDocs () {
    zlib = require('zlib');
    gunzip = zlib.createGunzip();
    zipIn = fs.createReadStream(_c.DEPENDENCIES_JSDOC_ZIP);
    zipOut = fs.createWriteStream(_c.DEPENDENCIES);
    zipIn.pipe(gunzip).pipe(zipOut);
}

module.exports = function (src, baton) {
    baton.take();

    childProcess.exec(begin(), function (error, stdout, stderr) {
        if (error) {
            console.log(stdout);
            console.log(stderr);
            baton.pass(error.code);
        } else {
            baton.pass(src);
        }
    });
};
