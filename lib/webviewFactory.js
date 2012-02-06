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

var Webview,
    utils = require("./utils"),
    qnx = utils.getQnxNamespace(),
    _self;

/**
 * @class A javascript abstraction of the underlying webkit webview
 */
Webview = function () {
    
    var screen = utils.getScreenNamespace(), 
        id = -1,
        windowGroup = -1,
        chromeId = 1,
        chromeHeight = 0;
    
    Webview.__defineGetter__("id", function () {
        return id;
    });

    /**
     * @param {callback} [onComplete] A callback invoked when the webview creation is completed
     * @description Creates an underlying webview object and displays it on the screen
     */ 
    Webview.prototype.create = function (onComplete) {
        
        windowGroup = qnx.callExtensionMethod("webview.applicationWindowGroup", chromeId);
        
        id = qnx.callExtensionMethod("webview.create", windowGroup);
        
        this.foreground();
        qnx.callExtensionMethod("webview.setGeometry", id, 0, chromeHeight, screen.width, screen.height - chromeHeight);

        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
    };

    /**
     * @description Sets the webview to visible, active and ZOrdered
     */ 
    Webview.prototype.foreground = function () {
        qnx.callExtensionMethod("webview.setVisible", id, true);
        qnx.callExtensionMethod("webview.setActive", id, true);
        qnx.callExtensionMethod("webview.setZOrder", id, 0);
    };

    /**
     * @description Disables the webview's visibility, activity and ZOrderedness
     */ 
    Webview.prototype.background = function () {
        qnx.callExtensionMethod("webview.setVisible", id, false);
        qnx.callExtensionMethod("webview.setActive", id, false);
        qnx.callExtensionMethod("webview.setZOrder", id, -99);
    };

    /**
     * @description Destroys the underlying native webview
     * @param {callback} [onComplete] A callback to be invoked when the destruction call is complete
     */ 
    Webview.prototype.destroy = function (onComplete) {
        qnx.callExtensionMethod("webview.destroy", id);
        
        if (onComplete && typeof onComplete === 'function') {
            onComplete();
        }
    };

    /**
     * @description Sets the URL on the webview
     * @param {String} url The fully qualified url to be loaded into the webview
     */ 
    Webview.prototype.setURL = function (url) {
        qnx.callExtensionMethod("webview.loadURL", id, url);
    };

    /**
     * @description Executes javascript in the context of the webview
     * @param {String} js The javascript expression to be executed
     * @param {boolean} [inIsolatedWorld=false] Run javascript in isolated context
     */ 
    Webview.prototype.executeJavaScript = function (js, inIsolatedWorld) {
        qnx.callExtensionMethod("webview.executeJavaScript", id, js, inIsolatedWorld || false);
    };

    return Webview;
};

/**
 * @exports _self as webviewFactory
 * @namespace webviewFactory
 */
_self = {
    /**
     * @description This method creates a new webview object 
     * @returns {Webview} A webview object
     */ 
    create : function () {
        return new Webview();
    }
};

module.exports = _self;
