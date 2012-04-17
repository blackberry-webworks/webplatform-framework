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


/**
 * @exports _self as qnx.webplatform
 * @namespace qnx.webplatform
*/
qnx.webplatform = (function () {
    var _r = window.require,
        WebView,
        chrome,
        _controller,
        internal;
        
    window.require = function (id) {
        id = id.replace(/^\.\.\/\.\.\//, "");
        return _r(id);
    };
        
    WebView = require("WebView");
    chrome = require("chrome");
    internal = require("chrome/internal");

    _controller = new WebView({WebViewId : chrome.id});

    window.chrome.internal.webEvent = internal.webEvent;

    return {
        /**
         * @description This method creates a new webview object 
         * @returns {Webview} A webview object
         */ 
        createWebView : function () {
            return new WebView();
        },
        
        /**
         * @description This method returns the Webview object for the controller
         * @returns {Webview} The controller webview
         */ 
        getController : function () {
            return _controller;
        }
    };
}());
