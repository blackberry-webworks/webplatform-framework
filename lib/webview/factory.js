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
    events = require("../events"),
    chrome = require("../chrome"),
    _webviews = [],
    _self;

// Setup listeners
events.on(0x610BA11D, "Created", function (something) {
    console.log("webview created");
    console.log(something);
});

events.on(0x610BA11D, "Destroyed", function (something) {
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
     * @returns {Webview} A webview object
    */ 
    createWebview : function () {
        var returnWebview = new Webview();
        _webviews[returnWebview.id] = returnWebview;
        return returnWebview;
    },

    getWebview : function (webviewId) {
        if (!_webviews[webviewId]) {
            _webviews[webviewId] = new Webview({webviewId : webviewId});
        }
        return _webviews[webviewId];
    },

    getController : function () {
        return this.getWebview(chrome.id);
    }
};

module.exports = _self;
