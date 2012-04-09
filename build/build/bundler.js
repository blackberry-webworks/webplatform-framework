var fs = require('fs'),
    path = require('path');

module.exports = {
    bundle: function () {
        var fs = require('fs'),
            files = [
                "lib/utils.js",
                "lib/events.js",
                "lib/chrome.js",
                "lib/chrome/internal.js",
                "lib/Webview.js"
            ],
            include = function (files, transform) {
                files = files.map ? files : [files];
                return files.map(function (file) {
                    var str = fs.readFileSync(file, "utf-8") + "\n";
                    return transform ? transform(str, file) : str;
                }).join('\n');
            },
            output = "",
            filepath;

        //include LICENSE
        output += include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //include require
        output += include("dependencies/browser-require/require.js");

        //include modules
        output += include(files, function (file, path) {
            return "require.define('" + path.replace(/lib/, "").replace(/\.js$/, "") +
                   "', function (require, module, exports) {\n" + file + "});\n";
        });

        //include window.webworks
        output += include("lib/public/webplatform.js");

        //create output folder if it doesn't exist
        filepath = __dirname.replace(/\\/g, '/') + "/../../clientFiles";
        if (!path.existsSync(filepath)) {
            fs.mkdirSync(filepath, "0777"); //full permissions
        }
        fs.writeFileSync(filepath + "/webplatform.js", output);
    }
};
