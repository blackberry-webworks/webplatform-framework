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
        ApplicationWindow,
        chrome,
        _controller,
        _applicationWindow,
        internal,
        _originalWebEvent;
        
    window.require = function (id) {
        id = id.replace(/^\.\.\/\.\.\//, "");
        return _r(id);
    };
        
    WebView = require("WebView");
    chrome = require("chrome");
    internal = require("chrome/internal");
    ApplicationWindow = require("ApplicationWindow");

    _controller = new WebView({WebViewId : chrome.id});
    _applicationWindow = new ApplicationWindow();

    //Only two possible cases should be chrome does not exist
    //OR someone is already implementing webEvent and we will hijack
    //but we'll be cautious just in case
    if (!window.chrome) {
        window.chrome = {};
    }
    if (!window.chrome.internal) {
        window.chrome.internal = {};
    }
    if (!window.chrome.internal.webEvent) {
        window.chrome.internal.webEvent = internal.webEvent;
    } else {
        //Hijack the function and call ours upstream
        _originalWebEvent = window.chrome.internal.webEvent;
        window.chrome.internal.webEvent = function (id, eventId, value) {
            internal.webEvent.call(this, id, eventId, value);
            _originalWebEvent.call(this, id, eventId, value);
        };
    }

    return {
        /**
         * @description This method creates a new webview object 
         * @param {Function} onCreate A callback that will be fired when the native side creates the webview. Clients are expected to implement this as the native side will throw errors if the user attempts to access the webview before the event occures.
         * @returns {WebView} A webview object
         * @example
         * qnx.webplatform.getController().enableWebInspector(true);
         *
         * var webview = qnx.webplatform.createWebView(function (value, eventId) {
         *     webview.setGeometry(0, 0, screen.width, screen.height);
         *     webview.visible = true;
         *     webview.active = true;
         *     console.log("woot");
         * });
         */ 
        createWebView : function (onCreate) {
            return new WebView({onCreate : onCreate});
        },
        
        /**
         * @description This method returns the Webview object for the controller
         * @returns {WebView} The controller webview
         */ 
        getController : function () {
            return _controller;
        },

        /**
         * @description This method returns the ApplicationWindow object
         * @returns {ApplicationWindow} The Application Window
         */ 
        getApplicationWindow : function () {
            return _applicationWindow;
        }
    };
}());
