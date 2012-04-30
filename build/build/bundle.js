/*
* Copyright 2011 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var fs = require('fs'),
    path = require('path');

function bundle(dest) {
    var fs = require('fs'),
        files = [
            "lib/utils.js",
            "lib/events.js",
            "lib/chrome.js",
            "lib/chrome/internal.js",
            "lib/ApplicationWindow.js",
            "lib/WebView.js"
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
        return "require.define('" + path.replace(/lib\//, "").replace(/\.js$/, "") +
                               "', function (require, module, exports) {\n" + file + "});\n";
    });

    //include window.webworks
    output += include("lib/public/webplatform.js");

    //create output folder if it doesn't exist
    filepath = !!dest ? dest :  __dirname.replace(/\\/g, '/') + "/../../clientFiles";
    if (!path.existsSync(filepath)) {
        fs.mkdirSync(filepath, "0777"); //full permissions
    }
    fs.writeFileSync(filepath + "/webplatform.js", output);
}

module.exports = function (src, baton) {
    baton.take();
    bundle(this.dest);
    baton.pass(src);
};
