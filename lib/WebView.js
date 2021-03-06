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

var WebView,
    events = require('./events'),
    chrome = require('./chrome');

/**
 * @class A javascript abstraction of the underlying webkit webview
 * @property {Number} id The id of the webview. READ ONLY
 * @property {Number} windowGroup The windowGroup of the webview. READ ONLY
 * @property {Boolean} visible Whether the webview is currently visible
 * @property {Boolean} active Whether the webview is currently active
 * @property {Number} zOrder The zOrder of the webview
 * @property {String} url The fully qualified url currently loaded into the webview
 * @property {String} originalLocation The original location of a webview. READ ONLY
 * @property {Boolean} enableCrossSiteXHR Sets whether CrossSiteXHR is enabled or disabled for the webview
 * @property {Boolean} enableWebInspector Sets whether WebInspector is enabled or disabled for the webview
 */
///////////////////////////////////
//Webviews can be created using options.
//options.WebViewId specifies the webview id
//options.onCreate should be the onCreate function
///////////////////////////////////
function WebView(options) {

    var _windowGroup = qnx.callExtensionMethod("webview.applicationWindowGroup", chrome.id),
        //Either should be the input id or create a new webview
        _id = (options && options.WebViewId) ? options.WebViewId : parseInt(qnx.callExtensionMethod('webview.create', _windowGroup, "InProcess"), 10);

    if (options && options.onCreate) {
        events.on(_id, "Created", options.onCreate);
    }

    this.__defineGetter__("id", function () {
        return _id;
    });

    this.__defineGetter__("windowGroup", function () {
        return _windowGroup;
    });

    this.__defineGetter__("visible", function () {
        return !!qnx.callExtensionMethod("webview.isVisible", this.id);
    });

    this.__defineSetter__("visible", function (newVisibility) {
        qnx.callExtensionMethod("webview.setVisible", this.id, !!newVisibility);
    });

    this.__defineGetter__("active", function () {
        return qnx.callExtensionMethod("webview.isActive", this.id);
    });

    this.__defineSetter__("active", function (newActivity) {
        qnx.callExtensionMethod("webview.setActive", this.id, !!newActivity);
    });

    this.__defineGetter__("zOrder", function () {
        return qnx.callExtensionMethod("webview.zOrder", this.id);
    });

    this.__defineSetter__("zOrder", function (newZOrder) {
        qnx.callExtensionMethod("webview.setZOrder", this.id, parseInt(newZOrder, 10));
    });

    this.__defineGetter__("url", function () {
        return qnx.callExtensionMethod("webview.location", this.id);
    });

    this.__defineSetter__("url", function (newUrl) {
        qnx.callExtensionMethod("webview.loadURL", this.id, newUrl);
    });

    this.__defineGetter__("originalLocation", function () {
        return qnx.callExtensionMethod("webview.originalLocation", this.id);
    });

    this.__defineGetter__("enableCrossSiteXHR", function () {
        return qnx.callExtensionMethod("webview.isEnableCrossSiteXHR", this.id);
    });

    this.__defineSetter__("enableCrossSiteXHR", function (shouldEnable) {
        qnx.callExtensionMethod("webview.setEnableCrossSiteXHR", this.id, !!shouldEnable);
    });

    this.__defineGetter__("enableWebInspector", function () {
        return qnx.callExtensionMethod("webview.isEnableWebInspector", this.id);
    });

    this.__defineSetter__("enableWebInspector", function (shouldEnable) {
        qnx.callExtensionMethod("webview.setEnableWebInspector", this.id, !!shouldEnable);
    });

}

/**#@+
* @param {String} eventType The native event to be listened to. 
* Can be one of 'PropertyViewportEvent', 'QNXWebDestroyedEvent', 'Destroyed', 'Created', 'PropertyLoadProgressEvent', 'PropertyLocationEvent', 'PropertyTitleEvent', 'PropertyCanGoBackEvent', 'PropertyCanGoForwardEvent', 'PropertyFaviconEvent', 'PropertySecureTypeEvent', 'JavaScriptResult', 'ContentRendered', 'JavaScriptWindowObjectCleared', 'PropertyTooltipEvent', 'Created', 'DocumentLoadCommitted', 'DocumentLoaded', 'DocumentLoadFinished', 'LocationChange', 'LocationChanging', 'NetworkError', 'PropertyActiveEvent', 'PropertyBackgroundColorEvent', 'PropertyCertificateInfoEvent', 'PropertyContentRectangleEvent', 'PropertyEnableWebInspectorEvent', 'PropertyEncryptionInfoEvent', 'PropertyHistoryListEvent', 'PropertyHistoryPositionEvent', 'PropertyJavaScriptInterruptTimeoutEvent', 'PropertyOriginalLocationEvent', 'PropertyScaleEvent', 'PropertyScrollPositionEvent', 'PropertyStatusEvent', 'PropertyVisibleEvent', 'PropertyWebInspectorPortEvent', 'PropertyZOrderEvent'.
**/

/**
 * @description Adds a listener for a given event. Multiple listeners can be registered for the same event.
 * @param {callback} eventListener The function to be invoked when the event occurs
*/
WebView.prototype.addEventListener = function (eventType, eventListener) {
    events.on(this.id, eventType, eventListener); //What to put for scope???
};

/**
 * @description Removes a specific registered listener for a given event
 * @param {Object} eventListener The function to be removed from the list of event listeners
*/
WebView.prototype.removeEventListener = function (eventType, eventListener) {
    events.removeEventListener(this.id, eventType, eventListener);
};

/**
 * @description Dispatches an event of the provided type with the given arguments to all registered listeners.
 * @param {Object[]} args The array of objects to be passed to the event
*/
WebView.prototype.dispatchEvent = function (eventType, args) {
    events.emit(this.id, eventType, args);
};

/**#@-*/

/**
* @description Sets the location of the webview on the screen
* @param {Number} x The x position of the webview
* @param {Number} y The y position of the webview
* @param {Number} width The width of the webview
* @param {Number} height The height of the webview
*/
WebView.prototype.setGeometry = function (x, y, width, height) {
    qnx.callExtensionMethod("webview.setGeometry", this.id, x, y, width, height);
};

/**
* @description Destroys the underlying native webview
* @param {callback} [onComplete] A callback to be invoked when the destruction call is complete
*/ 
WebView.prototype.destroy = function (onComplete) {
    qnx.callExtensionMethod("webview.destroy", this.id);
    //Clear all event listeners for this webview
    events.clear(this.id);

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
WebView.prototype.executeJavaScript = function (js, inIsolatedWorld, onComplete) {
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
WebView.prototype.setBackgroundColor = function (color) {
    qnx.callExtensionMethod("webview.setBackgroundColor", this.id, color);
};

module.exports = WebView;
