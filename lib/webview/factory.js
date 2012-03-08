/*
 * Copyright 2010-2011 Research In Motion Limited.
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

var Webview = require("./webview"),
    utils = require("../utils"),
    event = require("../event"),
    webviews = [],
    _self;

// Setup listeners
event.on(0x610BA11D, "Created", function (something) {
    console.log("webview created");
    console.log(something);
});

event.on(0x610BA11D, "Destroyed", function (something) {
    console.log("webview destroyed");
    console.log(something);
});

/**
 * @exports _self as blackberry
 * @namespace blackberry
*/
_self = {
    /**
     * @description This method creates a new webview object 
     * @param options Additional options
     * @returns {Webview} A webview object
    */ 
    createWebview : function (options) {
        options = utils.mixIn(require("./defaultOptions"), options || {});
        return new Webview(options);
    }
};

module.exports = _self;
