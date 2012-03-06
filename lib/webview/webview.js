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
    utils = require("../utils"),
    webkitEvent = require('../webkitEvent'),
    qnx = utils.getQnxNamespace(),
    _self;

/**
 * @class A javascript abstraction of the underlying webkit webview
 * @property {Number} id The id of the webview. READ ONLY
 * @property {Number} windowGroup The windowGroup of the webview. READ ONLY
 * @property {Boolean} visible Whether the webview is currently visible
 * @property {Boolean} active Whether the webview is currently active
 * @property {Number} zOrder The zOrder of the webview
 * @property {String} url The fully qualified url currently loaded into the webview
 */
function Webview(options) {
    
    var webviewId = options.webviewId,
        windowGroup = qnx.callExtensionMethod("webview.applicationWindowGroup", webviewId),
        id = parseInt(qnx.callExtensionMethod('webview.create', windowGroup, "InProcess"), 10),
        visible = options.visible,
        active = options.active,
        zOrder = options.zOrder,
        url = options.url;

    this.__defineGetter__("id", function () {
        return id;
    });

    this.__defineGetter__("windowGroup", function () {
        return windowGroup;
    });

    this.__defineGetter__("visible", function () {
        return visible;
    });

    this.__defineSetter__("visible", function (newVisibility) {
        visible = !!newVisibility;
        qnx.callExtensionMethod("webview.setVisible", id, visible);
    });

    this.__defineGetter__("active", function () {
        return active;
    });

    this.__defineSetter__("active", function (newActivity) {
        active = !!newActivity;
        qnx.callExtensionMethod("webview.setActive", id, active);
    });

    this.__defineGetter__("zOrder", function () {
        return zOrder;
    });

    this.__defineSetter__("zOrder", function (newZOrder) {
        zOrder = parseInt(newZOrder, 10);
        qnx.callExtensionMethod("webview.setZOrder", id, zOrder);
    });
    
    this.__defineGetter__("url", function () {
        return url;
    });

    this.__defineSetter__("url", function (newUrl) {
        url = newUrl;
        qnx.callExtensionMethod("webview.loadURL", this.id, url);
    });

    webkitEvent.on(this.id, "LocationChange", function (newUrl) {
        this.url = newUrl;
    }, this); //send this for scope so it can update the url property
}

/**#@+
* @param {String} eventType The native event to be listened to. 
* Can be one of 'PropertyViewportEvent', 'QNXWebDestroyedEvent', 'Destroyed', 'Created', 'PropertyLoadProgressEvent', 'PropertyLocationEvent', 'PropertyTitleEvent', 'PropertyCanGoBackEvent', 'PropertyCanGoForwardEvent', 'PropertyFaviconEvent', 'PropertySecureTypeEvent', 'JavaScriptResult', 'ContentRendered', 'JavaScriptWindowObjectCleared', 'PropertyTooltipEvent', 'Created', 'DocumentLoadCommitted', 'DocumentLoaded', 'DocumentLoadFinished', 'LocationChange', 'LocationChanging', 'NetworkError', 'PropertyActiveEvent', 'PropertyBackgroundColorEvent', 'PropertyCertificateInfoEvent', 'PropertyContentRectangleEvent', 'PropertyEnableWebInspectorEvent', 'PropertyEncryptionInfoEvent', 'PropertyHistoryListEvent', 'PropertyHistoryPositionEvent', 'PropertyJavaScriptInterruptTimeoutEvent', 'PropertyOriginalLocationEvent', 'PropertyScaleEvent', 'PropertyScrollPositionEvent', 'PropertyStatusEvent', 'PropertyVisibleEvent', 'PropertyWebInspectorPortEvent', 'PropertyZOrderEvent'.
**/

/**
 * @description Adds a listener for a given event. Multiple listeners can be registered for the same event.
 * @param {callback} eventListener The function to be invoked when the event occurs
 */
Webview.prototype.addEventListener = function (eventType, eventListener) {
    webkitEvent.on(this.id, eventType, eventListener); //What to put for scope???
};

/**
 * @description Removes a specific registered listener for a given event
 * @param {Object} eventListener The function to be removed from the list of event listeners
 */
Webview.prototype.removeEventListener = function (eventType, eventListener) {
    webkitEvent.removeEventListener(this.id, eventType, eventListener);
};

/**
 * @description Dispatches an event of the provided type with the given arguments to all registered listeners.
 * @param {Object[]} args The array of objects to be passed to the event
 */
Webview.prototype.dispatchEvent = function (eventType, args) {
    webkitEvent.emit(this.id, eventType, args);
};

/**#@-*/

/**
* @description Sets the location of the webview on the screen
* @param {Number} x The x position of the webview
* @param {Number} y The y position of the webview
* @param {Number} width The width of the webview
* @param {Number} height The height of the webview
*/
Webview.prototype.setGeometry = function (x, y, width, height) {
    qnx.callExtensionMethod("webview.setGeometry", this.id, x, y, width, height);
};

/**
* @description Destroys the underlying native webview
* @param {callback} [onComplete] A callback to be invoked when the destruction call is complete
*/ 
Webview.prototype.destroy = function (onComplete) {
    qnx.callExtensionMethod("webview.destroy", this.id);
    webkitEvent.clear(this.id);
    if (onComplete && typeof onComplete === 'function') {
        onComplete();
    }
};

/**
* @description Executes javascript in the context of the webview
* @param {String} js The javascript expression to be executed
     * @param {boolean} [inIsolatedWorld=false] Run javascript in isolated context
     * @param {callback} [onComplete] A callback to be invoked when the destruction call is complete
*/ 
Webview.prototype.executeJavaScript = function (js, inIsolatedWorld, onComplete) {
    qnx.callExtensionMethod("webview.executeJavaScript", this.id, js, inIsolatedWorld || false);

    if (onComplete && typeof onComplete === 'function') {
        onComplete();
    }
};

/**
     * @description Sets the background color of the webview
     * @param {String} color The desired background color of the webview in hex
     * @example webview.setBackgroundColor("0x00FFFFFF");
*/
Webview.prototype.setBackgroundColor = function (color) {
    qnx.callExtensionMethod("webview.setBackgroundColor", this.id, color);
};

module.exports = Webview;
