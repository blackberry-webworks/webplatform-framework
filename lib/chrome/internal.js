/*
 * Copyright (C) Research In Motion Limited 2011-2012. All rights reserved.
 */
var webkitEvent = require('./../webkitEvent'),
    utils = require("./../utils"),
    chromeId = 1;

module.exports = {
    webEvent: function (id, eventId, value) {
        switch (eventId) {
        case 'PropertyViewportEvent':
        case 'QNXWebDestroyedEvent':
        case 'Destroyed':
        case 'Created':
        case 'PropertyLoadProgressEvent':
        case 'PropertyLocationEvent':
        case 'PropertyTitleEvent':
        case 'PropertyCanGoBackEvent':
        case 'PropertyCanGoForwardEvent':
        case 'PropertyFaviconEvent':
        case 'PropertySecureTypeEvent':
        case 'JavaScriptResult':
        case 'ContentRendered':
        case 'JavaScriptWindowObjectCleared':
        case 'PropertyTooltipEvent':
        case 'Created':
        case 'DocumentLoadCommitted':
        case 'DocumentLoaded':
        case 'DocumentLoadFinished':
        case 'LocationChange':
        case 'LocationChanging':
        case 'NetworkError':
        case 'PropertyActiveEvent':
        case 'PropertyBackgroundColorEvent':
        case 'PropertyCertificateInfoEvent':
        case 'PropertyContentRectangleEvent':
        case 'PropertyEnableWebInspectorEvent':
        case 'PropertyEncryptionInfoEvent':
        case 'PropertyHistoryListEvent':
        case 'PropertyHistoryPositionEvent':
        case 'PropertyJavaScriptInterruptTimeoutEvent':
        case 'PropertyOriginalLocationEvent':
        case 'PropertyScaleEvent':
        case 'PropertyScrollPositionEvent':
        case 'PropertyStatusEvent':
        case 'PropertyVisibleEvent':
        case 'PropertyWebInspectorPortEvent':
        case 'PropertyZOrderEvent':
            if (id !== chromeId) {
                webkitEvent.emit(id, eventId, [value]);
            }
            break;
        default:
            utils.getQnxNamespace().callExtensionMethod("webview.printToStderr", chromeId, "Unknown Event: " + eventId + ":" + value + "\n");
            break;
        }
    }
};
