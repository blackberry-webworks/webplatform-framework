var srcPath = __dirname + "/../../lib/";

describe("webviewFactory eventing", function () {

    var chrome = {
            internal : require(srcPath + "chrome/internal")
        },
        blackberry,
        utils = require(srcPath + "utils"), 
        events = [
            'PropertyViewportEvent', 
            'QNXWebDestroyedEvent', 
            'Destroyed', 
            'Created', 
            'PropertyLoadProgressEvent', 
            'PropertyLocationEvent', 
            'PropertyTitleEvent', 
            'PropertyCanGoBackEvent', 
            'PropertyCanGoForwardEvent', 
            'PropertyFaviconEvent', 
            'PropertySecureTypeEvent', 
            'JavaScriptResult', 
            'ContentRendered',
            'JavaScriptWindowObjectCleared', 
            'PropertyTooltipEvent', 
            'Created', 
            'DocumentLoadCommitted', 
            'DocumentLoaded', 
            'DocumentLoadFinished', 
            'LocationChange', 
            'LocationChanging', 
            'NetworkError', 
            'PropertyActiveEvent', 
            'PropertyBackgroundColorEvent', 
            'PropertyCertificateInfoEvent', 
            'PropertyContentRectangleEvent',
            'PropertyEnableWebInspectorEvent', 
            'PropertyEncryptionInfoEvent', 
            'PropertyHistoryListEvent', 
            'PropertyHistoryPositionEvent',
            'PropertyJavaScriptInterruptTimeoutEvent', 
            'PropertyOriginalLocationEvent', 
            'PropertyScaleEvent', 
            'PropertyScrollPositionEvent', 
            'PropertyStatusEvent',
            'PropertyVisibleEvent', 
            'PropertyWebInspectorPortEvent'];
        mockedQnx = require(srcPath + "mockedObjects").mockedQnx; 

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        blackberry = require(srcPath + "webviewFactory");
    });

    it("can create webviews that can listen to system events", function () {
        var webview = blackberry.createWebview(),
            callback = jasmine.createSpy(),
            value = {};
        webview.on('Created', callback);
        chrome.internal.webEvent(webview.id, 'Created', value);
        expect(callback).toHaveBeenCalled();
        /*events.forEach(function (event) {
            webview.on(event, spy);
            chrome.internal.webEvent(webview.id, event, value);
            expect(spy).toHaveBeenCalledWith([value]);
        });*/
    
    });
});

